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
    <div className="relative w-full max-w-md">
      {/* Background glow decorator */}
      <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-primary/30 to-violet-500/30 opacity-70 blur-xl transition duration-1000 group-hover:duration-200" />

      {/* Glassmorphism Card */}
      <div className="relative flex flex-col gap-6 rounded-2xl border border-border/50 bg-card/45 p-8 shadow-2xl backdrop-blur-xl dark:bg-card/30">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="bg-linear-to-r from-foreground to-foreground/85 bg-clip-text font-bold text-3xl text-foreground tracking-tight">
            {t("signUpTitle")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("signUpDescription")}
          </p>
        </div>

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
                  className="relative mt-2 w-full overflow-hidden font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
                  disabled={isSubmitting}
                  size="lg"
                  type="submit"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <IconLoader2 className="size-4 animate-spin" />
                      {t("submitting")}
                    </span>
                  ) : (
                    t("signUpButton")
                  )}
                </Button>
              </>
            )}
          </form.Subscribe>
        </form>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => <SocialAuth disabled={isSubmitting} />}
        </form.Subscribe>

        <div className="text-center text-muted-foreground text-sm">
          {t("alreadyHaveAccount")}{" "}
          <Link
            className="font-semibold text-primary underline-offset-4 hover:underline"
            href="/sign-in"
          >
            {t("signInButton")}
          </Link>
        </div>
      </div>
    </div>
  );
}
