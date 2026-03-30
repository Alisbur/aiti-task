import { create } from "zustand";

import type {
  ProductSortKey,
  ProductSortOrder,
} from "@/shared/types/dummy-product.type";

const DEFAULT_LIMIT = 20;

export type TSearchStoreType = {
  searchQuery?: string;
  page: number;
  sortKey?: ProductSortKey;
  sortOrder?: ProductSortOrder;
  limit: number;
  ready: boolean;
  setSearchQuery: (newSearchQuery?: string) => void;
  setSortKey: (newSortKey: ProductSortKey) => void;
  setSortOrder: (newSortOrder: ProductSortOrder) => void;
  setPage: (newPage: number) => void;
  syncWithUrl: (v: string | null) => void;
  getSearchParamsString: () => string;
  resetAll: () => void;
};

const SORT_KEYS: ProductSortKey[] = [
  "title",
  "brand",
  "sku",
  "price",
  "rating",
];

function isSortKey(v: string | null): v is ProductSortKey {
  return v !== null && SORT_KEYS.includes(v as ProductSortKey);
}

function isSortOrder(v: string | null): v is ProductSortOrder {
  return v === "asc" || v === "desc";
}

export const useSearchParamsStore = create<TSearchStoreType>((set) => ({
  searchQuery: undefined,
  page: 1,
  sortKey: undefined,
  sortOrder: undefined,
  ready: false,
  limit: DEFAULT_LIMIT,

  setSearchQuery: (newSearchQuery?: string) =>
    set((state) => ({
      ...state,
      searchQuery: newSearchQuery || undefined,
      sortOrder: undefined,
      sortKey: undefined,
      page: 1,
    })),

  setSortKey: (newSortKey: ProductSortKey) =>
    set((state) => {
      if (!isSortKey(newSortKey)) return state;
      if (state.sortKey === newSortKey) return state;
      return { ...state, sortKey: newSortKey, page: 1 };
    }),

  setSortOrder: (newSortOrder: ProductSortOrder) =>
    set((state) => {
      if (!isSortOrder(newSortOrder)) return state;
      if (state.sortOrder === newSortOrder) return state;
      return { ...state, sortOrder: newSortOrder, page: 1 };
    }),

  setPage: (newPage: number) =>
    set((state) => {
      const page = Math.max(1, newPage);
      if (state.page === page) return state;
      return { ...state, page };
    }),

  syncWithUrl: (v: string | null) =>
    set((state) => {
      if (!v) return state;

      const sp = new URLSearchParams(v);

      const searchQuery = sp.get("q") ?? undefined;

      const sortKey = isSortKey(sp.get("sort"))
        ? (sp.get("sort") as ProductSortKey)
        : undefined;

      const sortOrder = isSortOrder(sp.get("order"))
        ? (sp.get("order") as ProductSortOrder)
        : undefined;

      const parsedPage = Number.parseInt(sp.get("page") ?? "1", 10);
      const pageIndex = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);

      return { searchQuery, sortKey, sortOrder, page: pageIndex };
    }),

  resetAll: () =>
    set({
      searchQuery: undefined,
      page: 1,
      sortKey: undefined,
      sortOrder: undefined,
    }),

  getSearchParamsString: (): string => {
    const state = useSearchParamsStore.getState();
    const sp = new URLSearchParams();

    if (state.searchQuery) sp.set("q", state.searchQuery);
    if (state.sortKey) sp.set("sort", state.sortKey);
    if (state.sortOrder) sp.set("order", state.sortOrder);
    if (state.page && state.page !== 1) sp.set("page", state.page.toString());
    set((state) => ({ ...state, ready: true }));
    return sp.toString();
  },
}));
