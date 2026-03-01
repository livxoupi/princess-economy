import type { Region } from "./scoring";

export const REGIONS: { value: Region; label: string; currency: string; symbol: string }[] = [
  { value: "US", label: "United States", currency: "USD", symbol: "$" },
  { value: "AU", label: "Australia", currency: "AUD", symbol: "A$" },
  { value: "UK", label: "United Kingdom", currency: "GBP", symbol: "£" },
  { value: "CA", label: "Canada", currency: "CAD", symbol: "C$" },
  { value: "OTHER", label: "Other", currency: "USD", symbol: "$" },
];

export function getRegionMeta(region: Region) {
  return REGIONS.find((r) => r.value === region) ?? REGIONS[0];
}
