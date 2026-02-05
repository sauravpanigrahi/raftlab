import type { Country, CountryCardData } from "@/types/country";
import countriesData from "./data/countries.json";

let cachedCountries: Country[] | null = null;

/** Load countries from JSON file */
function loadCountriesFromJson(): Country[] {
  if (cachedCountries) {
    return cachedCountries;
  }
  
  // Type assertion since we know the JSON structure matches
  cachedCountries = countriesData as Country[];
  return cachedCountries;
}

/** Fetch all countries (for home and region pages) */
export async function getAllCountries(): Promise<Country[]> {
  return loadCountriesFromJson();
}

/** Fetch a single country by alpha-2 or alpha-3 code */
export async function getCountryByCode(code: string): Promise<Country | null> {
  const normalized = code.length === 2 ? code.toUpperCase() : code;
  const countries = loadCountriesFromJson();
  
  const found = countries.find(
    (c) => c.cca2?.toLowerCase() === normalized.toLowerCase() || 
           c.cca3?.toLowerCase() === normalized.toLowerCase()
  );
  
  return found ?? null;
}

/** Fetch countries in a region */
export async function getCountriesByRegion(region: string): Promise<Country[]> {
  const countries = loadCountriesFromJson();
  return countries.filter((c) => c.region === region);
}

/** Get list of unique regions for programmatic region pages */
export async function getRegions(): Promise<string[]> {
  const countries = await getAllCountries();
  const regions = new Set(countries.map((c) => c.region).filter(Boolean));
  return Array.from(regions).sort();
}

export function toCardData(c: Country): CountryCardData {
  return {
    name: c.name.common,
    cca2: c.cca2,
    region: c.region,
    population: c.population,
    capital: c.capital?.[0] ?? null,
    flag: c.flags.png,
  };
}

export function formatPopulation(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
