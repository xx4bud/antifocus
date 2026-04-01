import { generateId } from "@/lib/utils/ids";

export function generateUsernameFromEmail(email: string): string {
  const [base] = email.split("@") as [string, string];

  const cleanBase = base.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  const suffix = generateId().slice(0, 4);

  return `${cleanBase}_${suffix}`;
}
