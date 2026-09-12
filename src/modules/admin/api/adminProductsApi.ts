import { normalizeProduct } from '../../product/api/productsApi'
import type { Product } from '../../product/types'
import { authFetch } from './http'

type RawProduct = Omit<Product, 'price'> & { price: string | number }

export async function createProduct(form: FormData): Promise<Product> {
  const res = await authFetch('/product', { method: 'POST', body: form })
  const raw: RawProduct = await res.json()
  return normalizeProduct(raw)
}

export async function updateProduct(id: string, form: FormData): Promise<Product> {
  const res = await authFetch(`/product/${id}`, { method: 'PATCH', body: form })
  const raw: RawProduct = await res.json()
  return normalizeProduct(raw)
}

export async function deleteProduct(id: string): Promise<void> {
  await authFetch(`/product/${id}`, { method: 'DELETE' })
}
