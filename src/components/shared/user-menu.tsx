"use client";

import { User } from "next-auth";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  LockIcon,
  LogOutIcon,
  ShoppingBagIcon,
  UserIcon,
} from "lucide-react";
import { signOutUser } from "@/app/(auth)/signup/actions";

interface UserMenuProps {
  username?: boolean;
  user: User;
}

export function UserMenu({
  username = true,
  user,
}: UserMenuProps) {

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <DropdownMenuItem asChild>
          <Link href={`/users/${user.slug}`}>
            <UserIcon />
            {username ? user.name || user.slug : "Profile"}
          </Link>
        </DropdownMenuItem>
        {user.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href={"/admin"}>
              <LockIcon />
              Admin
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <ShoppingBagIcon />
          Cart
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />

      <DropdownMenuItem onClick={handleSignOut}>
        <LogOutIcon />
        Logout
      </DropdownMenuItem>
    </>
  );
}
