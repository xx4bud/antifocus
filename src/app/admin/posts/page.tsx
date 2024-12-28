import React from "react"
import PostClient from "./client"
import { prisma } from "@/lib/prisma"

export default async function PostsPage() {
  const posts = await prisma.post.findMany()

  return (
    <div className="flex flex-col gap-4">
      <PostClient initialData={posts} />
    </div>
  )
}
