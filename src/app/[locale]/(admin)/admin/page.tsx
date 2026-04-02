"use client";

import {
  IconActivity,
  IconCash,
  IconHierarchy,
  IconUsers,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { RouterOutputs } from "@/lib/api";
import { useTRPC } from "@/lib/api";

export default function AdminDashboardPage() {
  const t = useTranslations("admin.dashboard");
  const trpc = useTRPC();
  const { data: stats, isLoading: statsLoading } = useQuery(
    trpc.admin.getStats.queryOptions()
  );
  const { data: activity, isLoading: activityLoading } = useQuery(
    trpc.admin.getRecentActivity.queryOptions()
  );

  type ActivityItem = NonNullable<
    RouterOutputs["admin"]["getRecentActivity"]
  >[number];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">
              {t("total_users")}
            </CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="font-bold text-2xl">
                  {stats?.totalUsers.toLocaleString()}
                </div>
                <p className="text-muted-foreground text-xs">
                  +20.1% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">
              {t("organizations")}
            </CardTitle>
            <IconHierarchy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="font-bold text-2xl">{stats?.organizations}</div>
                <p className="text-muted-foreground text-xs">
                  +12 since last week
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">
              {t("revenue")}
            </CardTitle>
            <IconCash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="font-bold text-2xl">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(stats?.revenue ?? 0)}
                </div>
                <p className="text-muted-foreground text-xs">
                  +19% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">
              {t("active_now")}
            </CardTitle>
            <IconActivity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="font-bold text-2xl">+{stats?.activeNow}</div>
                <p className="text-muted-foreground text-xs">
                  +201 since last hour
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("overview")}</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex h-[200px] items-center justify-center text-muted-foreground italic">
              {t("chart_placeholder")}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("recent_activity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activityLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    className="h-12 w-full"
                    key={`skele-${i.toString()}`}
                  />
                ))
              ) : activity?.length ? (
                activity.map((item: ActivityItem) => (
                  <div className="flex items-center gap-4" key={item.id}>
                    <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                      <IconActivity className="size-5" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <p className="font-medium text-sm leading-none">
                        {item.type === "user_signup"
                          ? `User signup: ${item.user}`
                          : item.type === "org_created"
                            ? `New organization: ${item.name}`
                            : item.type === "subscription_renewed"
                              ? `Subscription renewed: ${item.user}`
                              : item.type}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-sm italic">
                  {t("no_activity")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
