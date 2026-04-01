"use client";

import { toast } from "sonner";

export function useFeedback() {
  const handleError = (errorPayload: string | null | undefined) => {
    if (!errorPayload) {
      return;
    }

    toast.error(errorPayload);
  };

  const handleSuccess = (messagePayload: string) => {
    if (!messagePayload) {
      return;
    }

    toast.success(messagePayload);
  };

  return { handleError, handleSuccess };
}
