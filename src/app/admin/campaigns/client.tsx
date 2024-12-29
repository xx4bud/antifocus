"use client"

import { Heading } from "@/components/ui/heading"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { CampaignColumn, columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"

interface CaampaignsClientProps {
  campaigns: CampaignColumn[]
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

      <DataTable columns={columns} data={campaigns} />
    </div>
  )
}
