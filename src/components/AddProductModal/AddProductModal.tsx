import { type FC, useEffect, useRef } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { useToasts } from "@/shared/hooks/useToasts";
import { useModals } from "@/store/modalsStore";

type ProductFormValues = {
  title: string;
  price: string;
  brand: string;
  sku: string;
};

type TAddProductModalPropsType = {
  onAdded?: () => void;
  onClose?: () => void;
};

export const AddProductModal: FC<TAddProductModalPropsType> = ({
  onClose = () => {},
  onAdded,
}) => {
  const { addToast } = useToasts();
  const { modalType, isOpen, closeModal } = useModals();
  const overlayRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: { title: "", price: "", brand: "", sku: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!isOpen) return;
    reset({ title: "", price: "", brand: "", sku: "" });
  }, [isOpen, reset]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };

  const handleClose = () => {
    closeModal();
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    void data;
    try {
      await new Promise((res) =>
        setTimeout(() => {
          res(true);
        }, 400)
      );
      onAdded?.();
      closeModal();
    } catch {
      addToast({ type: "error", message: "Что-то пошло не так" });
    }
  };

  if (modalType !== "addProduct" || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-[520px] rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="text-2xl font-semibold text-slate-900">
            Добавление товара
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Заполните основные поля
          </div>
        </div>

        <form
          className="mt-6 grid grid-cols-1 gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-left">
            <label className="text-text-primary mb-1 block text-sm font-medium">
              Наименование
            </label>
            <input
              {...register("title", {
                validate: (v) => (v.trim() ? true : "Поле обязательно"),
              })}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500"
            />
            {errors.title?.message ? (
              <div className="text-text-accent mt-1 text-xs">
                {errors.title.message}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="text-left">
              <label className="text-text-primary mb-1 block text-sm font-medium">
                Цена
              </label>
              <input
                {...register("price", {
                  validate: (v) => {
                    if (!v.trim()) return "Поле обязательно";
                    return Number.isNaN(Number(v))
                      ? "Цена должна быть числом"
                      : true;
                  },
                })}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500"
                inputMode="decimal"
              />
              {errors.price?.message ? (
                <div className="text-text-accent mt-1 text-xs">
                  {errors.price.message}
                </div>
              ) : null}
            </div>

            <div className="text-left">
              <label className="text-text-primary mb-1 block text-sm font-medium">
                Вендор
              </label>
              <input
                {...register("brand", {
                  validate: (v) => (v.trim() ? true : "Поле обязательно"),
                })}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500"
              />
              {errors.brand?.message ? (
                <div className="text-text-accent mt-1 text-xs">
                  {errors.brand.message}
                </div>
              ) : null}
            </div>
          </div>

          <div className="text-left">
            <label className="text-text-primary mb-1 block text-sm font-medium">
              Артикул
            </label>
            <input
              {...register("sku", {
                validate: (v) => (v.trim() ? true : "Поле обязательно"),
              })}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500"
            />
            {errors.sku?.message ? (
              <div className="text-text-accent mt-1 text-xs">
                {errors.sku.message}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 transition hover:bg-slate-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="bg-button-bg flex-1 rounded-lg px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-700"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
