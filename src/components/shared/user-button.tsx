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
import { UserMenu } from "./user-menu";

interface UserButtonProps {
  label?: boolean;
  user: User;
}

export function UserButton({
  label,
  user,
}: UserButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`${label ? "min-w-44 cursor-pointer hover:opacity-90" : ""} flex items-center space-x-3`}
        >
          <Avatar className="size-9 cursor-pointer rounded-full hover:opacity-90">
            <AvatarImage
              src={
                user.photos?.[0].url ||
                user.image ||
                "/avatar-placeholder.jpg"
              }
              alt={user.name || user.slug}
            />
            <AvatarFallback className="size-9 rounded-full">
              {user.name?.charAt(0) || user.slug.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {label && (
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {user.name}
              </span>
              <span className="truncate text-xs">
                # {user.role}
              </span>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-44 cursor-default"
        align="start"
        sideOffset={8}
      >
        <UserMenu user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
