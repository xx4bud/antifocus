'use client'

import { Category } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import Link from "next/link"

interface CategoriesClientProps {
    categories: Category[]
}
export default function CategoriesClient({
    categories
}: CategoriesClientProps) {
  return (
    <div className="flex flex-col overflow-auto rounded-lg border bg-card p-4">
      <Heading
        title="Categories"
        amount={categories.length}
        description="Manage your categories"
        button={
          <Button asChild>
            <Link href={"/admin/categories/add"}>
              <Plus />
              Create
            </Link>
          </Button>
        }
      />
      <Separator className="my-3" />

      {/* <div className="container-wrapper">
        <DataTable columns={columns} data={categories} />
      </div> */}
    </div>
  )
}
