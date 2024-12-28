"use client"

import { Heading } from "@/components/ui/heading"
import { Campaign } from "@prisma/client"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface CaampaignsClientProps {
  campaigns: Campaign[]
}

export default function CampaignsClient({
  campaigns,
}: CaampaignsClientProps) {
  return (
    <div className="flex h-fit w-full flex-col overflow-auto rounded-lg border bg-card p-4">
      <Heading
        title="Campaigns"
        amount={campaigns.length}
        description="Manage your campaigns and categories"
        button={
          <Button asChild>
            <Link href={"/admin/campaigns/add"}>
              <Plus />
              Create
            </Link>
          </Button>
        }
      />
      <Separator className="my-3" />

      <div className="flex flex-col gap-4">
        {campaigns.map((campaign) => (
          <Link
            key={campaign.id}
            href={`/admin/campaigns/${campaign.slug}`}
          >
            <span>{campaign.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
