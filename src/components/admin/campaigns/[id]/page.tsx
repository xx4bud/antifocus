import { prisma } from "@/lib/prisma"
import React from "react"
import CampaignsForm from "./campaigns-form"
import { getCampaign } from "@/lib/queries"
import { Metadata } from "next"

interface CampaignsSlugProps {
  params: {
    id: string
  }
}

// export const generateStaticParams = async () => {
//   const campaigns = await prisma.campaign.findMany()

//   return campaigns.map((campaign) => ({
//     id: campaign.id,
//   }))
// }

export default async function CampaignsSlug({
  params,
}: CampaignsSlugProps) {
  const { id } = await params

  // const campaign = await getCampaign(id)

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { photos: true },
  })

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <CampaignsForm initialData={campaign} />
    </div>
  )
}
