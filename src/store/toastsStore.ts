import { create } from "zustand";

import { type TToastItemType } from "@/shared/types/toast.type";

export type TToastsStoreType = {
  toasts: TToastItemType[];
  pushToast: (toast: TToastItemType) => void;
  popToast: () => void;
  clearToasts: () => void;
  removeToast: (id: string | string[]) => void;
};

export const useToastsStore = create<TToastsStoreType>((set) => ({
  toasts: [],
  pushToast: (toast: TToastItemType) => {
    set((state) => ({
      toasts: [...state.toasts, toast],
    }));
  },
  popToast: () => {
    set((state) => ({ toasts: state.toasts.slice(0, -1) }));
  },
  clearToasts: () => set({ toasts: [] }),
  removeToast: (id: string | string[]) => {
    set((state) => {
      if (state.toasts.length === 0) return state;
      const filteredToasts: TToastItemType[] = state.toasts.filter((t) => {
        return Array.isArray(id) ? !id.includes(t.id) : id !== t.id;
      });
      return { ...state, toasts: filteredToasts };
    });
  },
}));
