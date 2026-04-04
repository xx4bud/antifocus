import type { Metadata } from "next";

export type CreateMetadataProps = Metadata & {
  applicationName?: NonNullable<Metadata["applicationName"]>;
  creator?:
    | NonNullable<Metadata["twitter"]>["creator"]
    | NonNullable<Metadata["creator"]>;
  description?: NonNullable<Metadata["description"]>;
  image?:
    | NonNullable<Metadata["openGraph"]>["images"]
    | NonNullable<Metadata["twitter"]>["images"];
  keywords?: NonNullable<Metadata["keywords"]>;
  locale?: NonNullable<Metadata["openGraph"]>["locale"];
  title?: NonNullable<Metadata["title"]>;
};

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
