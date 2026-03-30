import { BadgePlus } from "lucide-react";

import { useModals } from "@/store/modalsStore";

export const AddProductButton = () => {
  const { openModal } = useModals();

  return (
    <button
      type="button"
      onClick={() => openModal("addProduct")}
      className="bg-button-bg inline-flex h-[42px] items-center gap-x-2 rounded-lg px-4 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
    >
      <BadgePlus />
      <span>Добавить</span>
    </button>
  );
};
