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

interface Banner {
  createdAt: Date;
  description: string;
  enabled: boolean;
  id: string;
  imageUrl: string;
  link: string;
  position: number;
  title: string;
}

interface BannersTableProps {
  data: Banner[];
  total: number;
}

export function BannersTable({ data, total }: BannersTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Preview</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Link</TableHead>
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
                No banners found
              </TableCell>
            </TableRow>
          ) : (
            data.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  <Image
                    alt={banner.title}
                    className="h-12 w-24 rounded object-cover"
                    height={48}
                    src={banner.imageUrl}
                    width={96}
                  />
                </TableCell>
                <TableCell className="font-medium">{banner.title}</TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                  {banner.link}
                </TableCell>
                <TableCell className="tabular-nums">
                  {banner.position}
                </TableCell>
                <TableCell>
                  <Badge variant={banner.enabled ? "default" : "secondary"}>
                    {banner.enabled ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(banner.createdAt).toLocaleDateString("id-ID")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="border-t px-4 py-3 text-muted-foreground text-sm">
        {total} banner(s) total
      </div>
    </div>
  );
}
