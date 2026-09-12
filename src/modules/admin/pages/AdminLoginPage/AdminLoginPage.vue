<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../../api/authApi'
import { setToken } from '../../composables/useAuth'

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const isSubmitting = ref(false)

async function handleSubmit() {
  error.value = null
  isSubmitting.value = true
  try {
    const accessToken = await login(email.value, password.value)
    setToken(accessToken)
    const redirect = route.query.redirect
    router.push(typeof redirect === 'string' ? redirect : { name: 'admin-products' })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'No se pudo iniciar sesión'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="screen">
    <form class="card" @submit.prevent="handleSubmit">
      <h1>Panuki Admin</h1>
      <p class="subtitle">Inicia sesión para administrar los productos</p>

      <div class="field">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" required autocomplete="username" />
      </div>

      <div class="field">
        <label for="password">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
        />
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <button class="submit" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Ingresando…' : 'Ingresar' }}
      </button>
    </form>
  </div>
</template>

<style scoped src="./AdminLoginPage.css"></style>
