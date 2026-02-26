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

interface Category {
  createdAt: Date;
  enabled: boolean;
  id: string;
  image: string | null;
  name: string;
  parentId: string | null;
  position: number;
  slug: string;
}

interface CategoriesTableProps {
  data: Category[];
  total: number;
}

export function CategoriesTable({ data, total }: CategoriesTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Position</TableHead>
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
                No categories found
              </TableCell>
            </TableRow>
          ) : (
            data.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {cat.image ? (
                      <Image
                        alt={cat.name}
                        className="size-8 rounded object-cover"
                        height={32}
                        src={cat.image}
                        width={32}
                      />
                    ) : (
                      <div className="size-8 rounded bg-muted" />
                    )}
                    {cat.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {cat.slug}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {cat.parentId ? `${cat.parentId.slice(0, 8)}...` : "—"}
                </TableCell>
                <TableCell className="tabular-nums">{cat.position}</TableCell>
                <TableCell>
                  <Badge variant={cat.enabled ? "default" : "secondary"}>
                    {cat.enabled ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(cat.createdAt).toLocaleDateString("id-ID")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="border-t px-4 py-3 text-muted-foreground text-sm">
        {total} category(s) total
      </div>
    </div>
  );
}
