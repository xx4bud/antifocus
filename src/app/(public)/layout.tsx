import { AppHeader } from "@/components/app-header"
import { getSession } from "@/lib/queries"

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()
  const user = session?.user

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader user={user} />
      <div className="mx-auto flex h-screen w-full max-w-6xl flex-grow">
        {children}
      </div>
    </div>
  )
}
