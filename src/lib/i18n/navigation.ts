import { createNavigation } from "next-intl/navigation";
import { routing } from "@/lib/i18n/routing";

export const {
  Link: IntlLink,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing);
