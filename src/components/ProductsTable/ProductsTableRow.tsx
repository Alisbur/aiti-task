import type { FC, ReactNode } from "react";

import type { TDummyProductType } from "@/shared/types/dummy-product.type";
import { CustomCheckbox } from "@/shared/ui/CustomCheckbox/CustomCheckbox";

type TProductsTableRowPropsType = {
  product: TDummyProductType;
  isSelected?: boolean;
  onSelect: () => void;
  actionSlot?: ReactNode;
};

type TProductInfoPropsType = {
  title: string;
  category: string;
  img?: string;
};

const ProductInfo: FC<TProductInfoPropsType> = ({ title, category, img }) => {
  return (
    <div className="flex items-center gap-x-4">
      {/* {img ? (
        <img
          src={img}
          className="size-12 rounded-lg object-cover"
          alt={`Изображение ${title}`}
        />
      ) : ( */}
      <div className="size-12 rounded-lg bg-[#C4C4C4]" />
      {/* )} */}
      <div className="flex flex-col items-start gap-y-2">
        <h6 className="text-text-primary text-left">{title}</h6>
        <p className="text-gray text-text-secondary text-left text-[14px] font-medium">
          {category}
        </p>
      </div>
    </div>
  );
};

export const ProductsTableRow: FC<TProductsTableRowPropsType> = ({
  product: p,
  isSelected = false,
  onSelect,
  actionSlot,
}) => {
  return (
    <tr
      key={p.id}
      className={`border-l-none border-l-1 border-b border-slate-100 ${isSelected ? "border-l-checked" : "border-l-transparent"} text-4`}
    >
      <td className="py-3 pr-4">
        <CustomCheckbox checked={isSelected} onChange={onSelect} />
      </td>
      <td className="px-4 py-3">
        <ProductInfo title={p.title} category={p.category} img={p.thumbnail} />
      </td>
      <td className="text-text-primary px-4 py-3">
        <h6>{p.brand}</h6>
      </td>
      <td className="text-text-primary px-4 py-3">{p.sku}</td>
      <td className="px-4 py-3">
        <span
          className={
            p.rating < 3.5
              ? "text-text-accent font-medium"
              : "text-text-primary font-medium"
          }
        >
          {p.rating.toFixed(1)}
        </span>
      </td>
      <td className="text-text-primary px-4 py-3">
        {(() => {
          const price = `${p.price.toLocaleString("ru-RU", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`.split(",");
          return (
            <>
              {price[0]}
              <span className="text-text-secondary">,{price[1]}</span>
            </>
          );
        })()}
      </td>
      <td className="py-3 pl-4">
        <div className="flex items-center gap-x-8">{actionSlot}</div>
      </td>
    </tr>
  );
};
