import { IconLoader } from "@tabler/icons-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/ui";

function Spinner({ className, ...props }: ComponentProps<"svg">) {
  return (
    <IconLoader
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      role="status"
      {...props}
    />
  );
}

export { Spinner };
