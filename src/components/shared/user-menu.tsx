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
import { useSidebar } from "@/components/ui/sidebar";
import { signOutUser } from "@/actions/auth.actions";

interface UserMenuProps {
  username?: boolean;
  user: User;
}

export function UserMenu({
  username = true,
  user,
}: UserMenuProps) {
  const { setOpen, setOpenMobile } = useSidebar();

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const onClick = () => {
    setOpen(false);
    setOpenMobile(false);
  };

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <DropdownMenuItem asChild onClick={onClick}>
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
      <DropdownMenuGroup onClick={onClick}>
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
