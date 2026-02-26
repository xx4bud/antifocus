import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface Product {
  basePrice: string;
  createdAt: Date;
  currency: string;
  enabled: boolean;
  id: string;
  name: string;
  organizationId: string;
  slug: string;
  status: string | null;
  updatedAt: Date;
}

interface ProductsTableProps {
  data: Product[];
  page: number;
  pageSize: number;
  total: number;
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  inactive:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400",
  archived: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400",
  discontinued: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400",
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

export function ProductsTable({ data, total }: ProductsTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Enabled</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                className="text-center text-muted-foreground"
                colSpan={6}
              >
                No products found
              </TableCell>
            </TableRow>
          ) : (
            data.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {product.slug}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatCurrency(product.basePrice, product.currency)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={statusColors[product.status ?? "draft"]}
                    variant="secondary"
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={product.enabled ? "default" : "secondary"}>
                    {product.enabled ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(product.createdAt).toLocaleDateString("id-ID")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="border-t px-4 py-3 text-muted-foreground text-sm">
        {total} product(s) total
      </div>
    </div>
  );
}
