<script setup lang="ts">
import type { Product } from '../../types'
import ProductCard from '../ProductCard/ProductCard.vue'

defineProps<{ products: Product[] }>()
</script>

<template>
  <section v-if="products.length" class="grid">
    <ProductCard v-for="product in products" :key="product.id" :product="product" />
  </section>
  <p v-else class="empty">Todav&iacute;a no hay productos publicados.</p>
</template>

<style scoped src="./ProductGrid.css"></style>
