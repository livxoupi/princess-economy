"use client";
import Link from "next/link";
import { useState } from "react";
import { useApp } from "../lib/store";
import { useRouter } from "next/navigation";

export default function Home() {
  const { ageVerified, setAgeVerified } = useApp();
  const [showGate, setShowGate] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  function handleCalcClick() {
    if (ageVerified) {
      router.push("/calc");
    } else {
      setShowGate(true);
    }
  }

  function handleVerify() {
    if (checked) {
      setAgeVerified(true);
      router.push("/calc");
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex justify-between items-center border-b border-[var(--border)]">
        <span className="font-display text-sm tracking-widest uppercase text-[var(--muted)]">
          Princess Economy
        </span>
        <span className="text-xs text-[var(--muted)] tracking-wide">18+ Entertainment</span>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="opacity-0 animate-fade-up stagger-1">
          <div className="inline-block border border-[var(--gold)] text-[var(--gold)] text-xs tracking-[0.2em] uppercase px-4 py-1.5 mb-8 rounded-full">
            Model Estimates · Entertainment Only
          </div>
        </div>

        <h1 className="opacity-0 animate-fade-up stagger-2 font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-tight mb-6 max-w-4xl">
          Princess<br />
          <span className="italic text-[var(--gold)]">Economy</span>
        </h1>

        <p className="opacity-0 animate-fade-up stagger-3 text-[var(--muted)] text-lg md:text-xl max-w-md mb-4 leading-relaxed font-body font-light">
          Reality — but make it aesthetic.
        </p>

        <p className="opacity-0 animate-fade-up stagger-3 text-[var(--muted)] text-sm max-w-sm mb-12 leading-relaxed font-body">
          A playful calculator for standards, leverage, and tradeoffs in the modern dating market.
        </p>

        <div className="opacity-0 animate-fade-up stagger-4 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={handleCalcClick}
            className="flex-1 bg-[var(--ink)] text-[var(--cream)] px-8 py-3.5 text-sm tracking-wider uppercase font-body hover:bg-[var(--gold)] transition-colors duration-300"
          >
            Run Your Numbers
          </button>
          <Link
            href="/result?sample=1"
            className="flex-1 border border-[var(--ink)] text-[var(--ink)] px-8 py-3.5 text-sm tracking-wider uppercase font-body text-center hover:bg-[var(--ink)] hover:text-[var(--cream)] transition-colors duration-300"
          >
            See Sample
          </Link>
        </div>

        {/* Decorative line */}
        <div className="opacity-0 animate-fade-up stagger-5 mt-20 flex items-center gap-4 text-xs text-[var(--muted)] tracking-widest uppercase">
          <div className="w-12 h-px bg-[var(--border)]" />
          <span>Not scientific advice</span>
          <div className="w-12 h-px bg-[var(--border)]" />
        </div>
      </section>

      {/* Features row */}
      <section className="border-t border-[var(--border)] grid grid-cols-1 md:grid-cols-3">
        {[
          { label: "Market Strength", desc: "How you actually position in your tier" },
          { label: "Expectation Gap", desc: "Distance between your ask and your offer" },
          { label: "Optimization Plan", desc: "Highest-leverage moves available to you" },
        ].map((f, i) => (
          <div
            key={i}
            className="px-8 py-8 border-b md:border-b-0 md:border-r border-[var(--border)] last:border-0"
          >
            <div className="text-[var(--gold)] text-xs tracking-[0.2em] uppercase mb-2 font-body">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="font-display text-lg mb-1">{f.label}</div>
            <div className="text-[var(--muted)] text-sm font-body font-light">{f.desc}</div>
          </div>
        ))}
      </section>

      {/* Age Gate Modal */}
      {showGate && (
        <div className="fixed inset-0 bg-[var(--ink)]/80 flex items-center justify-center z-50 px-6 animate-fade-in">
          <div className="bg-[var(--cream)] max-w-sm w-full p-8 text-center">
            <div className="font-display text-2xl mb-2">Age Verification</div>
            <p className="text-[var(--muted)] text-sm mb-6 font-body leading-relaxed">
              Princess Economy is intended for users 18 and older.
            </p>
            <label className="flex items-center gap-3 text-sm text-left mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="w-4 h-4 accent-[var(--ink)]"
              />
              <span className="font-body">I confirm I am 18 years of age or older.</span>
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setShowGate(false)}
                className="flex-1 border border-[var(--border)] text-[var(--muted)] px-4 py-2.5 text-sm font-body"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                disabled={!checked}
                className="flex-1 bg-[var(--ink)] text-[var(--cream)] px-4 py-2.5 text-sm font-body disabled:opacity-40 hover:bg-[var(--gold)] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
