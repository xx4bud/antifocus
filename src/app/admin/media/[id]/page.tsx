import { getMediaById } from "@/actions/media";
import { MediaForm } from "./media-form";
import { prisma } from "@/lib/prisma";

interface MediaIdProps {
  params: Promise<{ id: string }>;
}

export default async function MediaId({
  params,
}: MediaIdProps) {
  const { id } = await params;
  const media = await getMediaById(id);

  return <MediaForm media={media} />;
}

export async function generateStaticParams() {
  const media = await prisma.media.findMany({
    select: {
      id: true,
    },
  });
  return media.map((media) => ({
    id: media.id.toString(),
  }));
}
