"use client";

import {
  IconChartPie,
  IconCircleCheck,
  IconClock,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardMetrics {
  activeOrders: number;
  fulfillmentRate: number;
  growthRate: number;
  newCustomers: number;
  pendingProduction: number;
  profitMargin: number;
  totalRevenue: number;
}

function getProfitStyles(rate: number): { color: string; label: string } {
  if (rate >= 20) {
    return { color: "text-emerald-500", label: "Excellent" };
  }
  if (rate >= 10) {
    return { color: "text-amber-500", label: "Good" };
  }
  return { color: "text-rose-500", label: "Low" };
}

function getProductionStyles(count: number): { color: string; label: string } {
  if (count > 50) {
    return { color: "text-rose-500", label: "High" };
  }
  if (count > 20) {
    return { color: "text-amber-500", label: "Medium" };
  }
  return { color: "text-emerald-500", label: "Low" };
}

function getFulfillmentStyles(rate: number): { color: string; label: string } {
  if (rate >= 95) {
    return { color: "text-emerald-500", label: "Excellent" };
  }
  if (rate >= 85) {
    return { color: "text-amber-500", label: "Good" };
  }
  return { color: "text-rose-500", label: "Needs Attention" };
}

function GrowthBadge({ rate }: { rate: number }) {
  const color = rate >= 0 ? "text-emerald-500" : "text-rose-500";
  return (
    <Badge className={color} variant="outline">
      {rate >= 0 ? (
        <IconTrendingUp className="mr-1 size-3" />
      ) : (
        <IconTrendingDown className="mr-1 size-3" />
      )}
      {rate > 0 ? "+" : ""}
      {rate.toFixed(1)}%
    </Badge>
  );
}

function ProfitBadge({ rate }: { rate: number }) {
  const { color, label } = getProfitStyles(rate);
  return (
    <Badge className={color} variant="outline">
      <IconChartPie className="mr-1 size-3" />
      {label}
    </Badge>
  );
}

function ProductionBadge({ count }: { count: number }) {
  const { color, label } = getProductionStyles(count);
  return (
    <Badge className={color} variant="outline">
      <IconClock className="mr-1 size-3" />
      {label}
    </Badge>
  );
}

function FulfillmentBadge({ rate }: { rate: number }) {
  const { color, label } = getFulfillmentStyles(rate);
  return (
    <Badge className={color} variant="outline">
      <IconCircleCheck className="mr-1 size-3" />
      {label}
    </Badge>
  );
}

export function SectionCards({ metrics }: { metrics?: DashboardMetrics }) {
  const {
    totalRevenue = 0,
    growthRate = 0,
    profitMargin = 0,
    pendingProduction = 0,
    fulfillmentRate = 0,
  } = metrics || {};

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("id-ID").format(num);

  return (
    <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {formatCurrency(totalRevenue)}
          </CardTitle>
          <CardAction>
            <GrowthBadge rate={growthRate} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Completed orders value
          </div>
          <div className="text-muted-foreground">
            Revenue across all branches
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Profit Margin</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {profitMargin.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <ProfitBadge rate={profitMargin} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Profitability indicator
          </div>
          <div className="text-muted-foreground">After production costs</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Production</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {formatNumber(pendingProduction)}
          </CardTitle>
          <CardAction>
            <ProductionBadge count={pendingProduction} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Orders awaiting production
          </div>
          <div className="text-muted-foreground">
            Requires fulfillment action
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Fulfillment Rate</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {fulfillmentRate.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <FulfillmentBadge rate={fulfillmentRate} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Successfully completed orders
          </div>
          <div className="text-muted-foreground">Delivery performance</div>
        </CardFooter>
      </Card>
    </div>
  );
}
