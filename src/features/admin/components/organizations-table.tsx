import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface Organization {
  createdAt: Date;
  id: string;
  logo: string | null;
  name: string;
  slug: string;
  status: string;
}

interface OrganizationsTableProps {
  data: Organization[];
  total: number;
}

const orgStatusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  banned: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400",
};

export function OrganizationsTable({ data, total }: OrganizationsTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                className="text-center text-muted-foreground"
                colSpan={4}
              >
                No organizations found
              </TableCell>
            </TableRow>
          ) : (
            data.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {org.logo ? (
                      <Image
                        alt={org.name}
                        className="size-8 rounded-full object-cover"
                        src={org.logo}
                      />
                    ) : (
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                        {org.name[0]}
                      </div>
                    )}
                    {org.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {org.slug}
                </TableCell>
                <TableCell>
                  <Badge
                    className={orgStatusColors[org.status] ?? ""}
                    variant="secondary"
                  >
                    {org.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(org.createdAt).toLocaleDateString("id-ID")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="border-t px-4 py-3 text-muted-foreground text-sm">
        {total} organization(s) total
      </div>
    </div>
  );
}
