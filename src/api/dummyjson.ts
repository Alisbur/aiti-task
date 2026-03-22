// В dev-запросах Vite проксирует `/dummyjson/*` на `https://dummyjson.com/*`,
// чтобы обойти CORS в браузере.
const BASE_URL = '/dummyjson'

export type DummyAuthTokens = {
  accessToken: string
  refreshToken: string
}

export type ProductSortKey = 'title' | 'brand' | 'sku' | 'price' | 'rating'
export type ProductSortOrder = 'asc' | 'desc'

export type DummyProduct = {
  id: number
  title: string
  brand: string
  sku: string
  price: number
  rating: number
}

export type DummyProductsResponse = {
  products: DummyProduct[]
  total: number
  skip: number
  limit: number
}

type ApiError = {
  message?: string
}

async function requestJson<T>(
  url: string,
  init?: Parameters<typeof fetch>[1]
): Promise<T> {
  const res = await fetch(url, init)
  const data: ApiError | T | null = await res
    .json()
    .catch(() => null as ApiError | T | null)

  if (!res.ok) {
    const message = (data as ApiError | null)?.message
    throw new Error(message ?? `Request failed with ${res.status}`)
  }

  return data as T
}

export async function dummyLogin(input: {
  username: string
  password: string
  expiresInMins?: number
}): Promise<DummyAuthTokens> {
  return requestJson<DummyAuthTokens>(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: input.username,
      password: input.password,
      expiresInMins: input.expiresInMins ?? 30,
    }),
    credentials: 'include',
  })
}

export async function dummyFetchProducts(input: {
  token?: string | null
  query?: string
  limit: number
  skip: number
  sortBy: ProductSortKey
  order: ProductSortOrder
}): Promise<DummyProductsResponse> {
  const { token, query, limit, skip, sortBy, order } = input

  const endpoint = query ? '/products/search' : '/products'
  const params = new URLSearchParams()
  params.set('limit', String(limit))
  params.set('skip', String(skip))
  params.set('sortBy', sortBy)
  params.set('order', order)
  if (query) params.set('q', query)

  const url = `${BASE_URL}${endpoint}?${params.toString()}`

  return requestJson<DummyProductsResponse>(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
}
