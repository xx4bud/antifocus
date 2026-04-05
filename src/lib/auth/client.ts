import { createAuthClient } from "better-auth/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from ".";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { getSession, signIn, signUp, signOut } = authClient;
