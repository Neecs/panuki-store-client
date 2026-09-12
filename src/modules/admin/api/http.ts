import { API_BASE_URL } from '../../../shared/api/config'
import { clearToken, getToken } from '../composables/useAuth'
import router from '../../../router'

export class ApiError extends Error {
  status: number
  messages: string[]

  constructor(status: number, messages: string[]) {
    super(messages[0] ?? `Error (${status})`)
    this.status = status
    this.messages = messages
  }
}

async function parseErrorMessages(res: Response): Promise<string[]> {
  try {
    const body: { message?: string | string[] } = await res.json()
    if (Array.isArray(body.message)) return body.message
    if (typeof body.message === 'string') return [body.message]
  } catch {
    // response wasn't JSON, fall through to a generic message
  }
  return [`Error (${res.status})`]
}

export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken()
  const headers = new Headers(init.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers })

  if (res.status === 401) {
    clearToken()
    router.push({ name: 'admin-login', query: { redirect: router.currentRoute.value.fullPath } })
    throw new ApiError(401, ['Sesión expirada, inicia sesión de nuevo'])
  }

  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorMessages(res))
  }

  return res
}
