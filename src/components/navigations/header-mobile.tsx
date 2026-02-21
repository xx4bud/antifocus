"use client";

import { useState } from "react";
import { LogoWhite } from "~/components/ui/logo";
import { SearchBar, SearchTrigger } from "~/components/ui/search";

export function HeaderMobile() {
  const [openSearch, setOpenSearch] = useState(false);

  const onClick = () => {
    setOpenSearch(!openSearch);
  };

  return (
    <nav className="flex flex-1 items-center md:hidden">
      {openSearch ? (
        <div className="flex flex-1 items-center gap-3">
          <SearchTrigger isOpen={true} onClick={onClick} />
          <SearchBar />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoWhite href={"/"} />
          </div>
          <div className="flex items-center">
            <SearchTrigger isOpen={false} onClick={onClick} />
          </div>
        </div>
      )}
    </nav>
  );
}
