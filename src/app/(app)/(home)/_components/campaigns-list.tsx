import prisma from "@/lib/prisma";
import { getCampaignDataInclude } from "@/types";
import { CampaignsItem } from "@/app/(app)/(home)/_components/campaigns-item";

export async function CampaignsList() {
  const campaigns = await prisma.campaign.findMany({
    where: {
      isFeatured: true,
    },
    include: getCampaignDataInclude(),
    orderBy: {
      name: "asc",
    },
  });
  return <CampaignsItem campaigns={campaigns} />;
}
