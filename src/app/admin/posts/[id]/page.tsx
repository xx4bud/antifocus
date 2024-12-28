import { prisma } from "@/lib/prisma"
import React from "react"
import PostDetailsClient from "./client"
interface Props {
  params: {
    id: string
  }
}
export default async function PostDetails({
  params,
}: Props) {
  const { id } = await params
  const post = await prisma.post.findUnique({
    where: { id },
  })
  return <div>
    <PostDetailsClient initialData={post} 
    // params={params}
    />
  </div>
}
