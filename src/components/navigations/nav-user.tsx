"use client";

import {
  IconLogout,
  IconPackage,
  IconSettings,
  IconShield,
  IconUser,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { NavLink } from "~/components/ui/nav-link";
import { signOut } from "~/features/auth/actions/sign-out";
import { useRouter } from "~/i18n/navigation";
import type { User } from "~/lib/db/types";
import type { NavItem } from "~/utils/types";

interface NavUserProps {
  user: User;
  variant?: "menu" | "dropdown";
}

export function NavUser({ user, variant = "dropdown" }: NavUserProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  const getMenuItems = (): NavItem[] => {
    const items: NavItem[] = [
      {
        label: "Akun Saya",
        icon: IconUser,
        href: "/account/profile",
      },
      {
        label: "Pesanan Saya",
        icon: IconPackage,
        href: "/order",
      },
      {
        label: "Pengaturan",
        icon: IconSettings,
        href: "/account/security",
      },
    ];

    if (user.role === "admin" || user.role === "owner") {
      items.push({
        label: "Dashboard Admin",
        icon: IconShield,
        href: "/admin",
      });
    }

    items.push({
      label: "Keluar",
      icon: IconLogout,
      onClick: handleSignOut,
    });

    return items;
  };

  const menuItems = getMenuItems();

  if (variant === "menu") {
    return (
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.href ? (
              <NavLink
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 font-medium text-sm hover:bg-accent hover:text-accent-foreground"
                href={item.href}
              >
                {item.icon && <item.icon className="size-4" />}
                <span>{item.label}</span>
              </NavLink>
            ) : (
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 font-medium text-red-500 text-sm hover:bg-accent hover:text-accent-foreground hover:text-red-600"
                onClick={item.onClick}
                type="button"
              >
                {item.icon && <item.icon className="size-4" />}
                <span>{item.label}</span>
              </button>
            )}
          </div>
        ))}
      </nav>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer rounded-lg border-2 border-transparent transition-all hover:border-primary">
          <AvatarImage alt={user.name} src={user.image ?? undefined} />
          <AvatarFallback className="rounded-lg bg-primary/10 font-bold text-primary">
            {user.name[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-xl p-2"
        forceMount
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-2 py-2 text-left text-sm">
            <Avatar className="h-10 w-10 rounded-full border">
              <AvatarImage alt={user.name} src={user.image ?? undefined} />
              <AvatarFallback className="rounded-full bg-primary/10 text-primary">
                {user.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-muted-foreground text-xs">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuGroup className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isLogout = item.label === "Keluar";
            return (
              <DropdownMenuItem
                asChild={!!item.href}
                className={`cursor-pointer rounded-md ${isLogout ? "text-red-500 focus:bg-red-50 focus:text-red-500 dark:focus:bg-red-950/50" : ""}`}
                key={item.label}
                onClick={item.onClick}
              >
                {item.href ? (
                  <NavLink
                    className="flex w-full items-center"
                    href={item.href}
                  >
                    {item.icon && (
                      <item.icon className="mr-2 size-4 opacity-70" />
                    )}
                    {item.label}
                  </NavLink>
                ) : (
                  <div className="flex w-full items-center">
                    {item.icon && (
                      <item.icon className="mr-2 size-4 opacity-70" />
                    )}
                    {item.label}
                  </div>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
