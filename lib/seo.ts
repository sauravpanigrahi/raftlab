import type { Metadata } from "next";
import type { Country } from "@/types/country";

const SITE_NAME = "World Countries Explorer";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://world-countries-explorer.vercel.app";

export function buildCountryJsonLd(country: Country, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Country",
    name: country.name.common,
    alternateName: country.name.official,
    description: `Facts and information about ${country.name.common}: population, capital, region, languages, and more.`,
    url,
    ...(country.capital?.[0] && { containedInPlace: { "@type": "City", name: country.capital[0] } }),
    ...(country.population != null && { numberOfPeople: country.population }),
    ...(country.area != null && { area: { "@type": "QuantitativeValue", value: country.area, unitCode: "KM2" } }),
    ...(country.region && { containedIn: { "@type": "Place", name: country.region } }),
  };
}

export function buildRegionJsonLd(region: string, countryCount: number, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: region,
    description: `Countries in ${region}: ${countryCount} countries with population and capital information.`,
    url,
    numberOfItems: countryCount,
  };
}

export function buildCountryMetadata(country: Country, url: string): Metadata {
  const title = `${country.name.common} - Population, Capital & Facts | ${SITE_NAME}`;
  const description =
    `Discover ${country.name.common}: population ${country.population.toLocaleString()}, capital ${country.capital?.[0] ?? "N/A"}, region ${country.region}. Facts, languages, currencies and more.`;
  const image = country.flags.png;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 800, alt: `Flag of ${country.name.common}` }],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export function buildRegionMetadata(region: string, countryCount: number, url: string): Metadata {
  const title = `Countries in ${region} (${countryCount}) | ${SITE_NAME}`;
  const description = `List of ${countryCount} countries in ${region}. Population, capitals, and quick facts.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: { card: "summary", title, description },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${SITE_NAME} - Country Facts, Population & Capitals`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Explore countries worldwide: population, capitals, regions, languages, and currencies. SEO-optimized country and region pages.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};
