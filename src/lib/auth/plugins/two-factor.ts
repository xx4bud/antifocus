import { twoFactor } from "better-auth/plugins";

export function twoFactorPlugin() {
  return twoFactor({
    schema: {
      twoFactor: {},
    },
  });
}
