"use client";

import { IconBrandGoogle, IconLoader2 } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { signInSocialAction } from "@/features/main/auth/lib/actions";
import { useFeedback } from "@/hooks/use-feedback";

interface SocialAuthProps {
  disabled?: boolean;
}

export function SocialAuth({ disabled }: SocialAuthProps) {
  const t = useTranslations("Auth");
  const { handle } = useFeedback();
  const [isPending, startTransition] = useTransition();

  const handleGoogleSignIn = () => {
    startTransition(async () => {
      const res = await signInSocialAction("google");
      handle(
        {
          success: res.ok,
          data: res.ok ? res.value : undefined,
          error: res.ok ? undefined : res.error,
        },
        {
          success: t("redirectingSocial"),
          error: (err) => err?.message || "Google Sign-In failed",
          onSuccess: (data) => {
            if (data?.url) {
              window.location.href = data.url;
            }
          },
        }
      );
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-border/50 border-t" />
        </div>
        <span className="relative bg-background px-3 text-muted-foreground text-xs uppercase tracking-wider">
          {t("orContinueWith")}
        </span>
      </div>

      <Button
        className="w-full font-medium transition-colors"
        disabled={disabled || isPending}
        onClick={handleGoogleSignIn}
        size="lg"
        type="button"
        variant="outline"
      >
        {isPending ? (
          <IconLoader2 className="animate-spin" data-icon="inline-start" />
        ) : (
          <IconBrandGoogle data-icon="inline-start" />
        )}
        Google
      </Button>
    </div>
  );
}
