<script setup lang="ts">
import type { Product } from '../../../product/types'
import { formatPrice } from '../../../product/utils/format'
import { getStockStatus } from '../../../product/utils/stock'

defineProps<{ products: Product[] }>()
const emit = defineEmits<{ delete: [product: Product] }>()

const stockLabel: Record<string, string> = {
  'in-stock': 'Disponible',
  low: 'Stock bajo',
  out: 'Agotado',
}
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Precio</th>
          <th>Stock</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>
            <div class="name-cell">
              <span class="thumb">
                <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" />
                <span v-else>{{ product.name.charAt(0).toUpperCase() }}</span>
              </span>
              <span>{{ product.name }}</span>
            </div>
          </td>
          <td>{{ formatPrice(product.price) }}</td>
          <td>
            <span class="badge" :class="getStockStatus(product.stock)">
              {{ stockLabel[getStockStatus(product.stock)] }} ({{ product.stock }})
            </span>
          </td>
          <td>
            <div class="row-actions">
              <RouterLink :to="{ name: 'admin-product-edit', params: { id: product.id } }">
                Editar
              </RouterLink>
              <button type="button" class="delete" @click="emit('delete', product)">
                Eliminar
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped src="./AdminProductTable.css"></style>
