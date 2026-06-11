"use client";

import { toast } from "sonner";

interface BaseResponse<T> {
  data?: T;
  error?: {
    message: string;
  };
  message?: string;
  success: boolean;
}

interface FeedbackOptions<T> {
  error?: string | ((error: { message: string } | null | undefined) => string);
  onError?: (error: { message: string } | null | undefined) => void;
  onSuccess?: (data: T) => void;
  success?: string | ((data: T) => string);
}

export function useFeedback() {
  return {
    toast,
    handle: <T>(result: BaseResponse<T>, options?: FeedbackOptions<T>) => {
      if (result.success) {
        const successData = result.data as T;
        const message =
          typeof options?.success === "function"
            ? options.success(successData)
            : options?.success || result.message;

        if (message) {
          toast.success(message);
        }

        options?.onSuccess?.(successData);
      } else {
        const errorData = result.error;
        const message =
          typeof options?.error === "function"
            ? options.error(errorData)
            : options?.error || errorData?.message || "Terjadi kesalahan";

        toast.error(message);

        options?.onError?.(errorData);
      }

      return result;
    },
  };
}
