import { create } from "zustand";

type TModalType = "auth" | "addProduct";

type TModalsStoreType = {
  modalType: TModalType | null;
  isOpen: boolean;
  openModal: (modalType: TModalType) => void;
  closeModal: () => void;
};

export const useModals = create<TModalsStoreType>((set) => ({
  modalType: null,
  isOpen: false,
  openModal: (modalType) => set({ modalType, isOpen: true }),
  closeModal: () => set({ modalType: null, isOpen: false }),
}));
