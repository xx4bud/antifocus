import React from "react"
import CampaignsClient from "./client"
import { prisma } from "@/lib/prisma"
import { CampaignColumn } from "./_components/columns"
import { format } from "date-fns"
import { formatRelativeDate } from "@/lib/utils"

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    include: {
      photos: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const formattedCampaigns: CampaignColumn[] =
  campaigns.map((campaign) => ({
    ...campaign,
    photo: campaign.photos[0].url,
    createdAt: formatRelativeDate(campaign.createdAt),
    updatedAt: formatRelativeDate(campaign.updatedAt),
  }));

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <CampaignsClient campaigns={formattedCampaigns} />
    </div>
  )
}
