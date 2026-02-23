"use client";

import {
  IconChevronRight,
  IconKey,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { NavLink } from "~/components/ui/nav-link";
import { signOut } from "~/features/auth/actions/sign-out";
import { useRouter } from "~/i18n/navigation";
import type { User } from "~/lib/db/types";

interface AccountMenuProps {
  user: User;
}

export function AccountMenu({ user }: AccountMenuProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  const menuItems = [
    {
      icon: IconUser,
      label: "Informasi Pribadi",
      description: "Nama, email, foto profil",
      href: "/account/profile" as const,
    },
    {
      icon: IconKey,
      label: "Keamanan",
      description: "Kata sandi, akun terhubung",
      href: "/account/security" as const,
    },
  ];

  return (
    <div className="mx-auto w-full space-y-6 py-2">
      {/* Profile Card */}
      <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <Avatar className="size-16">
          <AvatarImage alt={user.name} src={user.image || undefined} />
          <AvatarFallback className="text-xl">
            {user.name[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-base">{user.name}</p>
          <p className="truncate text-muted-foreground text-sm">{user.email}</p>
        </div>
      </div>

      {/* Menu Items */}
      <div>
        <p className="mb-2 px-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Akun
        </p>
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          {menuItems.map((item) => (
            <NavLink
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent/50 active:bg-accent"
              href={item.href}
              key={item.label}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <item.icon className="size-4.5 text-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-muted-foreground text-xs">
                  {item.description}
                </p>
              </div>
              <IconChevronRight className="size-4 text-muted-foreground" />
            </NavLink>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <button
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-destructive transition-colors hover:bg-destructive/5 active:bg-destructive/10"
          onClick={handleSignOut}
          type="button"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
            <IconLogout className="size-4.5 text-destructive" />
          </div>
          <p className="font-medium text-sm">Keluar</p>
        </button>
      </div>
    </div>
  );
}
