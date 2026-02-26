import {
  IconBuildingStore,
  IconCategory,
  IconPackage,
  IconPhoto,
  IconReceipt,
  IconShieldCheck,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    activeSessions: number;
    totalAccounts: number;
    totalVerifications: number;
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    totalOrganizations: number;
    totalBanners: number;
    totalCustomers: number;
  };
}

const statItems = [
  {
    key: "totalUsers" as const,
    label: "Users",
    icon: IconUsers,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950",
  },
  {
    key: "totalProducts" as const,
    label: "Products",
    icon: IconPackage,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950",
  },
  {
    key: "totalOrders" as const,
    label: "Orders",
    icon: IconReceipt,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-950",
  },
  {
    key: "totalOrganizations" as const,
    label: "Organizations",
    icon: IconBuildingStore,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-950",
  },
  {
    key: "totalCategories" as const,
    label: "Categories",
    icon: IconCategory,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-100 dark:bg-teal-950",
  },
  {
    key: "totalCustomers" as const,
    label: "Customers",
    icon: IconUsersGroup,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-100 dark:bg-pink-950",
  },
  {
    key: "activeSessions" as const,
    label: "Active Sessions",
    icon: IconShieldCheck,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-950",
  },
  {
    key: "totalBanners" as const,
    label: "Banners",
    icon: IconPhoto,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-950",
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
