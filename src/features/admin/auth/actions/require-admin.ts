"use server";

import { getLocale } from "next-intl/server";
import { getCurrentUser } from "~/features/auth/actions/get-user";
import { redirect } from "~/i18n/navigation";

export async function requireAdmin() {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);

  if (!user || user.role !== "super_admin") {
    redirect({ locale, href: "/" });
  }

  return user;
}
