"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFeedback } from "@/hooks/use-feedback";
import { useRouter } from "@/lib/i18n/navigation";
import type { SignInSocialSchema } from "../../models/validators";
import { signInSocialAction } from "../../services/sign-in-social.actions";

interface SocialAuthProvider {
  icon: string;
  id: SignInSocialSchema["provider"];
  name: string;
}

const SOCIAL_AUTH_PROVIDERS: SocialAuthProvider[] = [
  {
    id: "google",
    name: "Google",
    icon: "/assets/icon-google.svg",
  },
];

export function SocialAuth() {
  const { handleError, handleSuccess } = useFeedback();
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackURL = searchParams.get("callbackURL") ?? "/";
  const [activeProvider, setActiveProvider] = useState<
    SignInSocialSchema["provider"] | null
  >(null);

  const handleSignIn = async (data: SignInSocialSchema) => {
    setActiveProvider(data.provider);
    const result = await signInSocialAction(data);
    setActiveProvider(null);
    if (result.success) {
      handleSuccess("Login berhasil");
      // @ts-expect-error
      router.push(result.data.url);
    } else {
      handleError(result.error);
    }
  };

  return (
    <div className="grid w-full grid-cols-1 gap-2">
      {SOCIAL_AUTH_PROVIDERS.map((provider) => (
        <Button
          className="w-full"
          disabled={activeProvider === provider.id}
          key={provider.id}
          onClick={() => handleSignIn({ provider: provider.id, callbackURL })}
          variant="outline"
        >
          <Image
            alt={provider.name}
            className="size-4"
            height={16}
            src={provider.icon}
            width={16}
          />
          Masuk dengan {provider.name}
        </Button>
      ))}
    </div>
  );
}
