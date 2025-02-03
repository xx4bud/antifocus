"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CategoryData } from "@/types";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

interface CategoriesClientProps {
  categories: CategoryData[];
}

export function CategoriesClient({
  categories,
}: CategoriesClientProps) {
  return (
    <div className="flex flex-1 flex-col">
      <Heading
        title="Categories"
        amount={categories.length}
        description="Manage our categories"
        button={
          <Button asChild>
            <Link href={"/admin/categories/new"}>
              <Plus />
              Create
            </Link>
          </Button>
        }
      />
      <Separator className="my-3" />
    </div>
  );
}
