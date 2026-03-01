"use client";
import React, { createContext, useContext, useState } from "react";
import type { CalcInputs, CalcResults } from "./scoring";

interface AppState {
  inputs: Partial<CalcInputs>;
  results: CalcResults | null;
  ageVerified: boolean;
  isPaid: boolean;
  setInputs: (inputs: Partial<CalcInputs>) => void;
  setResults: (r: CalcResults) => void;
  setAgeVerified: (v: boolean) => void;
  setIsPaid: (v: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [inputs, setInputs] = useState<Partial<CalcInputs>>({
    region: "US",
    age: 25,
    gender: "woman",
    annualIncome: 55000,
    looks: 6,
    fitness: 6,
    social: 6,
    style: 6,
    ambition: 6,
    expectedPartnerIncome: 80000,
    minPartnerAttractiveness: 7,
    lifestyleExpectation: "medium",
    commitmentExpectation: "serious",
    princessLevel: 5,
    harshMode: false,
  });
  const [results, setResults] = useState<CalcResults | null>(null);
  const [ageVerified, setAgeVerified] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  return (
    <AppContext.Provider value={{
      inputs, results, ageVerified, isPaid,
      setInputs: (i) => setInputs((prev) => ({ ...prev, ...i })),
      setResults,
      setAgeVerified,
      setIsPaid,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
