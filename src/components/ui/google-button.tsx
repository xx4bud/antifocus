"use client";

import React from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import Image from "next/image";
import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GoogleButtonProps extends ButtonProps {
  loading?: boolean;
}

export function GoogleButton({
  loading,
  onClick,
  disabled,
  className,
  ...props
}: GoogleButtonProps) {
  return (
    <LoadingButton
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
      {loading
        ? "Redirecting to Google..."
        : "Continue with Google"}
    </LoadingButton>
  );
}
