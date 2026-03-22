import { useEffect } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

type ProductFormValues = {
  title: string
  price: string
  brand: string
  sku: string
}

export default function AddProductModal(props: {
  open: boolean
  onClose: () => void
  onAdded: (message: string) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: { title: '', price: '', brand: '', sku: '' },
    mode: 'onSubmit',
  })

  useEffect(() => {
    if (!props.open) return
    reset({ title: '', price: '', brand: '', sku: '' })
  }, [props.open, reset])

  if (!props.open) return null

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    void data
    // Симуляция "успешного добавления" (по ТЗ сохранение на сервер не нужно).
    await new Promise((r) => setTimeout(r, 400))

    props.onAdded('Товар добавлен (симуляция)')
    props.onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
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
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Наименование
            </label>
            <input
              {...register('title', {
                validate: (v) => (v.trim() ? true : 'Поле обязательно'),
              })}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500"
            />
            {errors.title?.message ? (
              <div className="mt-1 text-xs text-red-600">
                {errors.title.message}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="text-left">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Цена
              </label>
              <input
                {...register('price', {
                  validate: (v) => {
                    if (!v.trim()) return 'Поле обязательно'
                    return Number.isNaN(Number(v))
                      ? 'Цена должна быть числом'
                      : true
                  },
                })}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500"
                inputMode="decimal"
              />
              {errors.price?.message ? (
                <div className="mt-1 text-xs text-red-600">
                  {errors.price.message}
                </div>
              ) : null}
            </div>

            <div className="text-left">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Вендор
              </label>
              <input
                {...register('brand', {
                  validate: (v) => (v.trim() ? true : 'Поле обязательно'),
                })}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500"
              />
              {errors.brand?.message ? (
                <div className="mt-1 text-xs text-red-600">
                  {errors.brand.message}
                </div>
              ) : null}
            </div>
          </div>

          <div className="text-left">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Артикул
            </label>
            <input
              {...register('sku', {
                validate: (v) => (v.trim() ? true : 'Поле обязательно'),
              })}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500"
            />
            {errors.sku?.message ? (
              <div className="mt-1 text-xs text-red-600">
                {errors.sku.message}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={props.onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 transition hover:bg-slate-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-700"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
