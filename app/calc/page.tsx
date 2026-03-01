"use client";
import { useRouter } from "next/navigation";
import { useApp } from "../../lib/store";
import { calculate } from "../../lib/scoring";
import { REGIONS, getRegionMeta } from "../../lib/regions";
import type { CalcInputs } from "../../lib/scoring";
import { useEffect } from "react";

const SLIDER_FIELDS: { key: keyof CalcInputs; label: string; hint: string }[] = [
  { key: "looks", label: "Looks", hint: "Physical appearance baseline" },
  { key: "fitness", label: "Fitness", hint: "Health & physical form" },
  { key: "social", label: "Charisma", hint: "Social fluency & presence" },
  { key: "style", label: "Style", hint: "Presentation & aesthetic" },
  { key: "ambition", label: "Ambition", hint: "Drive & trajectory" },
];

export default function CalcPage() {
  const { inputs, setInputs, setResults, ageVerified } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!ageVerified) router.replace("/");
  }, [ageVerified, router]);

  const region = (inputs.region ?? "US") as CalcInputs["region"];
  const meta = getRegionMeta(region);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const full = inputs as CalcInputs;
    const results = calculate(full);
    setResults(results);
    router.push("/result");
  }

  return (
    <main className="min-h-screen">
      <header className="px-6 py-5 border-b border-[var(--border)] flex justify-between items-center sticky top-0 bg-[var(--cream)] z-10">
        <button onClick={() => router.push("/")} className="text-[var(--muted)] text-xs tracking-widest uppercase font-body hover:text-[var(--ink)] transition-colors">
          ← Back
        </button>
        <span className="font-display text-sm tracking-widest uppercase text-[var(--muted)]">
          Calculator
        </span>
        <span className="text-xs text-[var(--muted)]">Model estimate</span>
      </header>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-6 py-10 space-y-10">
        {/* Section: Basic Info */}
        <section className="space-y-5">
          <SectionHeader num="01" title="Basic Info" />

          <div className="space-y-4">
            <Field label="Region">
              <select
                value={inputs.region}
                onChange={(e) => setInputs({ region: e.target.value as CalcInputs["region"] })}
                className="input-base"
              >
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Age">
                <input
                  type="number"
                  min={18} max={60}
                  value={inputs.age}
                  onChange={(e) => setInputs({ age: Number(e.target.value) })}
                  className="input-base"
                />
              </Field>

              <Field label="Gender">
                <select
                  value={inputs.gender}
                  onChange={(e) => setInputs({ gender: e.target.value as CalcInputs["gender"] })}
                  className="input-base"
                >
                  <option value="woman">Woman</option>
                  <option value="man">Man</option>
                  <option value="nonbinary">Non-binary</option>
                  <option value="prefer_not">Prefer not to say</option>
                </select>
              </Field>
            </div>

            <Field label={`Annual Income (${meta.symbol})`}>
              <input
                type="number"
                min={0}
                value={inputs.annualIncome}
                onChange={(e) => setInputs({ annualIncome: Number(e.target.value) })}
                className="input-base"
                placeholder={`e.g. 55000`}
              />
            </Field>

            <Field label="Education (optional)">
              <select
                value={inputs.education ?? ""}
                onChange={(e) => setInputs({ education: e.target.value })}
                className="input-base"
              >
                <option value="">Select</option>
                <option value="hs">High School</option>
                <option value="some_college">Some College</option>
                <option value="bachelors">Bachelor's</option>
                <option value="masters">Master's</option>
                <option value="phd">PhD / Professional</option>
              </select>
            </Field>
          </div>
        </section>

        {/* Section: Self Ratings */}
        <section className="space-y-5">
          <SectionHeader num="02" title="Self Assessment" />
          <div className="space-y-5">
            {SLIDER_FIELDS.map(({ key, label, hint }) => (
              <SliderField
                key={key}
                label={label}
                hint={hint}
                value={(inputs[key] as number) ?? 5}
                onChange={(v) => setInputs({ [key]: v })}
              />
            ))}
          </div>
        </section>

        {/* Section: Standards */}
        <section className="space-y-5">
          <SectionHeader num="03" title="Your Standards" />

          <div className="space-y-4">
            <Field label={`Expected Partner Income (${meta.symbol})`}>
              <input
                type="number"
                min={0}
                value={inputs.expectedPartnerIncome}
                onChange={(e) => setInputs({ expectedPartnerIncome: Number(e.target.value) })}
                className="input-base"
              />
            </Field>

            <SliderField
              label="Min Partner Attractiveness"
              hint="Your floor, on a 1–10 scale"
              value={inputs.minPartnerAttractiveness ?? 7}
              onChange={(v) => setInputs({ minPartnerAttractiveness: v })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Field label="Lifestyle Expectation">
                <select
                  value={inputs.lifestyleExpectation}
                  onChange={(e) => setInputs({ lifestyleExpectation: e.target.value as CalcInputs["lifestyleExpectation"] })}
                  className="input-base"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </Field>

              <Field label="Commitment Goal">
                <select
                  value={inputs.commitmentExpectation}
                  onChange={(e) => setInputs({ commitmentExpectation: e.target.value as CalcInputs["commitmentExpectation"] })}
                  className="input-base"
                >
                  <option value="casual">Casual</option>
                  <option value="serious">Serious</option>
                  <option value="marriage">Marriage</option>
                </select>
              </Field>
            </div>

            <SliderField
              label="Princess Treatment Level"
              hint="Expected effort, attention & provision from a partner"
              value={inputs.princessLevel ?? 5}
              onChange={(v) => setInputs({ princessLevel: v })}
              highLabel="Royal treatment"
              lowLabel="Independent"
            />
          </div>
        </section>

        {/* Disclaimer */}
        <p className="text-[var(--muted)] text-xs text-center font-body leading-relaxed">
          This is entertainment + reflection. Not scientific advice.
          Results are heuristic model estimates only.
        </p>

        <button
          type="submit"
          className="w-full bg-[var(--ink)] text-[var(--cream)] py-4 text-sm tracking-widest uppercase font-body hover:bg-[var(--gold)] transition-colors duration-300"
        >
          Calculate Results →
        </button>
      </form>
    </main>
  );
}

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-4 pb-2 border-b border-[var(--border)]">
      <span className="text-[var(--gold)] text-xs tracking-[0.2em] font-body">{num}</span>
      <span className="font-display text-xl">{title}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs tracking-widest uppercase text-[var(--muted)] font-body block">{label}</label>
      {children}
    </div>
  );
}

function SliderField({
  label, hint, value, onChange, lowLabel = "1", highLabel = "10"
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
  lowLabel?: string;
  highLabel?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <div>
          <span className="text-xs tracking-widest uppercase text-[var(--muted)] font-body">{label}</span>
          <span className="ml-2 text-xs text-[var(--muted)] font-body">{hint}</span>
        </div>
        <span className="font-display text-lg text-[var(--ink)]">{value}</span>
      </div>
      <input
        type="range"
        min={1} max={10} step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between text-[10px] text-[var(--muted)] font-body tracking-wide">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
