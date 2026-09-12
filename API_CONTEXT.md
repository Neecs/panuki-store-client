# Panuki Store — API Context (para el frontend)

Backend: NestJS + PostgreSQL (TypeORM). Base URL en dev: `http://localhost:8080` (o el valor de `PORT` en `.env`; `main.ts` cae a 3000 si no está seteado). Todas las rutas tienen el prefijo global `/api` (ej. `http://localhost:8080/api/product`).

⚠️ **CORS no está habilitado en el backend.** Si el front corre en otro origen (otro puerto/dominio), hay que agregar `app.enableCors(...)` en `src/main.ts` antes de poder consumir la API desde el navegador.

Todas las respuestas son JSON. Los errores usan las excepciones HTTP estándar de Nest:
```json
{ "statusCode": 404, "message": "Product not found", "error": "Not Found" }
```
Los DTOs de request tienen `whitelist: true` + `forbidNonWhitelisted: true` (ValidationPipe global): cualquier campo extra en el body devuelve 400. Errores de validación devuelven `message` como array de strings.

---

## Auth (JWT)

- **Login:** `POST /api/auth/login` — público.
  - Request (`LoginDto`): `{ email: string, password: string }`
  - Response 200 (`LoginResponseDto`): `{ accessToken: string }`
  - 401 si las credenciales son inválidas.
- **Uso del token:** en rutas protegidas, header `Authorization: Bearer <accessToken>`.
- El token no tiene refresh — expira a los `JWT_EXPIRES_IN` segundos (default 3600) y hay que loguear de nuevo.
- **Crear admin:** `POST /api/user` — público, pero solo funciona una vez (la segunda llamada tira `409 Conflict`). No hay UI para esto, se llama a mano una sola vez tras el deploy.
  - Request (`CreateUserDto`): `{ email: string, password: string (min 8, max 255) }`
  - Response (`UserResponseDto`): `{ id: string, email: string }`

Hay un solo usuario admin en todo el sistema — no hay roles ni multiusuario.

---

## Product

Todas las rutas de lectura son públicas. Crear/editar/borrar requieren `Authorization: Bearer <token>`.

| Método | Ruta | Auth | Body | Notas |
|---|---|---|---|---|
| GET | `/api/product` | No | — | Devuelve `ProductResponseDto[]` |
| GET | `/api/product/:id` | No | — | 404 si no existe |
| GET | `/api/product/:id/image` | No | — | Devuelve `{ imageUrl: string }`, 404 si no tiene imagen |
| POST | `/api/product` | Sí | `multipart/form-data` | Campos del DTO + archivo opcional en el campo `image` |
| PATCH | `/api/product/:id` | Sí | `multipart/form-data` | Todos los campos opcionales, mismo campo `image` |
| DELETE | `/api/product/:id` | Sí | — | Soft delete, devuelve `{ message, id }` |

**`ProductResponseDto`** (respuesta de GET/POST/PATCH):
```ts
{
  id: string;          // bigint de Postgres, viaja como string
  name: string;
  description: string;
  price: number;        // numeric(10,2)
  stock: number;
  imageUrl?: string | null;
}
```

**`CreateProductDto`** (POST, como campos de form-data):
```ts
{
  name: string;         // no vacío, max 70
  description: string;  // no vacío
  price: number;        // positivo, hasta 2 decimales
  stock: number;        // entero, >= 0
}
// + archivo opcional "image" (jpeg/png/webp, máx 5MB)
```

**`UpdateProductDto`** (PATCH): mismos campos que `CreateProductDto` pero todos opcionales. `name` duplicado (case-insensitive) contra otro producto tira `409 Conflict`.

**Imágenes:** se suben a Cloudinary; `imageUrl` es la URL pública final, no hace falta armar rutas propias para servir el archivo.

---

## Cosas a tener en cuenta desde el front

- IDs de producto y de usuario son `string` (vienen de columnas `bigint`), no números — no castear a `number`.
- Los productos borrados desaparecen de `GET /product` (soft delete vía `deletedAt`), no hay forma de listarlos ni restaurarlos desde la API.
- No hay paginación en `GET /product` — devuelve todo.
- No hay endpoint de logout (JWT stateless) ni de "usuario actual" (`/auth/me`) — si el front necesita saber quién está logueado, hay que decodificar el JWT del login o guardar el email localmente.
