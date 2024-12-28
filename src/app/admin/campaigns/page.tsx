import React from "react"
import CampaignsClient from "./client"
import { prisma } from "@/lib/prisma"

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany()

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <CampaignsClient campaigns={campaigns} />
    </div>
  )
}
