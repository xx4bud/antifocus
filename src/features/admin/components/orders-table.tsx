import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface Order {
  channel: string;
  createdAt: Date;
  currency: string;
  customerId: string;
  id: string;
  orderNumber: string;
  organizationId: string;
  status: string;
  total: string;
}

interface OrdersTableProps {
  data: Order[];
  total: number;
}

const orderStatusColors: Record<string, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400",
  processing:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-400",
  printing:
    "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400",
  shipped: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-400",
  delivered:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
};

function formatCurrency(amount: string, currency: string) {
  const num = Number.parseFloat(amount);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function OrdersTable({ data, total }: OrdersTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                className="text-center text-muted-foreground"
                colSpan={5}
              >
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            data.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium font-mono text-sm">
                  {order.orderNumber}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{order.channel}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={orderStatusColors[order.status] ?? ""}
                    variant="secondary"
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatCurrency(order.total, order.currency)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(order.createdAt).toLocaleDateString("id-ID")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="border-t px-4 py-3 text-muted-foreground text-sm">
        {total} order(s) total
      </div>
    </div>
  );
}
