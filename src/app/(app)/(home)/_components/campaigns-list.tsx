import prisma from "@/lib/prisma";
import { CampaignsItem } from "@/app/(app)/(home)/_components/campaigns-item";
import { getCampaignDataInclude } from "@/types";

export async function CampaignsList() {
  const campaigns = await prisma.campaign.findMany({
    where: {
      isFeatured: true,
    },
    include: getCampaignDataInclude(),
    orderBy: {
      createdAt: "desc",
    },
  });

  return <CampaignsItem campaigns={campaigns} />;
}
