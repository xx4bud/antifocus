import { getSession } from "@/lib/utils";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="container flex flex-1 flex-col">
      <div className="flex flex-col gap-4 py-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50 sm:hidden" />
        <div className="aspect-video rounded-xl bg-muted/50 sm:hidden" />
      </div>
    </div>
  );
}
