"use client";

import { useMemo, useState } from "react";
import { CountryCard } from "./CountryCard";
import type { CountryCardData } from "@/types/country";

interface CountryGridProps {
  countries: CountryCardData[];
  showFilter?: boolean;
}

export function CountryGrid({ countries, showFilter = true }: CountryGridProps) {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");

  const regions = useMemo(() => {
    const set = new Set(countries.map((c) => c.region).filter(Boolean));
    return Array.from(set).sort();
  }, [countries]);

  const filtered = useMemo(() => {
    return countries.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.capital && c.capital.toLowerCase().includes(search.toLowerCase()));
      const matchRegion = !regionFilter || c.region === regionFilter;
      return matchSearch && matchRegion;
    });
  }, [countries, search, regionFilter]);

  if (!showFilter) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((c) => (
          <CountryCard key={c.cca2} country={c} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search by country or capital..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-400"
          aria-label="Search countries"
        />
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          aria-label="Filter by region"
        >
          <option value="">All regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Showing {filtered.length} of {countries.length} countries
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <CountryCard key={c.cca2} country={c} />
        ))}
      </div>
    </>
  );
}
