import Link from "next/link";
import Image from "next/image";
import type { CountryCardData } from "@/types/country";
import { formatPopulation } from "@/lib/countries";

interface CountryCardProps {
  country: CountryCardData;
}

export function CountryCard({ country }: CountryCardProps) {
  return (
    <Link
      href={`/country/${country.cca2}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-800"
    >
      <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800">
        <Image
          src={country.flag}
          alt={`Flag of ${country.name}`}
          fill
          className="object-cover transition group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-semibold text-slate-900 dark:text-white">{country.name}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {country.region}
          {country.capital && ` · ${country.capital}`}
        </p>
        <p className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          Pop. {formatPopulation(country.population)}
        </p>
      </div>
    </Link>
  );
}
