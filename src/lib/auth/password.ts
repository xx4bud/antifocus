"use server";

import { hash, type Options, verify } from "@node-rs/argon2";

const opts: Options = {
  memoryCost: 19_456, // 19 MB
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export async function hashPassword(password: string): Promise<string> {
  try {
    return await hash(password, opts);
  } catch (error) {
    console.log(error);
    throw new Error("Error hashing password!");
  }
}

export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  try {
    return await verify(hashed, password);
  } catch {
    return false;
  }
}
