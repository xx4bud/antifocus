import { apiKeyClient } from "@better-auth/api-key/client";
import {
  adminClient,
  organizationClient,
  twoFactorClient,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { baseURL } from "@/lib/utils";

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    adminClient(),
    organizationClient(),
    twoFactorClient(),
    apiKeyClient(),
    usernameClient(),
  ],
});

export const {
  useSession,
  signIn,
  signOut,
  signUp,
  organization,
  useListOrganizations,
  useActiveOrganization,
} = authClient;
