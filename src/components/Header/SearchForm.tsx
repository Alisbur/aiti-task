import { Search } from "lucide-react";
import { type FC, type FormEvent, useEffect, useState } from "react";

import { useSearchParamsStore } from "@/store/searchStore";

type TSearchFormPropsType = {
  className: string;
};

export const SearchForm: FC<TSearchFormPropsType> = ({ className }) => {
  const sp = useSearchParamsStore();

  const [searchDraft, setSearchDraft] = useState(sp.searchQuery);

  function handleApplySearch(e: FormEvent<HTMLFormElement>) {
    const newSearch: string | undefined =
      typeof searchDraft === "string" ? searchDraft.trim() : "";
    e.preventDefault();
    sp.setSearchQuery(newSearch);
  }

  useEffect(() => {
    //eslint-disable-next-line
    if (sp) setSearchDraft(sp.searchQuery);
  }, [sp.searchQuery]);

  return (
    <form
      className={`flex flex-1 items-center ${className}`}
      onSubmit={handleApplySearch}
    >
      <div className="relative w-full">
        <input
          className="text-text-secondary focus:text-text-primary h-[42px] w-full rounded-lg border border-slate-300 bg-white pl-12 text-sm outline-none transition focus:border-indigo-500"
          value={searchDraft || ""}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="Найти"
        />
        <div className="text-text-secondary pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <Search size={24} />
        </div>
      </div>
    </form>
  );
};
