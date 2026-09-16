# Panuki Store — Client

Cliente web de Panuki Store: Vue 3 + TypeScript + Vite, con dos áreas independientes
(lazy-loaded por ruta):

- **Tienda** (`/`) — catálogo público de productos, solo lectura.
- **Admin** (`/admin`) — panel de gestión de productos, detrás de login JWT (`/admin/login`).

El backend (NestJS + PostgreSQL) es un proyecto aparte. El contrato de la API está documentado en
[`API_CONTEXT.md`](./API_CONTEXT.md).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el dev server de Vite |
| `npm run build` | Type-check (`vue-tsc -b`) + build de producción a `dist/` |
| `npm run preview` | Sirve el build de producción en local |

No hay test runner ni linter configurados; `npm run build` es el único chequeo de tipos.

## Variables de entorno

Ningún `.env` se versiona (están todos en `.gitignore`, solo `.env.example` queda trackeado como
plantilla) — así una variable sensible que se agregue el día de mañana no se commitea por
accidente, aunque hoy las únicas que existen (`VITE_*`) no sean secretas (terminan igual dentro
del bundle público).

Para desarrollo local, copiá `.env.example` a `.env`. Para probar un build de producción en tu
máquina, copiá también a `.env.production` (ver tabla de abajo). Ninguno de los dos se sube al repo.

| Variable | Dev (`.env`) | Producción |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` (proxy de Vite hacia `http://localhost:8080`, ver `vite.config.ts`) | `https://panuki-store.onrender.com/api` |
| `VITE_WHATSAPP_NUMBER` | Número de WhatsApp para consultas, solo dígitos con indicativo | igual que en dev |

## Deploy (Cloudflare Pages)

Conectar el repo en Cloudflare Pages con:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Framework preset:** Vue (o None, es indiferente)
- **Variables de entorno de build:** como no hay `.env.production` en el repo, hay que cargar ahí
  (Settings → Environment variables):
  - `VITE_API_BASE_URL=https://panuki-store.onrender.com/api`
  - `VITE_WHATSAPP_NUMBER=573115867095`

Dos archivos hacen que el deploy funcione:

- `public/_redirects` → `/* /index.html 200`, el fallback SPA que necesita `createWebHistory()`
  para que `/admin/login` o un refresh en `/admin/productos/:id` no den 404.
- `.nvmrc` → fija Node 22 para el build (Vite 8 y vue-tsc 3 requieren Node 20+).

### Notas

- El backend está en Render (plan free): tras un rato sin tráfico se duerme, y la primera petición
  puede tardar ~30–50 s en responder. Es cold start, no un error del cliente.
- El backend ya tiene CORS habilitado, por eso el cliente llama a la API directo desde el navegador
  y no hace falta ningún proxy ni Pages Function en producción.
