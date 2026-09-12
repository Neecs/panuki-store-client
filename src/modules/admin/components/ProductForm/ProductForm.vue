<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Product } from '../../../product/types'

const MAX_NAME_LENGTH = 70
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const props = defineProps<{
  initial?: Product | null
  isSubmitting: boolean
  submitError?: string | null
}>()

export interface ProductFormValues {
  name: string
  description: string
  price: string
  stock: string
  image: File | null
}

const emit = defineEmits<{ submit: [values: ProductFormValues]; cancel: [] }>()

const name = ref('')
const description = ref('')
const price = ref('')
const stock = ref('')
const imageFile = ref<File | null>(null)
const imageError = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})

watch(
  () => props.initial,
  (product) => {
    name.value = product?.name ?? ''
    description.value = product?.description ?? ''
    price.value = product ? String(product.price) : ''
    stock.value = product ? String(product.stock) : ''
    imageFile.value = null
  },
  { immediate: true },
)

const previewUrl = computed(() => {
  if (imageFile.value) return URL.createObjectURL(imageFile.value)
  return props.initial?.imageUrl ?? null
})

function handleImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  imageError.value = null

  if (file) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      imageError.value = 'La imagen debe ser JPEG, PNG o WEBP'
      imageFile.value = null
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      imageError.value = 'La imagen no puede superar 5MB'
      imageFile.value = null
      return
    }
  }

  imageFile.value = file
}

function validate(): boolean {
  const errors: Record<string, string> = {}

  if (!name.value.trim()) errors.name = 'El nombre es obligatorio'
  else if (name.value.length > MAX_NAME_LENGTH) errors.name = `Máximo ${MAX_NAME_LENGTH} caracteres`

  if (!description.value.trim()) errors.description = 'La descripción es obligatoria'

  const priceValue = Number(price.value)
  if (!price.value || Number.isNaN(priceValue) || priceValue <= 0) {
    errors.price = 'Ingresa un precio válido mayor a 0'
  } else if (Math.round(priceValue * 100) !== priceValue * 100) {
    errors.price = 'Máximo 2 decimales'
  }

  const stockValue = Number(stock.value)
  if (!stock.value || Number.isNaN(stockValue) || stockValue < 0 || !Number.isInteger(stockValue)) {
    errors.stock = 'Ingresa una cantidad entera igual o mayor a 0'
  }

  fieldErrors.value = errors
  return Object.keys(errors).length === 0
}

function handleSubmit() {
  if (!validate()) return

  emit('submit', {
    name: name.value.trim(),
    description: description.value.trim(),
    price: price.value,
    stock: stock.value,
    image: imageFile.value,
  })
}
</script>

<template>
  <form class="form" @submit.prevent="handleSubmit">
    <div v-if="previewUrl" class="preview">
      <img :src="previewUrl" alt="Vista previa" />
    </div>

    <div class="field">
      <label for="image">Imagen</label>
      <input id="image" type="file" accept="image/jpeg,image/png,image/webp" @change="handleImageChange" />
      <span v-if="imageError" class="field-error">{{ imageError }}</span>
      <span v-else class="hint">JPEG, PNG o WEBP, máximo 5MB</span>
    </div>

    <div class="field">
      <label for="name">Nombre</label>
      <input id="name" v-model="name" type="text" maxlength="70" />
      <span v-if="fieldErrors.name" class="field-error">{{ fieldErrors.name }}</span>
    </div>

    <div class="field">
      <label for="description">Descripción</label>
      <textarea id="description" v-model="description" rows="4"></textarea>
      <span v-if="fieldErrors.description" class="field-error">{{ fieldErrors.description }}</span>
    </div>

    <div class="row">
      <div class="field">
        <label for="price">Precio</label>
        <input id="price" v-model="price" type="number" step="0.01" min="0" />
        <span v-if="fieldErrors.price" class="field-error">{{ fieldErrors.price }}</span>
      </div>

      <div class="field">
        <label for="stock">Stock</label>
        <input id="stock" v-model="stock" type="number" step="1" min="0" />
        <span v-if="fieldErrors.stock" class="field-error">{{ fieldErrors.stock }}</span>
      </div>
    </div>

    <p v-if="submitError" class="form-error">{{ submitError }}</p>

    <div class="actions">
      <button class="save" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Guardando…' : 'Guardar' }}
      </button>
      <button class="cancel" type="button" @click="emit('cancel')">Cancelar</button>
    </div>
  </form>
</template>

<style scoped src="./ProductForm.css"></style>
