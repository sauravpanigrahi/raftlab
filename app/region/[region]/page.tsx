import { notFound } from "next/navigation";
import Link from "next/link";
import { getCountriesByRegion } from "@/lib/countries";
import { buildRegionJsonLd, buildRegionMetadata } from "@/lib/seo";
import { CountryGrid } from "@/components/CountryGrid";
import { toCardData } from "@/lib/countries";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://world-countries-explorer.vercel.app";

interface PageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { region } = await params;
  const decoded = decodeURIComponent(region);
  const countries = await getCountriesByRegion(decoded);
  if (!countries.length) return { title: "Region not found" };
  const url = `${BASE_URL}/region/${encodeURIComponent(decoded)}`;
  return buildRegionMetadata(decoded, countries.length, url);
}

export default async function RegionPage({ params }: PageProps) {
  const { region } = await params;
  const decoded = decodeURIComponent(region);
  const countries = await getCountriesByRegion(decoded);
  if (!countries.length) notFound();

  const url = `${BASE_URL}/region/${encodeURIComponent(decoded)}`;
  const jsonLd = buildRegionJsonLd(decoded, countries.length, url);
  const cardData = countries.map(toCardData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          ← All countries
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Countries in {decoded}
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          {countries.length} countries with population and capital information.
        </p>
        <div className="mt-8">
          <CountryGrid countries={cardData} showFilter={false} />
        </div>
      </div>
    </>
  );
}
