import type { DefaultSession } from "next-auth";
import { PhotoData } from "@/lib/queries";
import { Role } from "@/types";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    role: Role;
    slug: string;
    photos?: PhotoData[];
  }
}
