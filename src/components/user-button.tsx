"use client";

import { User } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { UserNav } from "./user-nav";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserButtonProps {
  user: User;
}

export function UserButton({ user }: UserButtonProps) {
  const isMobile = useIsMobile();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`${isMobile ? "min-w-36" : ""} flex items-center space-x-3 hover:opacity-90`}
        >
          <Avatar className="size-9 cursor-pointer rounded-full hover:opacity-90">
            <AvatarImage
              src={user.image || "/avatar-placeholder.jpg"}
              alt={user.name || user.slug}
            />
            <AvatarFallback className="size-9 rounded-full">
              {user.name?.charAt(0) || user.slug.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {isMobile && (
            <div className="grid flex-1 cursor-pointer text-left text-sm leading-tight">
              <span className="truncate font-semibold text-primary-foreground">
                {user.name}
              </span>
              <span className="truncate text-xs">
                @ {user.slug}
              </span>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`${isMobile ? "w-36" : "w-44"} cursor-pointer`}
        align="start"
        sideOffset={8}
      >
        <UserNav user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
