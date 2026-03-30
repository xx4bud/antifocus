"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getLocaleFlag,
  getLocaleName,
  type Locale,
  SUPPORTED_LOCALES,
} from "@/lib/i18n";
import { usePathname, useRouter } from "@/lib/i18n/navigation";

export function LocaleSwitcher() {
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (locale: Locale) => {
    try {
      // @ts-expect-error
      router.replace(pathname, { locale });
    } catch (_error) {
      toast.error("gagal mengganti bahasa");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Switch language. Current language: ${getLocaleName(currentLocale)}`}
        asChild
      >
        <Button
          className="flex items-center justify-between sm:w-40"
          variant={"outline"}
        >
          <div className="flex items-center justify-center gap-2">
            <span>{getLocaleFlag(currentLocale)}</span>
            <span className="mt-0.5 hidden sm:inline">
              {getLocaleName(currentLocale)}
            </span>
          </div>
          <IconChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-(--radix-dropdown-menu-trigger-width)"
      >
        {SUPPORTED_LOCALES.map((locale) => (
          <DropdownMenuItem
            aria-current={locale === currentLocale ? "true" : undefined}
            key={locale}
            onClick={() => handleLocaleChange(locale)}
          >
            <span>{getLocaleFlag(locale)}</span>
            <span className="mt-0.5">{getLocaleName(locale)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
