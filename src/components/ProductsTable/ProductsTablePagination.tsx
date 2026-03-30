import type { FC } from "react";

import type { TDummyProductType } from "@/shared/types/dummy-product.type";
import { useSearchParamsStore } from "@/store/searchStore";

type TProductsTablePaginationProps = {
  items?: TDummyProductType[];
  range: { start: number; end: number };
  total?: number;
};

export const ProductsTablePagination: FC<TProductsTablePaginationProps> = ({
  items,
  range,
  total = 0,
}) => {
  const sp = useSearchParamsStore();

  const totalPages = Math.max(1, Math.ceil(total / sp.limit));

  if (!items) return null;

  return (
    <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-slate-500">
        Показано {range.start}-{range.end} из {total}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={sp.page <= 1}
          className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => sp.setPage(sp.page - 1)}
          aria-label="Предыдущая"
        >
          {"<"}
        </button>

        {(() => {
          const pages = [];
          for (let i = 1; i <= totalPages; i += 1) {
            if (i === 1 || i === totalPages || Math.abs(i - sp.page) <= 1) {
              pages.push(i);
            }
          }
          const uniqPages = Array.from(new Set(pages));
          return uniqPages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => sp.setPage(p)}
              className={
                p === sp.page || !sp.page
                  ? "h-9 min-w-9 rounded-lg bg-indigo-600 text-white"
                  : "h-9 min-w-9 rounded-lg border border-slate-200 bg-white text-slate-700"
              }
            >
              {p}
            </button>
          ));
        })()}

        <button
          type="button"
          disabled={sp.page >= totalPages}
          className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => sp.setPage(Math.max(totalPages, sp.page))}
          aria-label="Следующая"
        >
          {">"}
        </button>
      </div>
    </div>
  );
};
