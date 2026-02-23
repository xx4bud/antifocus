"use client";

import { IconBrandWhatsapp } from "@tabler/icons-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { LoadingButton } from "~/components/ui/loading-button";
import { signInSocial } from "~/features/auth/actions/sign-in-social";

export type OAuthProvider = "google" | "whatsapp";

export interface AuthSocialButtonProps {
  provider: OAuthProvider;
}

export function AuthSocialButton({ provider }: AuthSocialButtonProps) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const callbackURL = searchParams.get("callbackURL") ?? "/";

  const providerName = provider === "google" ? "Google" : "Whatsapp";

  const providerIcon =
    provider === "google" ? (
      <Image alt="Google" height={18} src="/assets/google.svg" width={18} />
    ) : (
      <IconBrandWhatsapp />
    );

  const onClick = () => {
    startTransition(async () => {
      try {
        toast.success(`Menghubungkan akun ${providerName}`);

        if (provider === "google") {
          const res = await signInSocial(provider, callbackURL);

          if (res.success) {
            window.location.href = res.data;
          } else {
            toast.error(res.error.message);
          }
        } else {
          toast.error("Login Whatsapp");
        }
      } catch {
        toast.error("Terjadi kesalahan saat menghubungkan akun");
      }
    });
  };

  return (
    <LoadingButton
      className="w-full"
      disabled={isPending}
      loading={isPending}
      onClick={onClick}
    >
      {!isPending && providerIcon}
      Hubungkan dengan {providerName}
    </LoadingButton>
  );
}
