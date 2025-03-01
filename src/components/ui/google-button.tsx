"use client";

import { LoadingButton } from "@/components/ui/loading-button";
import Image from "next/image";

interface GoogleButtonProps {
  loading?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function GoogleButton({ loading, onClick, disabled }: GoogleButtonProps) {
  return (
    <LoadingButton
      variant="outline"
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      className="w-full"
    >
      {!loading && (
        <Image
          src="/assets/icons/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
          className="mr-2"
        />
      )}
      Continue with Google
    </LoadingButton>
  );
}
