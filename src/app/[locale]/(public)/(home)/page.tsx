import { headers } from "next/headers";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { auth } from "@/lib/auth";
import { Link } from "@/lib/i18n";

/**
 * Home page with session visibility and sign-out button for development.
 */
export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="container flex flex-col items-center gap-4 py-10">
      <main className="text-center">
        <h1 className="mb-2 text-balance font-bold text-2xl tracking-tight">
          {session
            ? `Selamat datang, ${session.user.name ?? "User"}`
            : "Antifocus"}
        </h1>
        <p className="text-balance text-muted-foreground text-sm">
          {session
            ? "Anda saat ini sudah masuk. Berikut adalah data sesi Anda:"
            : "Silakan masuk untuk mulai menggunakan platform ini."}
        </p>
      </main>

      {session ? (
        <div className="grid w-full max-w-2xl gap-4">
          <div className="overflow-auto rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
            <pre className="font-mono text-sm leading-relaxed">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
          <div className="flex justify-center">
            <SignOutButton />
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link
            className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            href="/sign-in"
          >
            Masuk
          </Link>
          <Link
            className="rounded-lg border border-input bg-background px-6 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
            href="/sign-up"
          >
            Daftar
          </Link>
        </div>
      )}
    </div>
  );
}
