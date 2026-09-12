import { API_BASE_URL } from '../../../shared/api/config'
import type { Product } from '../types'

type RawProduct = Omit<Product, 'price'> & { price: string | number }

export function normalizeProduct(raw: RawProduct): Product {
  return { ...raw, price: Number(raw.price) }
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/product`)
  if (!res.ok) {
    throw new Error(`Failed to load products (${res.status})`)
  }
  const raw: RawProduct[] = await res.json()
  return raw.map(normalizeProduct)
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/product/${id}`)
  if (!res.ok) {
    throw new Error(`Failed to load product (${res.status})`)
  }
  const raw: RawProduct = await res.json()
  return normalizeProduct(raw)
}
