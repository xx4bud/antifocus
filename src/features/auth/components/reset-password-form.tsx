"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useAppForm } from "~/components/forms/form-hooks";
import { FieldGroup } from "~/components/ui/field";
import { LoadingButton } from "~/components/ui/loading-button";
import { toast } from "~/components/ui/sonner";
import { resetPassword } from "~/features/auth/actions/reset-password";
import {
  type ResetPasswordData,
  resetPasswordInput,
} from "~/features/auth/validators/reset-password";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    } satisfies ResetPasswordData as ResetPasswordData,

    validators: {
      onChange: resetPasswordInput,
    },

    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const result = await resetPassword(value);

        if (result.success) {
          toast.success("Kata sandi berhasil diubah", {
            description: "Silakan masuk dengan kata sandi baru Anda.",
          });
          router.push("/sign-in");
          return;
        }

        toast.error("Gagal mengubah kata sandi", {
          description: result.error?.message,
        });
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
        <form.AppField name="password">
          {(field) => (
            <field.password
              label="Kata Sandi Baru"
              placeholder="Masukkan kata sandi baru"
            />
          )}
        </form.AppField>
        <form.AppField name="confirmPassword">
          {(field) => (
            <field.password
              label="Konfirmasi Kata Sandi"
              placeholder="Ulangi kata sandi baru"
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
              Ubah Kata Sandi
            </LoadingButton>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
