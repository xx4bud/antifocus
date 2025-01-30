import { getSession } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const admin = session?.user.role === "ADMIN";

  if (!admin) {
    return notFound();
  }

  return (
    <div className="container-wrapper flex flex-1 flex-col">
      {children}
    </div>
  );
}
