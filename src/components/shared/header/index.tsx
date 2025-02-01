"use client";

import * as React from "react";
import { User } from "next-auth";
import { MenuIcon } from "lucide-react";
import { MainHeader } from "./main";
import MobileHeader from "./mobile";

interface AppHeaderProps {
  user?: User;
}

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <>
      <header className="border-grid sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground backdrop-blur supports-[backdrop-filter]:bg-primary/95">
        <div className="container-wrapper">
          <div className="container">
            <MainHeader user={user} />
            <MobileHeader user={user} />
          </div>
        </div>
      </header>
    </>
  );
}
