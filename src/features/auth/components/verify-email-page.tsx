import { NavLink } from "~/components/ui/nav-link";
import { getServerSession } from "~/features/auth/actions/get-session";
import { VerifyEmailContent } from "~/features/auth/components/verify-email-content";

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_TOKEN: "Token verifikasi tidak valid atau sudah kadaluarsa.",
  EXPIRED_TOKEN: "Token verifikasi sudah kadaluarsa.",
};

interface VerifyEmailPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { error } = await searchParams;
  const session = await getServerSession();

  let status: "success" | "error" | "idle";

  if (error) {
    status = "error";
  } else if (session) {
    status = "success";
  } else {
    status = "idle";
  }

  const errorMessage = error ? ERROR_MESSAGES[error] || error : undefined;

  return (
    <main className="flex min-h-svh flex-1 items-center justify-center">
      <div className="flex h-svh w-full flex-col items-center justify-center space-y-2 px-4 sm:h-fit sm:max-w-md">
        <div className="flex w-full flex-col space-y-2 text-center">
          <h1 className="font-bold text-2xl leading-none">Verifikasi Email</h1>
          {status === "idle" && (
            <p className="text-muted-foreground text-sm">
              Masukkan email Anda untuk mengirim ulang verifikasi
            </p>
          )}
        </div>
        <VerifyEmailContent errorMessage={errorMessage} status={status} />
        {status !== "success" && (
          <div className="mt-2 flex flex-col items-center">
            <div className="text-muted-foreground text-sm">
              Sudah diverifikasi?{" "}
              <NavLink
                className="font-semibold text-primary hover:underline"
                href="/sign-in"
              >
                Masuk
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
