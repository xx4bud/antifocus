import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/queries'
import Link from 'next/link'
import React from 'react'

export default async function HomePage() {
  const session = await getSession()

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })
  return (
    <div>
      <h1>Home</h1>
      <div>
        {posts.map((post) => (
          <Link key={post.id} href={`/admin/posts/${post.id}`}>{post.name}</Link>
        ))}
      </div>
      <Button>
        <Link href="/admin/posts">go test</Link>
      </Button>
    </div>
  )
}
