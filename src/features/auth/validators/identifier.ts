import { z } from "zod";
import { emailSchema } from "@/lib/validators/email";
import { phoneNumberSchema } from "@/lib/validators/phone-number";
import { usernameSchema } from "@/lib/validators/username";

export function identifierSchema() {
  return z
    .string()
    .transform((val) => {
      const email = emailSchema().safeParse(val);
      if (email.success) {
        return { type: "email" as const, value: email.data };
      }

      const phone = phoneNumberSchema().safeParse(val);
      if (phone.success) {
        return { type: "phone_number" as const, value: phone.data };
      }

      const username = usernameSchema().safeParse(val);
      if (username.success) {
        return { type: "username" as const, value: username.data };
      }

      return null;
    })
    .refine((val): val is NonNullable<typeof val> => val !== null, {
      message: "Email atau Username tidak valid",
    });
}

export type Identifier = z.infer<ReturnType<typeof identifierSchema>>;
export type IdentifierType = Identifier["type"];

export function validIdentifier(v: string) {
  return identifierSchema().safeParse(v);
}
