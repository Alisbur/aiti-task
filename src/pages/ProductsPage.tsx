import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { type FormEvent, useEffect, useMemo, useState } from 'react'

import {
  dummyFetchProducts,
  type DummyProductsResponse,
  type ProductSortKey,
} from '@/api/dummyjson'
import AddProductModal from '@/components/AddProductModal'
import LoginModal from '@/components/LoginModal'
import { ToastHost, type ToastItem } from '@/components/Toast'
import { useAuthStore } from '@/store/authStore'

const LIMIT = 20

type ProductSortOrder = 'asc' | 'desc'
type SortState = { key: ProductSortKey; order: ProductSortOrder }

const SORT_KEYS: ProductSortKey[] = ['title', 'brand', 'sku', 'price', 'rating']

function isSortKey(v: string | null): v is ProductSortKey {
  return v !== null && SORT_KEYS.includes(v as ProductSortKey)
}

function isSortOrder(v: string | null): v is ProductSortOrder {
  return v === 'asc' || v === 'desc'
}

function readStateFromSearchParams(): {
  searchQuery: string
  sort: SortState
  page: number
} {
  const sp = new URLSearchParams(window.location.search)

  const searchQuery = sp.get('q') ?? ''

  const sortKey = isSortKey(sp.get('sort'))
    ? (sp.get('sort') as ProductSortKey)
    : 'title'
  const order = isSortOrder(sp.get('order'))
    ? (sp.get('order') as ProductSortOrder)
    : 'asc'

  const parsedPage = Number.parseInt(sp.get('page') ?? '1', 10)
  const pageIndex = Number.isNaN(parsedPage) ? 0 : Math.max(0, parsedPage - 1)

  return { searchQuery, sort: { key: sortKey, order }, page: pageIndex }
}

export default function ProductsPage() {
  const queryClient = useQueryClient()

  const token = useAuthStore((s) => s.token)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)

  const initialFromUrl = useMemo(() => {
    return readStateFromSearchParams()
  }, [])

  const [sort, setSort] = useState<SortState>(() => initialFromUrl.sort)
  const [page, setPage] = useState(() => initialFromUrl.page)
  const [searchQuery, setSearchQuery] = useState(
    () => initialFromUrl.searchQuery
  )
  const [searchDraft, setSearchDraft] = useState(
    () => initialFromUrl.searchQuery
  )

  const [addOpen, setAddOpen] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const productsQuery = useQuery<DummyProductsResponse>({
    queryKey: [
      'products',
      { searchQuery, page, sortKey: sort.key, order: sort.order },
    ],
    queryFn: async () => {
      return dummyFetchProducts({
        token,
        query: searchQuery || undefined,
        limit: LIMIT,
        skip: page * LIMIT,
        sortBy: sort.key,
        order: sort.order,
      })
    },
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  })

  const products = productsQuery.data?.products ?? []
  const total = productsQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  // Синхронизируем сортировку/поиск/страницу с URL, чтобы состояние восстанавливалось через search params.
  useEffect(() => {
    const url = new URL(window.location.href)

    if (searchQuery) url.searchParams.set('q', searchQuery)
    else url.searchParams.delete('q')

    url.searchParams.set('sort', sort.key)
    url.searchParams.set('order', sort.order)
    url.searchParams.set('page', String(page + 1))

    window.history.replaceState({}, '', url.toString())
  }, [page, searchQuery, sort.key, sort.order])

  useEffect(() => {
    const onPopState = () => {
      const next = readStateFromSearchParams()
      setSort(next.sort)
      setSearchQuery(next.searchQuery)
      setSearchDraft(next.searchQuery)
      setPage(next.page)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function pushToast(message: string) {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`
    setToasts((prev) => [...prev, { id, message }])
  }

  const range = useMemo(() => {
    if (!total) return { start: 0, end: 0 }
    const start = page * LIMIT + 1
    const end = Math.min((page + 1) * LIMIT, total)
    return { start, end }
  }, [page, total])

  function onSort(nextKey: ProductSortKey) {
    setPage(0)
    setSort((prev) => {
      if (prev.key === nextKey) {
        return { key: nextKey, order: prev.order === 'asc' ? 'desc' : 'asc' }
      }
      return { key: nextKey, order: 'asc' }
    })
  }

  function applySearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSearchQuery(searchDraft.trim())
    setPage(0)
  }

  function refreshTable() {
    queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      {!isAuthenticated ? <LoginModal /> : null}

      <div className="mx-auto w-full max-w-[1120px]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-xl font-semibold text-slate-900">Товары</div>
          </div>

          <form className="flex flex-1 items-center" onSubmit={applySearch}>
            <div className="relative w-full">
              <input
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-12 text-sm outline-none transition focus:border-indigo-500"
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                placeholder="Найти"
              />
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                ?
              </div>
            </div>
          </form>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex h-10 items-center rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
            >
              + Добавить
            </button>
          ) : null}

          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                logout()
                queryClient.clear()
                setAddOpen(false)
                setToasts([])
                setPage(0)
              }}
              className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Выйти
            </button>
          ) : null}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            {productsQuery.isFetching ? 'Загрузка...' : ' '}
          </div>
          <button
            type="button"
            onClick={refreshTable}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-label="Обновить таблицу"
          >
            ...
          </button>
        </div>

        <div className="mb-4 h-1 w-full overflow-hidden rounded bg-slate-200">
          <div
            className="h-full bg-indigo-600 transition-all"
            style={{
              width: productsQuery.isFetching
                ? '100%'
                : productsQuery.isLoading
                  ? '60%'
                  : '0%',
              opacity: productsQuery.isFetching ? 1 : 0,
            }}
          />
        </div>

        <div className="rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="w-10 px-4 py-3 font-medium text-slate-600">
                    <input type="checkbox" />
                  </th>
                  <th className="px-4 py-3">
                    <button
                      type="button"
                      className="flex items-center gap-2 font-medium text-slate-600"
                      onClick={() => onSort('title')}
                    >
                      Наименование
                      {sort.key === 'title' ? (
                        <span className="text-slate-400">
                          {sort.order === 'asc' ? '▲' : '▼'}
                        </span>
                      ) : null}
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button
                      type="button"
                      className="flex items-center gap-2 font-medium text-slate-600"
                      onClick={() => onSort('brand')}
                    >
                      Вендор
                      {sort.key === 'brand' ? (
                        <span className="text-slate-400">
                          {sort.order === 'asc' ? '▲' : '▼'}
                        </span>
                      ) : null}
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button
                      type="button"
                      className="flex items-center gap-2 font-medium text-slate-600"
                      onClick={() => onSort('sku')}
                    >
                      Артикул
                      {sort.key === 'sku' ? (
                        <span className="text-slate-400">
                          {sort.order === 'asc' ? '▲' : '▼'}
                        </span>
                      ) : null}
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button
                      type="button"
                      className="flex items-center gap-2 font-medium text-slate-600"
                      onClick={() => onSort('rating')}
                    >
                      Оценка
                      {sort.key === 'rating' ? (
                        <span className="text-slate-400">
                          {sort.order === 'asc' ? '▲' : '▼'}
                        </span>
                      ) : null}
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button
                      type="button"
                      className="flex items-center gap-2 font-medium text-slate-600"
                      onClick={() => onSort('price')}
                    >
                      Цена, $
                      {sort.key === 'price' ? (
                        <span className="text-slate-400">
                          {sort.order === 'asc' ? '▲' : '▼'}
                        </span>
                      ) : null}
                    </button>
                  </th>
                  <th className="w-24 px-4 py-3" />
                </tr>
              </thead>

              <tbody>
                {productsQuery.isLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Загрузка...
                    </td>
                  </tr>
                ) : null}

                {!productsQuery.isLoading && products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Ничего не найдено
                    </td>
                  </tr>
                ) : null}

                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" />
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {p.title}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{p.brand}</td>
                    <td className="px-4 py-3 text-slate-700">{p.sku}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          p.rating < 3.5
                            ? 'font-medium text-red-600'
                            : 'font-medium text-slate-700'
                        }
                      >
                        {p.rating.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {p.price.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700"
                        aria-label="Добавить"
                      >
                        +
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-500">
              Показано {range.start}-{range.end} из {total}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 0}
                className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                aria-label="Предыдущая"
              >
                {'<'}
              </button>

              {(() => {
                const pages = []
                for (let i = 0; i < totalPages; i += 1) {
                  // Покажем ограниченный набор, чтобы не перегружать UI.
                  if (
                    i === 0 ||
                    i === totalPages - 1 ||
                    Math.abs(i - page) <= 1
                  ) {
                    pages.push(i)
                  }
                }
                const uniqPages = Array.from(new Set(pages))
                return uniqPages.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={
                      p === page
                        ? 'h-9 min-w-9 rounded-lg bg-indigo-600 text-white'
                        : 'h-9 min-w-9 rounded-lg border border-slate-200 bg-white text-slate-700'
                    }
                  >
                    {p + 1}
                  </button>
                ))
              })()}

              <button
                type="button"
                disabled={page >= totalPages - 1}
                className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                aria-label="Следующая"
              >
                {'>'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddProductModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={pushToast}
      />

      <ToastHost
        items={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  )
}
