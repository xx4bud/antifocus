"use client";

import { useState } from "react";
import { LogoWhite } from "@/components/ui/logo";
import { SearchForm, SearchFormTrigger } from "@/components/ui/search-form";

export function HeaderMobile() {
  const [openSearch, setOpenSearch] = useState(false);

  const onClick = () => {
    setOpenSearch(!openSearch);
  };

  return (
    <nav className="flex flex-1 items-center md:hidden">
      {openSearch ? (
        <div className="flex flex-1 items-center gap-3">
          <SearchFormTrigger isOpen={true} onClick={onClick} />
          <SearchForm />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoWhite href={"/"} />
          </div>
          <div className="flex items-center">
            <SearchFormTrigger isOpen={false} onClick={onClick} />
          </div>
        </div>
      )}
    </nav>
  );
}
