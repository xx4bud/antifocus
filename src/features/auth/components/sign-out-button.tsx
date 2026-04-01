"use client";

import { useState } from "react";
import { LoadingButton } from "@/components/shared/loading-button";
import { useFeedback } from "@/hooks/use-feedback";
import { useRouter } from "@/lib/i18n";
import { signOutAction } from "../actions/sign-out";

/**
 * A simple client-side sign-out button.
 * Used for development and temporary navigation.
 */
export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { handleError, handleSuccess } = useFeedback();
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);

    try {
      const result = await signOutAction();

      if (!result.success) {
        handleError(result.error.message);
        setIsLoading(false);
        return;
      }

      handleSuccess("Berhasil keluar.");
      router.refresh();
    } catch (error) {
      console.error("[SignOutButton] Logout failed:", error);
      handleError("Terjadi kesalahan saat keluar.");
      setIsLoading(false);
    }
  };

  return (
    <LoadingButton
      loading={isLoading}
      onClick={handleSignOut}
      variant="destructive"
    >
      Keluar
    </LoadingButton>
  );
}
