const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? ''

export function buildWhatsAppLink(message: string, phone: string = WHATSAPP_NUMBER): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
