"use client";

import { IconLogout, IconUser } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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

  const menuItems: NavItem[] = [
    {
      label: "Akun Saya",
      icon: IconUser,
      href: "/account",
    },
    {
      label: "Keluar",
      icon: IconLogout,
      onClick: handleSignOut,
    },
  ];

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
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 font-medium text-sm hover:bg-accent hover:text-accent-foreground"
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
        <Avatar className="cursor-pointer rounded-lg grayscale">
          <AvatarImage alt={user.name} src={user.image ?? undefined} />
          <AvatarFallback className="rounded-lg">{user.name[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-44"
        forceMount
        sideOffset={8}
      >
        <DropdownMenuGroup>
          {menuItems.map((item) => (
            <DropdownMenuItem
              asChild={!!item.href}
              key={item.label}
              onClick={item.onClick}
            >
              {item.href ? (
                <NavLink href={item.href}>
                  {item.icon && <item.icon className="mr-2 size-4" />}
                  {item.label}
                </NavLink>
              ) : (
                <>
                  {item.icon && <item.icon className="mr-2 size-4" />}
                  {item.label}
                </>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
