"use client";
import { useApp } from "../../lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import { calculate } from "../../lib/scoring";
import type { CalcResults } from "../../lib/scoring";

// Sample data for demo
const SAMPLE_RESULTS: CalcResults = {
  marketStrength: 64,
  partnerTierMatch: 41,
  expectationGap: 52,
  princessProbability: 73,
  attentionScore: 68,
  insights: [
    "Your standards significantly exceed your current market positioning. Narrowing this gap is the highest-leverage move available.",
    "Social skills carry an outsized weight in the model. A +2 improvement here outperforms most other upgrades.",
    "You attract attention effectively. Converting that into commitment is a different equation.",
  ],
  harshInsights: [
    "The gap between your offer and your ask represents a structural mismatch. The market will price this accurately, even if you don't.",
    "Your target bracket represents a statistically narrow group relative to your current positioning. Supply-demand math is not in your favor.",
  ],
};

function ResultsContent() {
  const { results, inputs, isPaid, setIsPaid } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSample = searchParams.get("sample") === "1";
  const cardRef = useRef<HTMLDivElement>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [copied, setCopied] = useState(false);

  const data = isSample ? SAMPLE_RESULTS : results;
  const isHarsh = inputs.harshMode && isPaid;

  useEffect(() => {
    if (!isSample && !data) {
      router.replace("/calc");
    }
  }, [data, isSample, router]);

  if (!data) return null;

  const insights = isHarsh ? data.harshInsights : data.insights;

  async function handleDownload() {
    // Basic screenshot using Canvas — works client-side without deps
    const card = cardRef.current;
    if (!card) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(card, { backgroundColor: "#1A1814", scale: 2 });
      const link = document.createElement("a");
      link.download = "princess-economy.png";
      link.href = canvas.toDataURL();
      link.click();
    } catch {
      alert("Install html2canvas to enable image download: npm install html2canvas");
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen">
      <header className="px-6 py-5 border-b border-[var(--border)] flex justify-between items-center sticky top-0 bg-[var(--cream)] z-10">
        <button onClick={() => router.push("/calc")} className="text-[var(--muted)] text-xs tracking-widest uppercase font-body hover:text-[var(--ink)] transition-colors">
          ← Recalculate
        </button>
        <span className="font-display text-sm tracking-widest uppercase text-[var(--muted)]">
          Results
        </span>
        <span className="text-xs text-[var(--muted)]">Model estimate</span>
      </header>

      <div className="max-w-lg mx-auto px-6 py-10 space-y-8">
        {isSample && (
          <div className="border border-[var(--gold)] text-[var(--gold)] text-xs text-center py-2 px-4 tracking-widest uppercase font-body">
            Sample Results — Run your own numbers to get personalized output
          </div>
        )}

        {/* Share Card */}
        <div
          ref={cardRef}
          className="bg-[var(--ink)] text-[var(--cream)] p-8 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-48 h-48 border border-[var(--gold)]/10 rounded-full translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border border-[var(--gold)]/10 rounded-full -translate-x-10 translate-y-10" />

          <div className="relative z-10">
            <div className="text-[var(--gold)] text-xs tracking-[0.25em] uppercase font-body mb-6">
              Princess Economy · Model Estimate
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <ScoreBlock label="Market Strength" value={data.marketStrength} />
              <ScoreBlock label="Partner Match" value={data.partnerTierMatch} suffix="%" />
              <ScoreBlock label="Expectation Gap" value={data.expectationGap} />
              <ScoreBlock label="Attention Score" value={data.attentionScore} />
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between items-center">
              <div>
                <div className="text-xs text-white/40 uppercase tracking-widest font-body mb-1">Princess Probability</div>
                <div className="font-display text-3xl">{data.princessProbability}<span className="text-lg text-white/60">%</span></div>
              </div>
              <div className="text-right">
                <div className="text-white/30 text-[10px] tracking-widest uppercase font-body">PrincessEconomy.app</div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-[var(--gold)] text-xs tracking-[0.2em] font-body">Analysis</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="p-4 border border-[var(--border)] text-sm text-[var(--muted)] font-body leading-relaxed animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
              >
                <span className="text-[var(--gold)] font-display mr-2">"</span>
                {insight}
              </div>
            ))}
          </div>
        </section>

        {/* Full report blur for free users */}
        {!isPaid && (
          <section className="relative">
            <div className="p-6 border border-[var(--border)] space-y-3 blur-sm pointer-events-none select-none" aria-hidden="true">
              <div className="text-sm font-body text-[var(--muted)]">Long-term probability analysis suggests your current trajectory produces a significant compression in viable options after age 30...</div>
              <div className="text-sm font-body text-[var(--muted)]">Optimization pathways: (1) Increase social score by 2 points — highest ROI lever available. (2) Recalibrate income expectations by 15–20%...</div>
              <div className="text-sm font-body text-[var(--muted)]">Harsh mode insight: The data does not support your current positioning relative to stated targets...</div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--cream)]/80 backdrop-blur-sm">
              <div className="font-display text-xl mb-2">Full Report</div>
              <p className="text-[var(--muted)] text-sm text-center max-w-xs mb-5 font-body">
                Unlock the complete breakdown, Harsh Mode, and your Optimization Plan.
              </p>
              <button
                onClick={() => setShowPaywall(true)}
                className="bg-[var(--ink)] text-[var(--cream)] px-8 py-3 text-sm tracking-widest uppercase font-body hover:bg-[var(--gold)] transition-colors"
              >
                Unlock Full Report
              </button>
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="border border-[var(--ink)] text-[var(--ink)] py-3 text-xs tracking-widest uppercase font-body hover:bg-[var(--ink)] hover:text-[var(--cream)] transition-colors"
          >
            Download Card
          </button>
          <button
            onClick={handleCopyLink}
            className="border border-[var(--ink)] text-[var(--ink)] py-3 text-xs tracking-widest uppercase font-body hover:bg-[var(--ink)] hover:text-[var(--cream)] transition-colors"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>

        <button
          onClick={() => router.push("/calc")}
          className="w-full bg-[var(--ink)] text-[var(--cream)] py-3.5 text-sm tracking-widest uppercase font-body hover:bg-[var(--gold)] transition-colors"
        >
          Run Again
        </button>

        <p className="text-[var(--muted)] text-xs text-center font-body">
          This is entertainment + reflection. Not scientific advice.
        </p>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-[var(--ink)]/80 flex items-center justify-center z-50 px-6">
          <div className="bg-[var(--cream)] max-w-sm w-full p-8">
            <div className="font-display text-2xl mb-1">Full Report</div>
            <p className="text-[var(--muted)] text-sm mb-6 font-body leading-relaxed">
              Unlock the complete breakdown and Optimization Plan.
            </p>

            <div className="space-y-2 mb-6 text-sm font-body">
              {[
                "Complete score breakdown",
                "Harsh Mode enabled",
                "Long-term probability curves",
                "Personalized Optimization Plan",
                "Watermark-free download",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-[var(--muted)]">
                  <span className="text-[var(--gold)]">✓</span> {f}
                </div>
              ))}
            </div>

            <div className="text-center mb-6">
              <div className="font-display text-3xl">$4.99</div>
              <div className="text-xs text-[var(--muted)] font-body">One-time purchase</div>
            </div>

            <button
              onClick={() => {
                // Stripe integration point — simulate for MVP
                setIsPaid(true);
                setShowPaywall(false);
              }}
              className="w-full bg-[var(--ink)] text-[var(--cream)] py-3.5 text-sm tracking-widest uppercase font-body hover:bg-[var(--gold)] transition-colors mb-3"
            >
              Unlock Now → (Demo)
            </button>
            <button
              onClick={() => setShowPaywall(false)}
              className="w-full text-[var(--muted)] text-xs tracking-widest uppercase font-body py-2"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--muted)]">Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}

function ScoreBlock({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div>
      <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-body mb-1">{label}</div>
      <div className="font-display text-4xl leading-none">
        {value}<span className="text-xl text-white/50">{suffix}</span>
      </div>
      <div className="mt-1.5 h-0.5 bg-white/10 relative">
        <div
          className="absolute inset-y-0 left-0 bg-[var(--gold)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
