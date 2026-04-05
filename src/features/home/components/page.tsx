import { SignOutButton } from "@/features/auth/components/ui/sign-out-button";
import { SocialAuth } from "@/features/auth/components/ui/social-auth";
import { getServerSession } from "@/lib/auth/server";

export async function HomePage() {
  const session = await getServerSession();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="font-bold text-xl">
        {session ? "Welcome back to Antifocus" : "Welcome to Antifocus"}
      </h1>
      <div className="mt-2 grid grid-cols-1 gap-2">
        {session ? (
          <>
            <pre className="max-w-md overflow-x-auto rounded-md border border-border bg-muted p-2 text-sm">
              {JSON.stringify(session, null, 2)}
            </pre>
            <SignOutButton />
          </>
        ) : (
          <SocialAuth />
        )}
      </div>
    </div>
  );
}
