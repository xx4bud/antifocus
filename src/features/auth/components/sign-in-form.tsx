"use client";

import { useSearchParams } from "next/navigation";
import { useAppForm } from "@/components/forms/form-hook";
import { LoadingButton } from "@/components/shared/loading-button";
import { FieldGroup } from "@/components/ui/field";
import { useFeedback } from "@/hooks/use-feedback";
import { Link, useRouter } from "@/lib/i18n";
import { signInAction } from "../actions/sign-in";
import { type SignInInput, signInSchema } from "../validators/sign-in";
import { AuthCard } from "./auth-card";

export function SignInForm() {
  const { handleError, handleSuccess } = useFeedback();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const form = useAppForm({
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    } satisfies SignInInput as SignInInput,

    validators: {
      onChange: signInSchema(),
    },

    onSubmit: async ({ value }) => {
      const result = await signInAction(value);

      if (!result.success) {
        handleError(result.error.message);
        return;
      }

      handleSuccess("Berhasil masuk!");
      // @ts-expect-error - callbackUrl is a dynamic string
      router.push(callbackUrl);
    },
  });

  return (
    <AuthCard
      content={
        <form
          className="grid"
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
                  autoComplete="username"
                  label="Email atau Username"
                  placeholder="Masukan email atau username anda"
                />
              )}
            </form.AppField>

            <form.AppField name="password">
              {(field) => (
                <field.input
                  autoComplete="current-password"
                  className="flex items-center justify-between"
                  label="Kata sandi"
                  labelRight={
                    <Link href="/forgot-password">Lupa kata sandi?</Link>
                  }
                  placeholder="Masukan kata sandi anda"
                />
              )}
            </form.AppField>

            <div>
              <form.AppField name="rememberMe">
                {(field) => (
                  <field.checkbox
                    label="Ingat Saya"
                    labelRight={
                      <Link href="/sign-in/phone">Masuk dengan telepon</Link>
                    }
                  />
                )}
              </form.AppField>
            </div>
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
                  Masuk
                </LoadingButton>
              )}
            </form.Subscribe>
          </FieldGroup>
        </form>
      }
      description="Masuk ke akun anda untuk melanjutkan"
      footer={
        <Link className="flex items-center gap-2" href="/sign-up">
          <span className="text-muted-foreground">Belum punya akun?</span>
          <span className="font-medium text-primary hover:underline">
            Daftar disini
          </span>
        </Link>
      }
      title="Masuk"
    />
  );
}
