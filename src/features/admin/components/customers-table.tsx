import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface Customer {
  createdAt: Date;
  email: string | null;
  enabled: boolean;
  id: string;
  name: string | null;
  organizationId: string;
  phoneNumber: string | null;
}

interface CustomersTableProps {
  data: Customer[];
  total: number;
}

export function CustomersTable({ data, total }: CustomersTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Enabled</TableHead>
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
                No customers found
              </TableCell>
            </TableRow>
          ) : (
            data.map((cust) => (
              <TableRow key={cust.id}>
                <TableCell className="font-medium">
                  {cust.name ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {cust.email ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {cust.phoneNumber ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={cust.enabled ? "default" : "secondary"}>
                    {cust.enabled ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(cust.createdAt).toLocaleDateString("id-ID")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="border-t px-4 py-3 text-muted-foreground text-sm">
        {total} customer(s) total
      </div>
    </div>
  );
}
