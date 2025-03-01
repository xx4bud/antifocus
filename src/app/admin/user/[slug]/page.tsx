import { getUserBySlug } from "@/actions/user";
import { UserForm } from "./user-form";
import { prisma } from "@/lib/prisma";

interface UserSlugProps {
  params: Promise<{ slug: string }>;
}

export default async function UserSlug({
  params,
}: UserSlugProps) {
  const { slug } = await params;
  const user = await getUserBySlug(slug);

  return <UserForm user={user} />;
}
