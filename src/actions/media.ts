"use server";

import { prisma } from "@/lib/prisma";
import { getMediaInclude } from "@/lib/types";

export const getMediaById = async (id: string) => {
  const decodedId = decodeURIComponent(id);
  const media = await prisma.media.findFirst({
    where: { id: decodedId },
    include: getMediaInclude(),
  });
  return media ? JSON.parse(JSON.stringify(media)) : null;
};

export const getAllMedia = async () => {
  const allMedia = await prisma.media.findMany({
    include: getMediaInclude(),
  });
  return allMedia
    ? JSON.parse(JSON.stringify(allMedia))
    : [];
};
