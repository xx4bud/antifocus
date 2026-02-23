"use client";

import { useTransition } from "react";
import { useAppForm } from "~/components/forms/form-hooks";
import { FieldGroup } from "~/components/ui/field";
import { LoadingButton } from "~/components/ui/loading-button";
import { toast } from "~/components/ui/sonner";
import { signUp } from "~/features/auth/actions/sign-up";
import {
  type SignUpData,
  signUpInput,
} from "~/features/auth/validators/sign-up";
import { useRouter } from "~/i18n/navigation";

export function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    } satisfies SignUpData as SignUpData,

    validators: {
      onChange: signUpInput,
    },

    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const result = await signUp(value);

        if (result.success) {
          toast.success(
            "Akun berhasil dibuat! Email verifikasi telah dikirim.",
            {
              description: "Silakan cek inbox Anda untuk verifikasi email.",
            }
          );
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
        <form.AppField name="name">
          {(field) => (
            <field.input
              autoComplete="name"
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap Anda"
              type="text"
            />
          )}
        </form.AppField>
        <form.AppField name="email">
          {(field) => (
            <field.input
              autoComplete="email"
              label="Email"
              placeholder="Masukkan alamat email Anda"
              type="email"
            />
          )}
        </form.AppField>
        <form.AppField name="phoneNumber">
          {(field) => (
            <field.phoneNumber
              autoComplete="tel"
              label="Nomor Telepon"
              placeholder="Masukkan nomor telepon Anda"
            />
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.password
              autoComplete="new-password"
              label="Kata Sandi"
              placeholder="Masukkan kata sandi Anda"
            />
          )}
        </form.AppField>
        <form.AppField name="confirmPassword">
          {(field) => (
            <field.password
              autoComplete="new-password"
              label="Konfirmasi Kata Sandi"
              placeholder="Masukkan kembali kata sandi Anda"
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
              Buat Akun
            </LoadingButton>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
