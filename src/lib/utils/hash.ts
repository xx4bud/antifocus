import { hash, type Options, verify } from "@node-rs/argon2";
import { createError } from "./error";
import { type AppResult, tryCatchAsync } from "./result";

const opts: Options = {
  memoryCost: 19_456, // 19 MB
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

/**
 * Securely hashes a password using Argon2id.
 */
export const hashPassword = async (
  password: string
): Promise<AppResult<string>> =>
  tryCatchAsync(
    () => hash(password, opts),
    (error) =>
      createError(
        "HASH_ERROR",
        error instanceof Error ? error.message : "Failed to hash password",
        500,
        { operation: "hashPassword" }
      )
  );

/**
 * Verifies a plain text password against an Argon2id hash.
 */
export const verifyPassword = async (
  hashedPassword: string,
  plainPassword: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(
    async () => {
      const result = await verify(hashedPassword, plainPassword, opts);
      return typeof result === "boolean"
        ? result
        : (result as { valid?: boolean }).valid === true;
    },
    (error) =>
      createError(
        "VERIFY_ERROR",
        error instanceof Error ? error.message : "Failed to verify password",
        500,
        { operation: "verifyPassword" }
      )
  );
