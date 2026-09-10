import type { Product } from '../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/product`)
  if (!res.ok) {
    throw new Error(`Failed to load products (${res.status})`)
  }
  const raw: Array<Omit<Product, 'price'> & { price: string | number }> = await res.json()
  return raw.map((product) => ({ ...product, price: Number(product.price) }))
}
