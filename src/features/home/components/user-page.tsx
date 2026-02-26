import { IconBuildingStore } from "@tabler/icons-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import { Link } from "~/i18n/navigation";

interface UserOrganization {
  id: string;
  logo: string | null;
  name: string;
  slug: string;
}

interface UserPageProps {
  user: {
    id: string;
    name: string;
    username: string | null;
    displayUsername: string | null;
    image: string | null;
    createdAt: Date;
    organizations: UserOrganization[];
  };
}

export function UserPage({ user }: UserPageProps) {
  return (
    <main className="flex w-full flex-1 flex-col items-center gap-6 py-12">
      {/* Profile Card */}
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border bg-card p-8 shadow-sm">
        <Avatar className="size-24 border-4 border-primary/20">
          <AvatarImage alt={user.name} src={user.image ?? undefined} />
          <AvatarFallback className="text-2xl">
            {user.name[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="text-center">
          <h1 className="font-bold text-2xl tracking-tight">{user.name}</h1>
          {(user.displayUsername ?? user.username) && (
            <p className="text-muted-foreground text-sm">
              @{user.displayUsername ?? user.username}
            </p>
          )}
          <p className="mt-1 text-muted-foreground text-xs">
            Bergabung{" "}
            {new Date(user.createdAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </div>

      {/* Organizations */}
      {user.organizations.length > 0 && (
        <div className="w-full max-w-md">
          <h2 className="mb-3 font-semibold text-lg">Organisasi</h2>
          <div className="flex flex-col gap-2">
            {user.organizations.map((org) => (
              <Link
                className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted"
                href={{ pathname: "/[slug]", params: { slug: org.slug } }}
                key={org.id}
              >
                {org.logo ? (
                  <Image
                    alt={org.name}
                    className="size-10 rounded-full object-cover"
                    height={40}
                    src={org.logo}
                    width={40}
                  />
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <IconBuildingStore className="size-5" />
                  </div>
                )}
                <div>
                  <div className="font-medium text-sm">{org.name}</div>
                  <div className="text-muted-foreground text-xs">
                    /{org.slug}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
