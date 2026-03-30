import { type FC, type ReactNode, useState } from "react";

type TProductsActionsPropsType = {
  actionsSlot: ReactNode;
};

export const ProductsActions: FC<TProductsActionsPropsType> = ({
  actionsSlot,
}) => {
  return (
    <>
      <div className="space-between flex w-full items-center">
        <h4 className="inline-block w-full text-left">Все позиции</h4>
        <div className="flex items-center gap-x-4">{actionsSlot}</div>
      </div>
    </>
  );
};
