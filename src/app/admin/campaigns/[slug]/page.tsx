import { prisma } from "@/lib/prisma";
import { getCampaignDataInclude } from "@/lib/queries";
import React from "react";
import CampaignsForm from "./campaigns-form";

interface CampaignsSlugProps {
  params: {
    slug: string;
  };
}

export default async function CampaignsSlug({
  params,
}: CampaignsSlugProps) {
  const { slug } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: {
      slug: slug,
    },
    include: getCampaignDataInclude(),
  });

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <CampaignsForm campaign={campaign} />
    </div>
  );
}
