"use client";

import { useTransition } from "react";
import { useAppForm } from "~/components/forms/form-hooks";
import { FieldGroup } from "~/components/ui/field";
import { LoadingButton } from "~/components/ui/loading-button";
import { toast } from "~/components/ui/sonner";
import { forgotPassword } from "~/features/auth/actions/forgot-password";
import {
  type ForgotPasswordData,
  forgotPasswordInput,
} from "~/features/auth/validators/forgot-password";
import { useRouter } from "~/i18n/navigation";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      identifier: "",
    } satisfies ForgotPasswordData as ForgotPasswordData,

    validators: {
      onChange: forgotPasswordInput,
    },

    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const result = await forgotPassword(value);

        if (result.success) {
          toast.success("Email verifikasi telah dikirim");
          router.push("/sign-in");
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
        <form.AppField name="identifier">
          {(field) => (
            <field.input
              autoComplete="email"
              label="Email"
              placeholder="Masukkan email Anda"
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
              Kirim Link Reset
            </LoadingButton>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
