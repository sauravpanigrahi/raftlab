import { getAllCountries, toCardData } from "@/lib/countries";
import { CountryGrid } from "@/components/CountryGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const countries = await getAllCountries();
  const cardData = countries.map(toCardData);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Explore countries of the world
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Population, capitals, regions, and quick facts. Click a country for full details.
        </p>
      </div>
      <CountryGrid countries={cardData} showFilter />
    </div>
  );
}
