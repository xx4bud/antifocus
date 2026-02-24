import { getAccounts } from "~/features/admin/actions/get-accounts";
import AccountsPageClient from "./accounts-page-client";

export default async function AccountsPage() {
  const initialData = await getAccounts({ limit: 20 });

  return <AccountsPageClient initialData={initialData} />;
}
