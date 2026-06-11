import { username } from "better-auth/plugins";
import { USERNAME_RULES } from "@/lib/validations/username";

export const usernamePlugin = username({
  minUsernameLength: USERNAME_RULES.MIN,
  maxUsernameLength: USERNAME_RULES.MAX,
});
