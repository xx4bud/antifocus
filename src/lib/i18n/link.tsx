import { IntlLink } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export type Href = Parameters<typeof IntlLink>[0]["href"];

export interface LinkProps
  extends Omit<React.ComponentProps<typeof IntlLink>, "href"> {
  href: Href | (string & {});
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
        target={
          href.startsWith("mailto:") || href.startsWith("tel:")
            ? "_self"
            : "_blank"
        }
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }

  return (
    <IntlLink
      className={cn(className)}
      // @ts-expect-error dynamic href type
      href={href}
      ref={ref}
      {...props}
    />
  );
}
