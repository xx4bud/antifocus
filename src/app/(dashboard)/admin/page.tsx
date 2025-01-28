import { getSession } from "@/lib/queries";
import { notFound } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  const admin = session?.user.role === "ADMIN";

  if (!admin) {
    return notFound();
  }
  return <div>Page</div>;
}
