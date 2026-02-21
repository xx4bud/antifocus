import { NavLink } from "~/components/ui/nav-link";
import { AuthSocialButton } from "~/features/auth/components/auth-social-button";

export function SignInPage() {
  return (
    <main className="flex min-h-svh flex-1 items-center justify-center">
      <div className="flex h-svh w-full flex-col items-center justify-center space-y-2 px-4 sm:h-fit sm:max-w-md">
        <div className="flex w-full flex-col space-y-2 text-center">
          <h1 className="font-bold text-2xl leading-none">Masuk</h1>
          <p className="text-muted-foreground text-sm">
            Masuk ke akun anda untuk melanjutkan
          </p>
          <AuthSocialButton provider="google" />
          <div className="relative my-4">
            {/* <Separator /> */}
            <div className="absolute inset-0 flex items-center">
              <span className="mx-auto bg-muted px-2 text-muted-foreground text-xs uppercase">
                Atau masuk dengan email
              </span>
            </div>
          </div>
        </div>
        {/* <SignInForm /> */}
        <div className="mt-2 flex flex-col items-center">
          <div className="text-muted-foreground text-sm">
            Belum punya akun?{" "}
            <NavLink
              className="font-semibold text-primary hover:underline"
              href="/sign-up"
            >
              Daftar
            </NavLink>
          </div>
        </div>
      </div>
    </main>
  );
}
