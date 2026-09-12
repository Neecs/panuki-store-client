<script setup lang="ts">
import { ref } from 'vue'
import { useProducts } from '../../../product/composables/useProducts'
import type { Product } from '../../../product/types'
import { deleteProduct } from '../../api/adminProductsApi'
import { ApiError } from '../../api/http'
import AdminProductTable from '../../components/AdminProductTable/AdminProductTable.vue'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.vue'

const { products, isLoading, error, refetch } = useProducts()

const productToDelete = ref<Product | null>(null)
const deleteError = ref<string | null>(null)

function requestDelete(product: Product) {
  deleteError.value = null
  productToDelete.value = product
}

function cancelDelete() {
  productToDelete.value = null
}

async function confirmDelete() {
  const product = productToDelete.value
  if (!product) return
  try {
    await deleteProduct(product.id)
    products.value = products.value.filter((p) => p.id !== product.id)
    productToDelete.value = null
  } catch (err) {
    deleteError.value = err instanceof ApiError ? err.messages.join(', ') : 'No se pudo eliminar el producto'
  }
}
</script>

<template>
  <div>
    <div class="header-row">
      <h1>Productos</h1>
      <RouterLink class="new-btn" :to="{ name: 'admin-product-new' }">Nuevo producto</RouterLink>
    </div>

    <p v-if="isLoading" class="status">Cargando productos…</p>
    <div v-else-if="error" class="status">
      <p>{{ error }}</p>
      <button type="button" @click="refetch">Reintentar</button>
    </div>
    <p v-else-if="!products.length" class="status">Todavía no hay productos publicados.</p>
    <AdminProductTable v-else :products="products" @delete="requestDelete" />

    <ConfirmDialog
      :open="productToDelete !== null"
      title="Eliminar producto"
      :message="`¿Eliminar “${productToDelete?.name}”? Esta acción no se puede deshacer desde el panel.`"
      confirm-label="Eliminar"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
    <p v-if="deleteError" class="status">{{ deleteError }}</p>
  </div>
</template>

<style scoped src="./AdminProductsPage.css"></style>
