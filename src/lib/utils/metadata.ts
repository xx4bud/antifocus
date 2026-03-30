import type { Metadata } from "next";

/**
 * Extended metadata properties for SEO-friendly pages.
 * @extends Metadata
 */
export type CreateMetadataProps = Metadata & {
  /** Name of the application (appears in search results) */
  applicationName?: NonNullable<Metadata["applicationName"]>;
  /** Twitter creator handle (e.g., @username) */
  creator?:
    | NonNullable<Metadata["twitter"]>["creator"]
    | NonNullable<Metadata["creator"]>;
  /** Meta description for search engines (max 160 characters recommended) */
  description?: NonNullable<Metadata["description"]>;
  /** OpenGraph and Twitter image URLs for social sharing */
  image?:
    | NonNullable<Metadata["openGraph"]>["images"]
    | NonNullable<Metadata["twitter"]>["images"];
  /** Comma-separated keywords for search engines */
  keywords?: NonNullable<Metadata["keywords"]>;
  /** OpenGraph locale (e.g., en_US, id_ID) */
  locale?: NonNullable<Metadata["openGraph"]>["locale"];
  /** Page title (appears in browser tab and search results) */
  title?: NonNullable<Metadata["title"]>;
};

/**
 * Create metadata object with SEO, OpenGraph, and Twitter card settings.
 * @param override - Metadata properties to override defaults
 * @returns Complete Metadata object for Next.js pages
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export function createMetadata(override: CreateMetadataProps): Metadata {
  return {
    ...override,
    title: override.title,
    description: override.description,
    keywords: override.keywords,
    applicationName: override.applicationName,
    creator: override.creator,
    alternates: {
      canonical: override.alternates?.canonical,
      languages: override.alternates?.languages,
      ...override.alternates,
    },
    openGraph: {
      title: override.title,
      description: override.description,
      siteName: override.applicationName,
      images: override.image,
      type: "website" as const,
      locale: override.locale,
      url: override.alternates?.canonical
        ? (override.alternates.canonical as string)
        : undefined,
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: override.title,
      description: override.description,
      images: override.image,
      creator: override.creator,
      ...override.twitter,
    },
  };
}
