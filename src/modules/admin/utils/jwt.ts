export interface JwtPayload {
  exp?: number
  email?: string
  sub?: string
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    )
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

export function isJwtExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return true
  return payload.exp * 1000 <= Date.now()
}
