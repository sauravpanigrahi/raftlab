import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCountryByCode } from "@/lib/countries";
import { buildCountryJsonLd, buildCountryMetadata } from "@/lib/seo";
import { formatPopulation } from "@/lib/countries";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://world-countries-explorer.vercel.app";

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { code } = await params;
  const country = await getCountryByCode(code);
  if (!country) return { title: "Country not found" };
  const url = `${BASE_URL}/country/${country.cca2}`;
  return buildCountryMetadata(country, url);
}

export default async function CountryPage({ params }: PageProps) {
  const { code } = await params;
  const country = await getCountryByCode(code);
  if (!country) notFound();

  const url = `${BASE_URL}/country/${country.cca2}`;
  const jsonLd = buildCountryJsonLd(country, url);

  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "—";
  const currencies = country.currencies
    ? Object.entries(country.currencies)
      .filter(([_, v]) => v !== undefined)
      .map(([_, v]) => `${v!.name} (${v!.symbol})`)
      .join(", ")
    : "—";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          ← All countries
        </Link>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
          <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800 sm:w-80">
            <Image
              src={country.flags.png}
              alt={country.flags.alt ?? `Flag of ${country.name.common}`}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {country.name.common}
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {country.name.official}
            </p>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Region
                </dt>
                <dd>
                  <Link
                    href={`/region/${encodeURIComponent(country.region)}`}
                    className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    {country.region}
                  </Link>
                  {country.subregion && ` · ${country.subregion}`}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Population
                </dt>
                <dd className="font-medium">{formatPopulation(country.population)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Capital
                </dt>
                <dd>{country.capital?.[0] ?? "—"}</dd>
              </div>
              {country.area != null && (
                <div>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Area
                  </dt>
                  <dd>
                    {country.area.toLocaleString()} km²
                  </dd>
                </div>
              )}
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Languages
                </dt>
                <dd>{languages}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Currencies
                </dt>
                <dd>{currencies}</dd>
              </div>
            </dl>
          </div>
        </div>
      </article>
    </>
  );
}
