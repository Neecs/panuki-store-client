import { computed, ref } from 'vue'
import { decodeJwtPayload, isJwtExpired } from '../utils/jwt'

const TOKEN_KEY = 'panuki_admin_token'

const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))

export const isAuthenticated = computed(() => {
  if (!token.value) return false
  return !isJwtExpired(decodeJwtPayload(token.value))
})

export const adminEmail = computed(() => {
  if (!token.value) return null
  return decodeJwtPayload(token.value)?.email ?? decodeJwtPayload(token.value)?.sub ?? null
})

export function getToken(): string | null {
  return token.value
}

export function setToken(newToken: string): void {
  token.value = newToken
  localStorage.setItem(TOKEN_KEY, newToken)
}

export function clearToken(): void {
  token.value = null
  localStorage.removeItem(TOKEN_KEY)
}

export function useAuth() {
  return { isAuthenticated, adminEmail, setToken, clearToken }
}
