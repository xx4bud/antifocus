import { siteConfig } from "@/config/site";
import Link from "next/link";

export const AppFooter = () => {
  return (
    <>
      <footer className="border-grid border-t bg-secondary text-secondary-foreground">
        <div className="container-wrapper">
          <div className="container py-1">
            <p className="text-balance text-xs leading-loose">
              &copy;&nbsp;{new Date().getFullYear()}&nbsp;
              {siteConfig.name}&nbsp;by&nbsp;
              <Link
                href={siteConfig.author.url}
                className="hover:underline"
                target="_blank"
              >
                {siteConfig.author.name}
              </Link>
              .&nbsp;All&nbsp;rights&nbsp;reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
