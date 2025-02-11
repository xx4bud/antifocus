"use client";

import React from "react";
import {
  Button,
  ButtonProps,
} from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function GoogleButton({
  onClick,
  disabled,
  className,
  ...props
}: {
  onClick: () => void;
  disabled: boolean;
  className?: string;
} & ButtonProps) {
  return (
    <Button
      variant="outline"
      disabled={disabled}
      onClick={onClick}
      className={cn("w-full", className)}
      {...props}
    >
      <Image
        src={"/assets/icons/google.svg"}
        alt="Google Logo"
        width={20}
        height={20}
        sizes="20px"
      />
      {disabled
        ? "Redirecting to Google..."
        : "Continue with Google"}
    </Button>
  );
}
