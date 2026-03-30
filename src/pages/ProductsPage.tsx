import { useEffect } from "react";

import { AddProductModal } from "@/components/AddProductModal/AddProductModal";
import { Header } from "@/components/Header/Header";
import { LoginModal } from "@/components/LoginModal/LoginModal";
import { ProductsSection } from "@/components/ProductsSection/ProductsSection";
import { ToastHost } from "@/components/ToastHost/ToastHost";
import { useToasts } from "@/shared/hooks/useToasts";
import { useAuthStore } from "@/store/authStore";
import { useModals } from "@/store/modalsStore";

export default function ProductsPage() {
  const { isAuthenticated, token } = useAuthStore();
  const { openModal } = useModals();
  const { addToast } = useToasts();

  useEffect(() => {
    if (!isAuthenticated) openModal("auth");
  }, [isAuthenticated]);

  return (
    <>
      <div className="bg-page-bg min-h-screen w-full bg-slate-50">
        <div className="w-full">
          <Header />
          {isAuthenticated && (
            <>
              <ProductsSection />
            </>
          )}
        </div>
      </div>
      <ToastHost />
      <LoginModal />
      <AddProductModal
        onAdded={() =>
          addToast({ type: "success", message: "Продукт успешно добавлен!" })
        }
      />
    </>
  );
}
