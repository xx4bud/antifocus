import prisma from "@/lib/prisma";
import { getCollectionDataInclude } from "@/types";
import CollectionsClient from "@/app/(dashboard)/admin/collections/client";

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    include: getCollectionDataInclude(),
    orderBy: {
      name: "asc",
    },
  });
  return <CollectionsClient collections={collections}/>
}
