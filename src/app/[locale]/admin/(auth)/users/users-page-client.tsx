"use client";

import { useCallback, useState, useTransition } from "react";
import { getUsers } from "~/features/admin/auth/actions/get-users";
import { UsersTable } from "~/features/admin/auth/components/users-table";
import { AdminHeader } from "~/features/admin/shared/components/admin-header";

const PAGE_SIZE = 20;

type UsersData = Awaited<ReturnType<typeof getUsers>>;

import { AdminPageHeader } from "~/features/admin/shared/components/admin-page-header";

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
        <AdminPageHeader
          description="Manage all registered users in your application."
          title="Users"
        />

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
