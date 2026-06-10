import { username } from "better-auth/plugins";

export const usernamePlugin = username({
  minUsernameLength: 3,
  maxUsernameLength: 30,
});
