import prisma from "@/lib/prisma";
import { getCampaignDataInclude } from "@/types";
import { CampaignsForm } from "./campaigns-form";

interface CampaignsSlugProps {
  params: Promise<{ slug: string }>;
}

export default async function CampaignsSlug({
  params,
}: CampaignsSlugProps) {
  const { slug } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: {
      slug,
    },
    include: getCampaignDataInclude(),
  });
  return <CampaignsForm campaign={campaign} />;
}
