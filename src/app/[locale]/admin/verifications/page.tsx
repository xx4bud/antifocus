import { getVerifications } from "~/features/admin/actions/get-verifications";
import VerificationsPageClient from "./verifications-page-client";

export default async function VerificationsPage() {
  const initialData = await getVerifications({ limit: 20 });

  return <VerificationsPageClient initialData={initialData} />;
}
