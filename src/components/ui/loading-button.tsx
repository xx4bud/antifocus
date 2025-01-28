import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import {
  Button,
  ButtonProps,
} from "@/components/ui/button";
import React from "react";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(
  (
    { loading, disabled, className, children, ...props },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        disabled={loading || disabled}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {loading && (
          <Loader2 className="size-5 animate-spin" />
        )}
        {children}
      </Button>
    );
  }
);
LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
