"use client";

import { useCallback, useState, useTransition } from "react";
import { Badge } from "~/components/ui/badge";
import { getVerifications } from "~/features/admin/auth/actions/get-verifications";
import { VerificationsTable } from "~/features/admin/auth/components/verifications-table";
import { AdminHeader } from "~/features/admin/shared/components/admin-header";

const PAGE_SIZE = 20;

type VerificationsData = Awaited<ReturnType<typeof getVerifications>>;
type StatusFilter = "active" | "expired" | "all";

export default function VerificationsPageClient({
  initialData,
}: {
  initialData: VerificationsData;
}) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [isPending, startTransition] = useTransition();

  const fetchData = useCallback((newPage: number, newStatus: StatusFilter) => {
    startTransition(async () => {
      const result = await getVerifications({
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
      <AdminHeader breadcrumbs={[{ label: "Verifications" }]} />
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Verifications</h1>
          <p className="text-muted-foreground">
            View all verification tokens and their status.
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
          <VerificationsTable
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
