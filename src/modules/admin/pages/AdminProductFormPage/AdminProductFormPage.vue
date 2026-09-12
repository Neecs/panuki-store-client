<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchProduct } from '../../../product/api/productsApi'
import type { Product } from '../../../product/types'
import { createProduct, updateProduct } from '../../api/adminProductsApi'
import { ApiError } from '../../api/http'
import ProductForm, { type ProductFormValues } from '../../components/ProductForm/ProductForm.vue'

const props = defineProps<{ id?: string }>()
const router = useRouter()

const isEditing = computed(() => !!props.id)
const product = ref<Product | null>(null)
const isLoading = ref(false)
const loadError = ref<string | null>(null)
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

onMounted(async () => {
  if (!props.id) return
  isLoading.value = true
  try {
    product.value = await fetchProduct(props.id)
  } catch {
    loadError.value = 'Producto no encontrado'
  } finally {
    isLoading.value = false
  }
})

function buildCreateForm(values: ProductFormValues): FormData {
  const form = new FormData()
  form.set('name', values.name)
  form.set('description', values.description)
  form.set('price', values.price)
  form.set('stock', values.stock)
  if (values.image) form.set('image', values.image)
  return form
}

function buildPatchForm(values: ProductFormValues, current: Product): FormData {
  const form = new FormData()
  if (values.name !== current.name) form.set('name', values.name)
  if (values.description !== current.description) form.set('description', values.description)
  if (Number(values.price) !== current.price) form.set('price', values.price)
  if (Number(values.stock) !== current.stock) form.set('stock', values.stock)
  if (values.image) form.set('image', values.image)
  return form
}

async function handleSubmit(values: ProductFormValues) {
  submitError.value = null
  isSubmitting.value = true
  try {
    if (isEditing.value && product.value) {
      const form = buildPatchForm(values, product.value)
      if ([...form.keys()].length > 0) {
        await updateProduct(product.value.id, form)
      }
    } else {
      await createProduct(buildCreateForm(values))
    }
    router.push({ name: 'admin-products' })
  } catch (err) {
    submitError.value =
      err instanceof ApiError ? err.messages.join(', ') : 'No se pudo guardar el producto'
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  router.push({ name: 'admin-products' })
}
</script>

<template>
  <div>
    <h1>{{ isEditing ? 'Editar producto' : 'Nuevo producto' }}</h1>

    <p v-if="isLoading" class="status">Cargando producto…</p>
    <p v-else-if="loadError" class="status">{{ loadError }}</p>
    <ProductForm
      v-else
      :initial="product"
      :is-submitting="isSubmitting"
      :submit-error="submitError"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped src="./AdminProductFormPage.css"></style>
