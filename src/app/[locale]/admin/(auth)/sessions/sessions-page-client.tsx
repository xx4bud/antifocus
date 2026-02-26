"use client";

import { useCallback, useState, useTransition } from "react";
import { Badge } from "~/components/ui/badge";
import { getSessions } from "~/features/admin/auth/actions/get-sessions";
import { SessionsTable } from "~/features/admin/auth/components/sessions-table";
import { AdminHeader } from "~/features/admin/shared/components/admin-header";

const PAGE_SIZE = 20;

type SessionsData = Awaited<ReturnType<typeof getSessions>>;
type StatusFilter = "active" | "expired" | "all";

export default function SessionsPageClient({
  initialData,
}: {
  initialData: SessionsData;
}) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [isPending, startTransition] = useTransition();

  const fetchData = useCallback((newPage: number, newStatus: StatusFilter) => {
    startTransition(async () => {
      const result = await getSessions({
        limit: PAGE_SIZE,
        offset: newPage * PAGE_SIZE,
        status: newStatus,
      });
      setData(result);
    });
  }, []);

  const handleStatusChange = useCallback(
    (newStatus: StatusFilter) => {
      setStatus(newStatus);
      setPage(0);
      fetchData(0, newStatus);
    },
    [fetchData]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      fetchData(newPage, status);
    },
    [fetchData, status]
  );

  const statuses: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Expired", value: "expired" },
  ];

  return (
    <>
      <AdminHeader breadcrumbs={[{ label: "Sessions" }]} />
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Sessions</h1>
          <p className="text-muted-foreground">
            View and manage all active and expired sessions.
          </p>
        </div>

        <div className="flex gap-2">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => handleStatusChange(s.value)}
              type="button"
            >
              <Badge
                className="cursor-pointer"
                variant={status === s.value ? "default" : "outline"}
              >
                {s.label}
              </Badge>
            </button>
          ))}
        </div>

        <div className={isPending ? "pointer-events-none opacity-60" : ""}>
          <SessionsTable
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
