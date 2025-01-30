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
  LogOutIcon,
  ShoppingBagIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  username?: boolean;
  user: User;
}

export function UserMenu({
  username = true,
  user,
}: UserMenuProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
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
