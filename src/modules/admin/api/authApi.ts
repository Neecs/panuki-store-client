import { API_BASE_URL } from '../../../shared/api/config'

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    throw new Error(res.status === 401 ? 'Credenciales inválidas' : `Error al iniciar sesión (${res.status})`)
  }

  const data: { accessToken: string } = await res.json()
  return data.accessToken
}
