import { apiKey } from "better-auth/plugins";

export function apiKeyPlugin() {
  return apiKey({
    schema: {
      apikey: {},
    },
  });
}
