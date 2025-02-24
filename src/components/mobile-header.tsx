"use client";

import * as React from "react";
import {
  SearchBar,
  SearchClose,
  SearchOpen,
} from "./app-search";
import { Logobar } from "./ui/logobar";
import { SidebarTrigger } from "./ui/sidebar";

export function MobileHeader() {
  const [openSearch, setOpenSearch] = React.useState(false);

  const onClick = () => {
    setOpenSearch(!openSearch);
  };

  return (
    <nav className="flex flex-1 items-center md:hidden">
      {openSearch ? (
        <div className="flex flex-1 items-center gap-3">
          <SearchClose onClick={onClick} />
          <SearchBar />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center">
            <Logobar />
          </div>
          <div className="flex items-center gap-3">
            <SearchOpen onClick={onClick} />
            <SidebarTrigger />
          </div>
        </div>
      )}
    </nav>
  );
}
