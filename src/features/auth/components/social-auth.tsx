"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { LoadingButton } from "@/components/shared/loading-button";
import { Separator } from "@/components/ui/separator";
import { useFeedback } from "@/hooks/use-feedback";
import {
  type SocialProvider,
  signInSocialAction,
} from "../actions/sign-in-social";

interface SocialProviderConfig {
  icon: string;
  id: SocialProvider;
  name: string;
}

const SOCIAL_PROVIDERS: SocialProviderConfig[] = [
  {
    id: "google",
    name: "Google",
    icon: "/assets/icon-google.svg",
  },
];

/**
 * Reusable Social Authentication component.
 * Displays available social login providers dynamically.
 */
export function SocialAuth() {
  const { handleError } = useFeedback();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [activeProvider, setActiveProvider] = useState<SocialProvider | null>(
    null
  );

  const handleSignIn = async (provider: SocialProvider) => {
    setActiveProvider(provider);

    try {
      const result = await signInSocialAction(provider, callbackUrl);

      if (!result.success) {
        handleError(result.error.message);
        setActiveProvider(null);
        return;
      }

      // Action returns a redirect URL on success
      if (result.data.url) {
        window.location.href = result.data.url;
      }
    } catch (error) {
      console.error(
        `[SocialAuth] Error during sign-in with ${provider}:`,
        error
      );
      handleError(`Terjadi kesalahan saat masuk dengan ${provider}.`);
      setActiveProvider(null);
    }
  };

  return (
    <div className="grid w-full gap-6 pb-2">
      <div className="grid gap-3">
        {SOCIAL_PROVIDERS.map((provider) => (
          <LoadingButton
            className="w-full"
            key={provider.id}
            loading={activeProvider === provider.id}
            onClick={() => handleSignIn(provider.id)}
            variant="outline"
          >
            {activeProvider !== provider.id && (
              <Image
                alt={provider.name}
                className="mr-2"
                height={18}
                src={provider.icon}
                width={18}
              />
            )}
            Masuk dengan {provider.name}
          </LoadingButton>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Atau</span>
        </div>
      </div>
    </div>
  );
}
