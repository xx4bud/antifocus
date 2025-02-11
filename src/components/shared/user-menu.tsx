"use client";

import { User } from "next-auth";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  LockIcon,
  LogOutIcon,
  ShoppingBagIcon,
  UserIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface UserMenuProps {
  username?: boolean;
  user: User;
}

export function UserMenu({
  username = true,
  user,
}: UserMenuProps) {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <DropdownMenuItem asChild>
          <Link
            prefetch={true}
            href={`/users/${user.slug}`}
          >
            <UserIcon />
            {username ? user.name || user.slug : "Profile"}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <ShoppingBagIcon />
          Cart
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      {user.role === "ADMIN" && (
        <DropdownMenuItem asChild>
          <Link href={"/admin"}>
            <LockIcon />
            Admin
          </Link>
        </DropdownMenuItem>
      )}
      <DropdownMenuItem onClick={handleSignOut}>
        <LogOutIcon />
        Logout
      </DropdownMenuItem>
    </>
  );
}
