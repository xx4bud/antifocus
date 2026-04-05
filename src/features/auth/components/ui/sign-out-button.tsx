"use client";

import { Button } from "@/components/ui/button";
import { useFeedback } from "@/hooks/use-feedback";
import { useRouter } from "@/lib/i18n/navigation";
import { signOutAction } from "../../services/sign-out.actions";

export function SignOutButton() {
  const { handleError, handleSuccess } = useFeedback();
  const router = useRouter();

  const handleSignOut = async () => {
    const result = await signOutAction();
    if (result.success) {
      handleSuccess("Logout berhasil");
      router.push("/");
    } else {
      handleError(result.error);
    }
  };

  return <Button onClick={handleSignOut}>Sign Out</Button>;
}
