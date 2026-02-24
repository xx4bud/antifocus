"use client";

import { useCallback, useState, useTransition } from "react";
import { getAccounts } from "~/features/admin/actions/get-accounts";
import { AccountsTable } from "~/features/admin/components/accounts-table";
import { AdminHeader } from "~/features/admin/components/admin-header";

const PAGE_SIZE = 20;

type AccountsData = Awaited<ReturnType<typeof getAccounts>>;

export default function AccountsPageClient({
  initialData,
}: {
  initialData: AccountsData;
}) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(0);
  const [isPending, startTransition] = useTransition();

  const fetchData = useCallback((newPage: number) => {
    startTransition(async () => {
      const result = await getAccounts({
        limit: PAGE_SIZE,
        offset: newPage * PAGE_SIZE,
      });
      setData(result);
    });
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      fetchData(newPage);
    },
    [fetchData]
  );

  return (
    <>
      <AdminHeader breadcrumbs={[{ label: "Accounts" }]} />
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Linked Accounts</h1>
          <p className="text-muted-foreground">
            View all linked OAuth and credential accounts.
          </p>
        </div>

        <div className={isPending ? "pointer-events-none opacity-60" : ""}>
          <AccountsTable
            data={data.data}
            onPageChangeAction={handlePageChange}
            page={page}
            pageSize={PAGE_SIZE}
            total={data.total}
          />
        </div>
      </div>
    </>
  );
}
