import { CampaignsList } from "@/app/(app)/(home)/_components/campaigns-list";

export default function HomePage() {
  return (
    <div className="container flex flex-1 flex-col">
      <CampaignsList />
      <div className="flex flex-col gap-4 py-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50 sm:hidden" />
        <div className="aspect-video rounded-xl bg-muted/50 sm:hidden" />
      </div>
    </div>
  );
}
