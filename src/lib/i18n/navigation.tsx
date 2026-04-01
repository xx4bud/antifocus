import { createNavigation } from "next-intl/navigation";
import { routing } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

export const {
  Link: IntlLink,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing);

export interface LinkProps
  extends Omit<React.ComponentProps<typeof IntlLink>, "href"> {
  href: Parameters<typeof IntlLink>[0]["href"] | (string & {});
}

export function Link({ className, href = "#", ref, ...props }: LinkProps) {
  const isExternal =
    typeof href === "string" &&
    (href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:"));

  if (isExternal) {
    return (
      <a
        className={cn(className)}
        href={href}
        ref={ref}
        rel="noopener noreferrer"
        target="_blank"
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }

  return (
    <IntlLink
      className={cn(className)}
      // @ts-expect-error
      href={href}
      ref={ref}
      {...props}
    />
  );
}
