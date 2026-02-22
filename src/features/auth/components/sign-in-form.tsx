"use client";

import { useTransition } from "react";
import { useAppForm } from "~/components/forms/form-hooks";
import { FieldGroup } from "~/components/ui/field";
import { LoadingButton } from "~/components/ui/loading-button";
import { NavLink } from "~/components/ui/nav-link";
import { toast } from "~/components/ui/sonner";
import { signIn } from "~/features/auth/actions/sign-in";
import {
  type SignInUniversalData,
  signInUniversalInput,
} from "~/features/auth/validators/sign-in";
import { useRouter } from "~/i18n/navigation";

export function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    } satisfies SignInUniversalData as SignInUniversalData,

    validators: {
      onChange: signInUniversalInput,
    },

    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const result = await signIn(value);

        if (result.success) {
          toast.success("Berhasil masuk, selamat datang kembali!");
          router.push("/");
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
              autoComplete="username"
              label="Email atau Username"
              placeholder="Masukan email atau username anda"
            />
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.password
              autoComplete="current-password"
              className="flex items-center justify-between"
              label="Kata sandi"
              labelRight={
                <NavLink href="/forgot-password">Lupa kata sandi?</NavLink>
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
                  <NavLink href="/sign-in/phone">Masuk dengan telepon</NavLink>
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
              loading={isPending || isSubmitting}
              type="submit"
            >
              Sign In
            </LoadingButton>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
