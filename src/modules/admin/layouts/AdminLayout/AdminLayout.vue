<script setup lang="ts">
import { useRouter } from 'vue-router'
import { adminEmail, clearToken } from '../../composables/useAuth'

const router = useRouter()

function logout() {
  clearToken()
  router.push({ name: 'admin-login' })
}
</script>

<template>
  <div class="shell">
    <header class="bar">
      <div class="brand">
        Panuki <span class="tag">Admin</span>
      </div>
      <div class="actions">
        <span v-if="adminEmail" class="email">{{ adminEmail }}</span>
        <a href="/">Ver tienda</a>
        <button type="button" @click="logout">Cerrar sesión</button>
      </div>
    </header>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped src="./AdminLayout.css"></style>
