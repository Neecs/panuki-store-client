<script setup lang="ts">
import { useProducts } from '../../composables/useProducts'
import TopBar from '../../components/TopBar/TopBar.vue'
import ProductListIntro from '../../components/ProductListIntro/ProductListIntro.vue'
import ProductGrid from '../../components/ProductGrid/ProductGrid.vue'
import StoreFooter from '../../components/StoreFooter/StoreFooter.vue'

const { products, isLoading, error, refetch } = useProducts()
</script>

<template>
  <div class="page">
    <TopBar />

    <p v-if="isLoading" class="status">Cargando productos&hellip;</p>
    <div v-else-if="error" class="status">
      <p>{{ error }}</p>
      <button type="button" @click="refetch">Reintentar</button>
    </div>
    <template v-else>
      <ProductListIntro />
      <ProductGrid :products="products" />
    </template>

    <StoreFooter />
  </div>
</template>

<style scoped src="./ProductListingPage.css"></style>
