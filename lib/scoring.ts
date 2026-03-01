/**
 * Princess Economy — Scoring Engine
 *
 * All outputs are "model estimates" for entertainment purposes.
 * No census data. No scientific claims.
 */

export type Region = "US" | "AU" | "UK" | "CA" | "OTHER";
export type Lifestyle = "low" | "medium" | "high";
export type Commitment = "casual" | "serious" | "marriage";
export type Gender = "woman" | "man" | "nonbinary" | "prefer_not";

export interface CalcInputs {
  region: Region;
  age: number;
  gender: Gender;
  annualIncome: number;
  education: string;

  // Self ratings (1–10)
  looks: number;
  fitness: number;
  social: number;
  style: number;
  ambition: number;

  // Standards
  expectedPartnerIncome: number;
  minPartnerAttractiveness: number;
  lifestyleExpectation: Lifestyle;
  commitmentExpectation: Commitment;
  princessLevel: number; // 1–10

  harshMode: boolean;
}

export interface CalcResults {
  marketStrength: number;       // 0–100
  partnerTierMatch: number;     // 0–100 (%)
  expectationGap: number;       // 0–100
  princessProbability: number;  // 0–100 (%)
  attentionScore: number;       // 0–100
  insights: string[];
  harshInsights: string[];
}

// Regional income medians (approximate, not official)
const INCOME_MEDIANS: Record<Region, number> = {
  US: 56000,
  AU: 62000,
  UK: 34000,
  CA: 50000,
  OTHER: 45000,
};

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function clamp(val: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, val));
}

function incomePercentile(income: number, region: Region): number {
  const median = INCOME_MEDIANS[region];
  // Rough log-normal percentile estimate
  const ratio = income / median;
  return clamp(sigmoid((ratio - 1) * 1.5) * 100, 5, 98);
}

const LIFESTYLE_MULTIPLIER: Record<Lifestyle, number> = {
  low: 0.7,
  medium: 1.0,
  high: 1.6,
};

const COMMITMENT_MULTIPLIER: Record<Commitment, number> = {
  casual: 0.8,
  serious: 1.0,
  marriage: 1.3,
};

export function calculate(inputs: CalcInputs): CalcResults {
  const {
    region,
    looks, fitness, social, style, ambition,
    annualIncome, expectedPartnerIncome,
    minPartnerAttractiveness, lifestyleExpectation,
    commitmentExpectation, princessLevel,
  } = inputs;

  // --- Personal Market Strength ---
  const incomePct = incomePercentile(annualIncome, region);
  const rawPMS =
    looks * 4 +
    social * 4 +
    fitness * 3 +
    ambition * 3 +
    style * 2 +
    (incomePct / 10) * 2;

  const maxPMS = (10 * 4 + 10 * 4 + 10 * 3 + 10 * 3 + 10 * 2 + 9.8 * 2);
  const marketStrength = clamp((rawPMS / maxPMS) * 100);

  // --- Standards Cost ---
  const partnerIncomePct = incomePercentile(expectedPartnerIncome, region);
  const SC =
    (partnerIncomePct / 100) * 40 +
    minPartnerAttractiveness * 3 +
    princessLevel * 8 * LIFESTYLE_MULTIPLIER[lifestyleExpectation] +
    COMMITMENT_MULTIPLIER[commitmentExpectation] * 5;

  const scNormalized = clamp((SC / 180) * 100);

  // Location adjustment: urban markets slightly more competitive
  const locationAdjustment = region === "US" ? 2 : region === "UK" ? 1 : 0;

  // --- Partner Tier Match ---
  const partnerTierMatch = clamp(
    marketStrength - scNormalized * 0.6 + locationAdjustment
  );

  // --- Expectation Gap ---
  const expectationGap = clamp(scNormalized - marketStrength);

  // --- Princess Probability ---
  const incomeExpectationFactor = (partnerIncomePct - incomePct) / 20;
  const ppRaw = sigmoid(
    (marketStrength / 10 - 5) - (princessLevel * 9) / 10 - incomeExpectationFactor
  );
  const princessProbability = clamp(ppRaw * 100);

  // --- Attention Score ---
  const attnRaw = sigmoid((looks * 3 + social * 2 + style * 2) / 10 - 3.5);
  const attentionScore = clamp(attnRaw * 100);

  // --- Insights ---
  const insights = generateInsights(inputs, {
    marketStrength, partnerTierMatch, expectationGap,
    princessProbability, attentionScore,
  });

  const harshInsights = generateHarshInsights(inputs, {
    marketStrength, partnerTierMatch, expectationGap,
    princessProbability, attentionScore,
  });

  return {
    marketStrength: Math.round(marketStrength),
    partnerTierMatch: Math.round(partnerTierMatch),
    expectationGap: Math.round(expectationGap),
    princessProbability: Math.round(princessProbability),
    attentionScore: Math.round(attentionScore),
    insights,
    harshInsights,
  };
}

function generateInsights(
  inputs: CalcInputs,
  scores: Omit<CalcResults, "insights" | "harshInsights">
): string[] {
  const out: string[] = [];

  if (scores.expectationGap > 40) {
    out.push("Your standards significantly exceed your current market positioning. Narrowing this gap is the highest-leverage move available.");
  } else if (scores.expectationGap < 15) {
    out.push("Your expectations align reasonably well with your market value. You're operating with realistic parameters.");
  }

  if (inputs.princessLevel >= 7) {
    out.push("High princess-treatment expectations compress your eligible pool considerably — the math is unforgiving above level 7.");
  }

  if (inputs.social < 5) {
    out.push("Social skills carry an outsized weight in the model. A +2 improvement here outperforms most other upgrades.");
  }

  if (scores.attentionScore > 70) {
    out.push("You attract attention effectively. Converting that into commitment is a different equation.");
  }

  if (inputs.annualIncome < INCOME_MEDIANS[inputs.region] * 0.6) {
    out.push("Income is below regional median — this affects perceived stability signals more than raw attractiveness.");
  }

  if (out.length === 0) {
    out.push("Your profile is reasonably balanced. Incremental improvements in any top-weighted factor will compound.");
  }

  return out.slice(0, 3);
}

function generateHarshInsights(
  inputs: CalcInputs,
  scores: Omit<CalcResults, "insights" | "harshInsights">
): string[] {
  const out: string[] = [];

  if (scores.expectationGap > 50) {
    out.push("The gap between your offer and your ask represents a structural mismatch. The market will price this accurately, even if you don't.");
  }

  if (inputs.princessLevel >= 8) {
    out.push("Your target bracket represents a statistically narrow group relative to your current positioning. Supply-demand math is not in your favor.");
  }

  if (scores.partnerTierMatch < 35) {
    out.push("Current positioning yields access to roughly the bottom third of your stated target tier. This is a calibration problem, not a luck problem.");
  }

  if (inputs.looks > 8 && inputs.social < 5) {
    out.push("High aesthetic score paired with low social score has a poor conversion rate. Looks open doors. Charisma closes them.");
  }

  if (out.length === 0) {
    out.push("The model finds no critical misalignments. Execution risk is now your primary variable.");
  }

  return out.slice(0, 3);
}
