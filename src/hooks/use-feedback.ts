"use client";

import { toast } from "sonner";
import { parseError } from "@/lib/utils/error";

export function useFeedback() {
  const handleError = (error: unknown) => {
    if (!error) {
      return;
    }
    const parsedError = parseError(error);
    toast.error(parsedError.message);
  };
  const handleSuccess = (message: string) => {
    if (!message) {
      return;
    }
    toast.success(message);
  };

  return {
    handleError,
    handleSuccess,
  };
}
