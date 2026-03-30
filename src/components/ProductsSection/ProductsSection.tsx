import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useEffect, useMemo } from "react";

import {
  dummyFetchProducts,
  type TDummyProductsResponseType,
} from "@/api/dummyjson";
import { useSearchParamsSync } from "@/shared/hooks/useSearchParamsSync";
import { useAuthStore } from "@/store/authStore";
import { useSearchParamsStore } from "@/store/searchStore";

import { CustomLoader } from "../CustomLoader/CustomLoader";
import { ProductsTable } from "../ProductsTable/ProductsTable";
import { ProductsTablePagination } from "../ProductsTable/ProductsTablePagination";
import { AddProductButton } from "./AddProductButton";
import { ProductsActions } from "./ProductsActions";

// моковое количество записей
const LIMIT = 20;

export const ProductsSection = () => {
  const queryClient = useQueryClient();

  useSearchParamsSync();

  const sp = useSearchParamsStore();
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const productsQuery = useQuery<TDummyProductsResponseType>({
    queryKey: [
      "products",
      {
        searchQuery: sp.searchQuery,
        page: sp.page,
        sortKey: sp.sortKey,
        order: sp.sortOrder,
      },
    ],
    queryFn: async () => {
      return dummyFetchProducts({
        token,
        query: sp.searchQuery,
        limit: LIMIT,
        skip: (sp.page - 1) * LIMIT,
        sortBy: sp.sortKey,
        order: sp.sortOrder,
      });
    },
    enabled: isAuthenticated && !!sp.ready,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!isAuthenticated) queryClient.clear();
  }, [isAuthenticated]);

  const products = productsQuery.data?.products ?? [];
  const total = productsQuery.data?.total ?? 0;

  function refreshTable() {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  }

  const range = useMemo(() => {
    if (!total) return { start: 0, end: 0 };
    const start = (sp.page - 1) * sp.limit;
    const end = Math.min(sp.page * sp.limit, total);
    return { start, end };
  }, [sp.page, total]);

  return (
    <section className="bg-section-bg flex w-full flex-col gap-y-5 p-[30px]">
      <ProductsActions
        actionsSlot={
          <>
            <button
              type="button"
              className="border-gray size-[42px] rounded-lg border-[1px] p-[10px] outline-none hover:opacity-[0.8]"
              onClick={refreshTable}
            >
              <RefreshCw size={22} color="#515161" />
            </button>
            <AddProductButton />
          </>
        }
      />

      <CustomLoader
        isLoading={productsQuery.isLoading}
        loadingProgress={
          productsQuery.isFetching ? 100 : productsQuery.isLoading ? 60 : 0
        }
      />
      <ProductsTable
        products={products}
        isLoading={productsQuery.isLoading}
        error={productsQuery.error?.message}
      />
      <ProductsTablePagination items={products} total={total} range={range} />
    </section>
  );
};
