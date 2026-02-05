/**
 * Types for Rest Countries API v3.1
 * https://restcountries.com/v3.1/all
 */

export interface CountryName {
  common: string;
  official: string;
  nativeName?: Record<string, { official: string; common: string }>;
}

export interface Country {
  name: CountryName;
  cca2: string;
  cca3: string;
  region: string;
  subregion?: string;
  population: number;
  capital?: string[];
  flags: { png: string; svg: string; alt?: string };
  languages?: Record<string, string | undefined>;
  currencies?: Record<string, { name: string; symbol: string } | undefined>;
  capitalInfo?: { latlng?: number[] };
  latlng?: number[];
  area?: number;
  timezones?: string[];
  borders?: string[];
}

export interface CountryCardData {
  name: string;
  cca2: string;
  region: string;
  population: number;
  capital: string | null;
  flag: string;
}
