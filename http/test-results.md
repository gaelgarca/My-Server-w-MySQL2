# 🧪 Resultados de Pruebas HTTP

Verificación realizada el **8 de octubre de 2026** sobre la versión compilada del servidor y la base de datos local `products_db`.

---

## ⚙️ Entorno

- Node.js `24.19.0`
- npm `11.17.0`
- MySQL Community Server `8.4.9`
- API disponible durante la prueba en `http://localhost:3000`

---

## 📊 Resultados

| Solicitud | Resultado esperado | Resultado obtenido |
|---|---:|---:|
| `GET /health` | `200` | `200` |
| `POST /api/v1/products/create` | `201` | `201` |
| `GET /api/v1/products/getAll` | `200` | `200` |
| `GET /api/v1/products/getById/4` | `200` | `200` |
| `PUT /api/v1/products/update/4` | `200` | `200` |
| `PATCH /api/v1/products/change-price/4` | `200` | `200` |
| `PATCH` con precio inválido | `400` | `400` |
| `POST` con cuerpo incompleto | `400` | `400` |
| `GET` con ID inválido | `400` | `400` |
| `GET` con ID inexistente | `404` | `404` |
| `DELETE /api/v1/products/delete/4` | `200` | `200` |
| `GET /api/v1/products/getAll` después de la baja | `200` | `200` |
| `GET /api/v1/products/getById/4` después de la baja | `404` | `404` |

---

## 🔄 Recorrido Comprobado

1. Se creó el producto temporal con ID `4`.
2. El producto apareció en la consulta general de productos activos.
3. La consulta individual devolvió el producto creado.
4. La actualización completa modificó sus datos.
5. El cambio de precio modificó exclusivamente `price`.
6. La baja lógica respondió correctamente.
7. El producto dejó de aparecer en `getAll`.
8. La consulta individual posterior respondió `404`.
9. MySQL conservó el registro con `active = 0`.

---

## ✅ Comprobaciones Adicionales

- `npm run build` terminó sin errores.
- Todas las respuestas HTTP comprobadas utilizaron JSON.
- El producto inactivo permaneció en la tabla; no se ejecutó una eliminación física.
- La colección `products.http` reutiliza dinámicamente el ID generado por la solicitud de creación.
- El servidor se detuvo al finalizar y el puerto `3000` quedó libre.

---

## 🛠️ Verificación de Producción

- `npm run typecheck` terminó sin errores.
- `npm run build` generó correctamente `dist/app.js` y sus módulos.
- `npm start` ejecutó la versión compilada desde `dist/app.js`.
- `/health` respondió `200` con las variables locales cargadas.
- `/api/v1/products/getAll` respondió `200`, confirmando la conexión con MySQL.
- Una ejecución aislada con un puerto de MySQL inexistente respondió `500` con un mensaje JSON genérico.
- Los servidores de verificación fueron detenidos y los puertos `3000` y `3001` quedaron libres.

---

## 🚀 Repetir la Prueba

1. Ejecutar `npm run build`.
2. Iniciar el servidor con `npm start`.
3. Abrir `http/products.http` con REST Client en VS Code.
4. Ejecutar las solicitudes en el orden presentado.
5. Detener el servidor al terminar.
