"use client";

import {
  IconCircleCheck,
  IconCircleX,
  IconMailForward,
} from "@tabler/icons-react";
import { useEffect, useTransition } from "react";
import { useAppForm } from "~/components/forms/form-hooks";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { FieldGroup } from "~/components/ui/field";
import { LoadingButton } from "~/components/ui/loading-button";
import { toast } from "~/components/ui/sonner";
import { resendVerifyEmail } from "~/features/auth/actions/resend-verify-email";
import { useRouter } from "~/i18n/navigation";

interface VerifyEmailContentProps {
  errorMessage?: string;
  status: "success" | "error" | "idle";
}

export function VerifyEmailContent({
  status,
  errorMessage,
}: VerifyEmailContentProps) {
  if (status === "success") {
    return <VerifySuccess />;
  }

  if (status === "error") {
    return <VerifyError errorMessage={errorMessage} />;
  }

  return <ResendVerifyForm />;
}

// ==============================
// SUCCESS STATE
// ==============================

function VerifySuccess() {
  const router = useRouter();

  useEffect(() => {
    toast.success("Email berhasil diverifikasi!");
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Alert className="w-full">
      <IconCircleCheck className="text-green-500" />
      <AlertTitle>Email berhasil diverifikasi!</AlertTitle>
      <AlertDescription>
        Anda akan dialihkan ke halaman utama...
      </AlertDescription>
    </Alert>
  );
}

// ==============================
// ERROR STATE
// ==============================

function VerifyError({ errorMessage }: { errorMessage?: string }) {
  return (
    <div className="flex w-full flex-col space-y-4">
      <Alert className="w-full" variant="destructive">
        <IconCircleX />
        <AlertTitle>Verifikasi gagal</AlertTitle>
        <AlertDescription>
          {errorMessage || "Gagal memverifikasi email."}
        </AlertDescription>
      </Alert>
      <ResendVerifyForm />
    </div>
  );
}

// ==============================
// RESEND VERIFY FORM
// ==============================

function ResendVerifyForm() {
  const [isPending, startTransition] = useTransition();

  const form = useAppForm({
    defaultValues: {
      email: "",
    },

    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const result = await resendVerifyEmail(value.email);

        if (result.success) {
          toast.success("Email verifikasi telah dikirim", {
            description: "Silakan cek inbox Anda.",
          });
          return;
        }

        toast.error(result.error.message);
      });
    },
  });

  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="email">
          {(field) => (
            <field.input
              autoComplete="email"
              label="Email"
              placeholder="Masukkan email yang terdaftar"
              type="email"
            />
          )}
        </form.AppField>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <LoadingButton
              className="w-full"
              disabled={!canSubmit}
              loading={isPending || isSubmitting}
              type="submit"
            >
              <IconMailForward className="size-4" />
              Kirim Ulang Verifikasi
            </LoadingButton>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
