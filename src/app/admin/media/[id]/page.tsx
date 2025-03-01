import { getMediaById } from "@/actions/media";
import { MediaForm } from "./media-form";

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
