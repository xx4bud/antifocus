import { generateId } from "@/lib/utils/ids";

export function generateUsernameFromEmail(email: string): string {
  const [base] = email.split("@") as [string, string];

  const cleanBase = base.replace(/[^a-zA-Z0-9]/g, "");

  const suffix = generateId().slice(0, 2);

  return `${cleanBase}${suffix}`;
}
