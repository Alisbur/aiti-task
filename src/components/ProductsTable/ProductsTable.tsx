import { CircleEllipsis, Minus, Plus } from "lucide-react";
import { type FC, useMemo, useState } from "react";

import type { TDummyProductType } from "@/shared/types/dummy-product.type";

import { ProductsTableHeader } from "./ProductsTableHeader";
import { ProductsTableRow } from "./ProductsTableRow";

type TProductsTablePropsType = {
  products: TDummyProductType[];
  isLoading: boolean;
  error: string | undefined;
};

export const ProductsTable: FC<TProductsTablePropsType> = ({
  products,
  isLoading,
  error,
}) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id))
      setSelectedItems((prev) => prev.filter((item) => item !== id));
    else setSelectedItems((prev) => [...prev, id]);
  };

  const allItemsSelected: boolean = useMemo(
    () =>
      products.every((p) => selectedItems.includes(p.id)) && !!products.length,
    [products, selectedItems]
  );

  const handleSelectAll = () => {
    if (allItemsSelected) products.forEach((p) => handleSelectItem(p.id));
    else
      products.forEach((p) => {
        if (!selectedItems.includes(p.id)) handleSelectItem(p.id);
      });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <ProductsTableHeader
          allItemsSelected={allItemsSelected}
          selectAll={handleSelectAll}
        />
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                Загрузка...
              </td>
            </tr>
          ) : null}
          {!isLoading && error ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                Что-то пошло не так... {error}
              </td>
            </tr>
          ) : null}
          {!isLoading && !error && products.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                Ничего не найдено
              </td>
            </tr>
          ) : null}
          {!isLoading && !error && products.length
            ? products.map((p) => {
                const isItemSelected = selectedItems.includes(p.id);

                return (
                  <ProductsTableRow
                    key={p.id}
                    product={p}
                    onSelect={() => handleSelectItem(p.id)}
                    isSelected={isItemSelected}
                    actionSlot={
                      <div className="flex items-center gap-x-8">
                        {isItemSelected ? (
                          <button
                            type="button"
                            className="text-text-primary inline-flex h-[27px] items-center justify-center rounded-full border border-black bg-white px-[14px] text-white transition hover:opacity-[0.8]"
                            aria-label="Удалить"
                            onClick={() => handleSelectItem(p.id)}
                          >
                            <Minus size={22} color="black" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="bg-button-bg inline-flex h-[27px] items-center justify-center rounded-full border-none px-[14px] text-white transition hover:opacity-[0.8]"
                            aria-label="Добавить"
                            onClick={() => handleSelectItem(p.id)}
                          >
                            <Plus size={22} color="white" />
                          </button>
                        )}

                        <button
                          type="button"
                          className="size-content border-none bg-white outline-none transition-all duration-300 hover:opacity-80"
                        >
                          <CircleEllipsis size={26} color="#D9D9D9" />
                        </button>
                      </div>
                    }
                  />
                );
              })
            : null}
        </tbody>
      </table>
    </div>
  );
};
