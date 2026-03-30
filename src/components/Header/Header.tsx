import { useToasts } from "@/shared/hooks/useToasts";
import { useAuthStore } from "@/store/authStore";
import { useModals } from "@/store/modalsStore";
import { useSearchParamsStore } from "@/store/searchStore";

import { SearchForm } from "./SearchForm";

export const Header = () => {
  const toasts = useToasts();
  const { openModal, closeModal } = useModals();
  const sp = useSearchParamsStore();
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <>
      <div className="bg-section-bg mb-4 flex items-center justify-between gap-x-4 px-[30px] py-[26px]">
        <h3 className="inline-block w-[25%] text-left">Товары</h3>
        <SearchForm className="w-100" />
        <div className="flex w-[25%] justify-end">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                logout();
                closeModal();
                toasts.clearToasts();
                sp.setPage(1);
              }}
              className="bg-button-bg inline-flex h-[42px] items-center rounded-lg border border-slate-200 px-6 text-sm font-medium text-white shadow-sm outline-none transition hover:opacity-80"
            >
              Выйти
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                openModal("auth");
              }}
              className="text-text-primary inline-flex h-[42px] items-center rounded-lg border border-slate-300 bg-white px-6 text-sm font-medium shadow-sm outline-none transition hover:opacity-80"
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </>
  );
};
