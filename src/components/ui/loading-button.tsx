"use client";

import type { RefObject } from "react";
import { cn } from "@/lib/utils/ui";
import { Button, type ButtonProps } from "./button";
import { Spinner } from "./spinner";

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

const LoadingButton = ({
  children,
  loading = false,
  loadingText,
  disabled,
  className,
  variant,
  size,
  ref,
  ...props
}: LoadingButtonProps & { ref?: RefObject<HTMLButtonElement | null> }) => (
  <Button
    aria-busy={loading}
    className={cn(className)}
    disabled={disabled || loading}
    ref={ref}
    size={size}
    variant={variant}
    {...props}
  >
    {loading && (
      <Spinner
        className={cn(
          "shrink-0 animate-spin",
          size === "icon" || size === "icon-sm" || size === "icon-xs"
            ? "size-4"
            : "mr-2 size-4"
        )}
      />
    )}
    {loading ? loadingText || children : children}
  </Button>
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
