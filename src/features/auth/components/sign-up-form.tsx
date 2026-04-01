"use client";

import { useAppForm } from "@/components/forms/form-hook";
import { LoadingButton } from "@/components/shared/loading-button";
import { FieldGroup } from "@/components/ui/field";
import { useFeedback } from "@/hooks/use-feedback";
import { Link, useRouter } from "@/lib/i18n";
import { signUpAction } from "../actions/sign-up";
import { type SignUpInput, signUpSchema } from "../validators/sign-up";
import { AuthCard } from "./auth-card";
import { SocialAuth } from "./social-auth";

export function SignUpForm() {
  const { handleError, handleSuccess } = useFeedback();
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    } as SignUpInput,

    validators: {
      onChangeAsyncDebounceMs: 500,
      onChangeAsync: signUpSchema(),
    },

    onSubmit: async ({ value }) => {
      const result = await signUpAction(value);

      if (!result.success) {
        handleError(result.error.message);
        return;
      }

      handleSuccess(
        "Pendaftaran berhasil! Silakan cek email Anda untuk memverifikasi akun sebelum masuk."
      );
      router.push("/sign-in");
    },
  });

  return (
    <AuthCard
      content={
        <>
          <SocialAuth />
          <form
            className="grid gap-4"
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
                    placeholder="Contoh: John Doe"
                  />
                )}
              </form.AppField>

              <form.AppField name="email">
                {(field) => (
                  <field.input
                    autoComplete="email"
                    label="Email"
                    placeholder="name@example.com"
                    type="email"
                  />
                )}
              </form.AppField>

              <form.AppField name="password">
                {(field) => (
                  <field.input
                    autoComplete="new-password"
                    label="Kata sandi"
                    placeholder="Masukan kata sandi anda"
                    type="password"
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
                    loading={isSubmitting}
                    type="submit"
                  >
                    Daftar
                  </LoadingButton>
                )}
              </form.Subscribe>
            </FieldGroup>
          </form>
        </>
      }
      description="Buat akun baru untuk mulai menggunakan Antifocus"
      footer={
        <Link className="flex items-center gap-2" href="/sign-in">
          <span className="text-muted-foreground">Sudah punya akun?</span>
          <span className="font-medium text-primary hover:underline">
            Masuk disini
          </span>
        </Link>
      }
      title="Daftar"
    />
  );
}
