import { ref, onMounted } from 'vue'
import type { Product } from '../types'
import { fetchProducts } from '../api/productsApi'

export function useProducts() {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    isLoading.value = true
    error.value = null
    try {
      products.value = await fetchProducts()
    } catch {
      error.value = 'No pudimos cargar los productos. Intenta de nuevo.'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(load)

  return { products, isLoading, error, refetch: load }
}
