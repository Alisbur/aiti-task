import type { FC } from "react";

import type { ProductSortKey } from "@/shared/types/dummy-product.type";
import { CustomCheckbox } from "@/shared/ui/CustomCheckbox/CustomCheckbox";
import { useSearchParamsStore } from "@/store/searchStore";

const COLUMNS: { name: string; key: ProductSortKey }[] = [
  { name: "Наименование", key: "title" },
  { name: "Вендор", key: "brand" },
  { name: "Артикул", key: "sku" },
  { name: "Оценка", key: "rating" },
  { name: "Цена, $", key: "price" },
];

type TProductsTableHeaderPropsType = {
  selectAll: () => void;
  allItemsSelected: boolean;
};

export const ProductsTableHeader: FC<TProductsTableHeaderPropsType> = ({
  selectAll,
  allItemsSelected,
}) => {
  const sp = useSearchParamsStore();

  function onSort(nextKey: ProductSortKey) {
    if (sp.sortKey === nextKey) {
      if (sp.sortOrder === "asc") sp.setSortOrder("desc");
      else sp.setSortOrder("asc");
    } else {
      sp.setSortKey(nextKey);
      sp.setSortOrder("desc");
    }
  }

  return (
    <thead>
      <tr className="border-l-1 border-b border-slate-200 border-transparent text-left">
        <th className="w-10 py-3 pr-4 font-medium text-slate-600">
          <CustomCheckbox
            className="cursor-pointer"
            checked={allItemsSelected}
            onChange={selectAll}
          />
        </th>
        {COLUMNS.map((col, idx) => (
          <th className="px-4 py-3" key={col.key}>
            <div
              className={`flex w-full items-center ${!idx ? "justify-start" : "justify-center"}`}
            >
              <button
                type="button"
                className="text-text-secondary flex items-center gap-2 border-none bg-transparent text-[16px] font-medium outline-none transition-all duration-300 hover:opacity-80"
                onClick={() => onSort(col.key)}
              >
                <h6>{col.name}</h6>
                {sp.sortKey === col.key ? (
                  <span className="text-text-secondary">
                    {sp.sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                ) : null}
              </button>
            </div>
          </th>
        ))}
        <th className="w-24 px-4 py-3" />
      </tr>
    </thead>
  );
};
