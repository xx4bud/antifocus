import { getAllMedia } from "@/actions/media";
import { MediaTable } from "./media-table";

export default async function Media() {
  const media = await getAllMedia();

  return <MediaTable media={media} />;
}
