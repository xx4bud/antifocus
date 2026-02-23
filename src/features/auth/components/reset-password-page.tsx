import { notFound } from "next/navigation";
import { NavLink } from "~/components/ui/nav-link";
import { ResetPasswordForm } from "~/features/auth/components/reset-password-form";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return notFound();
  }

  return (
    <main className="flex min-h-svh flex-1 items-center justify-center">
      <div className="flex h-svh w-full flex-col items-center justify-center space-y-2 px-4 sm:h-fit sm:max-w-md">
        <div className="flex w-full flex-col space-y-2 text-center">
          <h1 className="font-bold text-2xl leading-none">Atur Kata Sandi</h1>
          <p className="text-muted-foreground text-sm">
            Masukkan kata sandi baru Anda
          </p>
        </div>
        <ResetPasswordForm token={token} />
        <div className="mt-2 flex flex-col items-center">
          <div className="text-muted-foreground text-sm">
            Ingat kata sandi?{" "}
            <NavLink
              className="font-semibold text-primary hover:underline"
              href="/sign-in"
            >
              Masuk
            </NavLink>
          </div>
        </div>
      </div>
    </main>
  );
}
