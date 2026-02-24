import {
  IconKey,
  IconLink,
  IconShieldCheck,
  IconUsers,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    activeSessions: number;
    totalAccounts: number;
    totalVerifications: number;
  };
}

const statItems = [
  {
    key: "totalUsers" as const,
    label: "Total Users",
    icon: IconUsers,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950",
  },
  {
    key: "activeSessions" as const,
    label: "Active Sessions",
    icon: IconShieldCheck,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-950",
  },
  {
    key: "totalAccounts" as const,
    label: "Linked Accounts",
    icon: IconLink,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-950",
  },
  {
    key: "totalVerifications" as const,
    label: "Verifications",
    icon: IconKey,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-950",
  },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <Card key={item.key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">{item.label}</CardTitle>
            <div className={`rounded-lg p-2 ${item.bg}`}>
              <item.icon className={`size-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl tabular-nums">
              {stats[item.key].toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
