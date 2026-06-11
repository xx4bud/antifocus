"use client";

import { IconLoader2, IconLock, IconMail, IconUser } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useAppForm } from "@/components/forms/form-hooks";
import { Button } from "@/components/ui/button";
import { SocialAuth } from "@/features/main/auth/components/social-auth";
import { signUpAction } from "@/features/main/auth/lib/actions";
import {
  type SignUpData,
  signUpFormSchema,
} from "@/features/main/auth/lib/validators";
import { useFeedback } from "@/hooks/use-feedback";
import { Link, useRouter } from "@/lib/i18n/navigation";

export function SignUpForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const { handle } = useFeedback();

  const form = useAppForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    } satisfies SignUpData,
    validators: {
      onChange: signUpFormSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await signUpAction(value);
      handle(
        {
          success: res.ok,
          data: res.ok ? res.value : undefined,
          error: res.ok ? undefined : res.error,
        },
        {
          success: t("signUpSuccess"),
          error: (err) => err?.message || "Failed to sign up",
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
            {t("signUpTitle")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("signUpDescription")}
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
                <form.AppField name="name">
                  {(field) => (
                    <field.input
                      autoComplete="name"
                      disabled={isSubmitting}
                      icon={<IconUser className="size-4" />}
                      label={t("nameLabel")}
                      type="text"
                    />
                  )}
                </form.AppField>

                <form.AppField name="username">
                  {(field) => (
                    <field.input
                      autoComplete="username"
                      disabled={isSubmitting}
                      icon={<IconUser className="size-4" />}
                      label={t("usernameLabel")}
                      type="text"
                    />
                  )}
                </form.AppField>

                <form.AppField name="email">
                  {(field) => (
                    <field.input
                      autoComplete="email"
                      disabled={isSubmitting}
                      icon={<IconMail className="size-4" />}
                      label={t("emailLabel")}
                      type="email"
                    />
                  )}
                </form.AppField>

                <form.AppField name="password">
                  {(field) => (
                    <field.password
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      icon={<IconLock className="size-4" />}
                      label={t("passwordLabel")}
                    />
                  )}
                </form.AppField>

                <form.AppField name="confirmPassword">
                  {(field) => (
                    <field.password
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      icon={<IconLock className="size-4" />}
                      label={t("confirmPasswordLabel")}
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
                  {isSubmitting ? t("submitting") : t("signUpButton")}
                </Button>
              </>
            )}
          </form.Subscribe>
        </form>

        {/* Social auth */}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => <SocialAuth disabled={isSubmitting} />}
        </form.Subscribe>

        {/* Link to sign in */}
        <div className="text-center text-muted-foreground text-sm">
          {t("alreadyHaveAccount")}{" "}
          <Link
            className="font-medium text-primary underline-offset-2 hover:underline"
            href="/sign-in"
          >
            {t("signInButton")}
          </Link>
        </div>
      </div>
    </div>
  );
}
