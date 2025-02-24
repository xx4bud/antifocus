import { cn } from "@/lib/utils";
import { NavAdmin } from "./nav-admin";

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({
  className,
}: AdminSidebarProps) {
  return (
    <nav
      className={cn(
        "flex h-fit flex-col rounded-lg border",
        className
      )}
    >
      <NavAdmin label={false} />
    </nav>
  );
}
