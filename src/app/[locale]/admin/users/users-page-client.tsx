"use client";

import { useCallback, useState, useTransition } from "react";
import { getUsers } from "~/features/admin/actions/get-users";
import { AdminHeader } from "~/features/admin/components/admin-header";
import { UsersTable } from "~/features/admin/components/users-table";

const PAGE_SIZE = 20;

type UsersData = Awaited<ReturnType<typeof getUsers>>;

export default function UsersPageClient({
  initialData,
}: {
  initialData: UsersData;
}) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const fetchData = useCallback((newPage: number, newSearch: string) => {
    startTransition(async () => {
      const result = await getUsers({
        limit: PAGE_SIZE,
        offset: newPage * PAGE_SIZE,
        search: newSearch || undefined,
      });
      setData(result);
    });
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      setPage(0);
      fetchData(0, value);
    },
    [fetchData]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      fetchData(newPage, search);
    },
    [fetchData, search]
  );

  return (
    <>
      <AdminHeader breadcrumbs={[{ label: "Users" }]} />
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage all registered users in your application.
          </p>
        </div>

        <div className={isPending ? "pointer-events-none opacity-60" : ""}>
          <UsersTable
            data={data.data}
            onPageChangeAction={handlePageChange}
            onSearchChangeAction={handleSearchChange}
            page={page}
            pageSize={PAGE_SIZE}
            search={search}
            total={data.total}
          />
        </div>
      </div>
    </>
  );
}
