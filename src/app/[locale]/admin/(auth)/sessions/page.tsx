import { getSessions } from "~/features/admin/auth/actions/get-sessions";
import SessionsPageClient from "./sessions-page-client";

export default async function SessionsPage() {
  const initialData = await getSessions({ limit: 20 });

  return <SessionsPageClient initialData={initialData} />;
}
