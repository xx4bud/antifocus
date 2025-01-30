import React from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import Image from "next/image";
import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GoogleButtonProps extends ButtonProps {
  loading?: boolean;
  title?: string;
}

const GoogleButton = React.forwardRef<
  HTMLButtonElement,
  GoogleButtonProps
>(
  (
    {
      loading,
      onClick,
      disabled,
      title,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <LoadingButton
        ref={ref}
        variant="outline"
        loading={loading}
        disabled={disabled}
        onClick={onClick}
        className={cn("w-full", className)}
        {...props}
      >
        {!loading && (
          <Image
            src="/google.svg"
            alt="Google Logo"
            width={20}
            height={20}
          />
        )}
        {title || "Continue with Google"}
      </LoadingButton>
    );
  }
);
GoogleButton.displayName = "GoogleButton";

export { GoogleButton };
