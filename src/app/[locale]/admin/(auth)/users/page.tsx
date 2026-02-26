import { getUsers } from "~/features/admin/auth/actions/get-users";
import UsersPageClient from "./users-page-client";

export default async function UsersPage() {
  const initialData = await getUsers({ limit: 20 });

  return <UsersPageClient initialData={initialData} />;
}
