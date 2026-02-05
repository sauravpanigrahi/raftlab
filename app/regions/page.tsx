import Link from "next/link";
import { getRegions } from "@/lib/countries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Regions of the world",
  description:
    "Browse countries by region: Africa, Americas, Asia, Europe, Oceania, Antarctic. SEO-optimized region pages.",
};

export default async function RegionsPage() {
  const regions = await getRegions();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        Browse by region
      </h1>
      <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
        Select a region to see all countries with population and capital info.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((region) => (
          <li key={region}>
            <Link
              href={`/region/${encodeURIComponent(region)}`}
              className="block rounded-xl border border-slate-200 bg-white p-4 font-medium text-slate-900 shadow-sm transition hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-emerald-800"
            >
              {region}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
