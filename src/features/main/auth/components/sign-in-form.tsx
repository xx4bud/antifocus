"use client";

import { IconLoader2, IconLock, IconMail } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useAppForm } from "@/components/forms/form-hooks";
import { Button } from "@/components/ui/button";
import { SocialAuth } from "@/features/main/auth/components/social-auth";
import { signInAction } from "@/features/main/auth/lib/actions";
import {
  type SignInData,
  signInFormSchema,
} from "@/features/main/auth/lib/validators";
import { useFeedback } from "@/hooks/use-feedback";
import { Link, useRouter } from "@/lib/i18n/navigation";

export function SignInForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const { handle } = useFeedback();

  const form = useAppForm({
    defaultValues: {
      identifier: "",
      password: "",
    } satisfies SignInData,
    validators: {
      onChange: signInFormSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await signInAction(value);
      handle(
        {
          success: res.ok,
          data: res.ok ? res.value : undefined,
          error: res.ok ? undefined : res.error,
        },
        {
          success: t("signInSuccess"),
          error: (err) => err?.message || "Failed to sign in",
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        }
      );
    },
  });

  return (
    <div className="w-full max-w-md">
      {/* Clean minimal card */}
      <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-8 shadow-md">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-2xl tracking-tight">
            {t("signInTitle")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("signInDescription")}
          </p>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <>
                <form.AppField name="identifier">
                  {(field) => (
                    <field.input
                      autoComplete="username"
                      disabled={isSubmitting}
                      icon={<IconMail className="size-4" />}
                      label={t("identifierLabel")}
                      type="text"
                    />
                  )}
                </form.AppField>

                <form.AppField name="password">
                  {(field) => (
                    <field.password
                      autoComplete="current-password"
                      disabled={isSubmitting}
                      icon={<IconLock className="size-4" />}
                      label={t("passwordLabel")}
                    />
                  )}
                </form.AppField>

                <Button
                  className="w-full font-medium"
                  disabled={isSubmitting}
                  size="lg"
                  type="submit"
                >
                  {isSubmitting ? (
                    <IconLoader2
                      className="animate-spin"
                      data-icon="inline-start"
                    />
                  ) : null}
                  {isSubmitting ? t("submitting") : t("signInButton")}
                </Button>
              </>
            )}
          </form.Subscribe>
        </form>

        {/* Social auth */}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => <SocialAuth disabled={isSubmitting} />}
        </form.Subscribe>

        {/* Link to sign up */}
        <div className="text-center text-muted-foreground text-sm">
          {t("dontHaveAccount")}{" "}
          <Link
            className="font-medium text-primary underline-offset-2 hover:underline"
            href="/sign-up"
          >
            {t("signUpButton")}
          </Link>
        </div>
      </div>
    </div>
  );
}
