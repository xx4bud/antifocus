import React from "react"
import CampaignsClient from "./client"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { id, enUS } from "date-fns/locale"
import { CampaignColumn } from "./_components/columns"

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    include: {
      photos: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const currentLocale =
    typeof window !== "undefined"
      ? navigator.language
      : "en"
  const locale = currentLocale === "id" ? id : enUS

  const formattedCampaigns: CampaignColumn[] =
    campaigns.map((campaign) => ({
      ...campaign,
      photo: campaign.photos[0].url,
      createdAt: format(
        new Date(campaign.createdAt),
        "MMM dd, yyyy",
        { locale }
      ),
      updatedAt: format(
        new Date(campaign.updatedAt),
        "MMM dd, yyyy",
        { locale }
      ),
    }))

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <CampaignsClient initialData={formattedCampaigns} />
    </div>
  )
}
