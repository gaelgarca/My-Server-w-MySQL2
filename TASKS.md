# ✅ Tareas del Proyecto

Lista de trabajo para completar la API REST de productos con **Node.js**, **Express**, **TypeScript** y **MySQL2**.

---

## 📊 Estado General

- [x] Crear la carpeta independiente del proyecto.
- [x] Inicializar el proyecto con npm.
- [x] Instalar las dependencias de producción y desarrollo.
- [x] Configurar TypeScript.
- [x] Preparar la estructura de carpetas y archivos.
- [x] Instalar y configurar MySQL Server 8.4.
- [x] Crear el esquema SQL de la base de datos.
- [x] Configurar el servidor Express y el endpoint de salud.
- [x] Definir las seis rutas de productos.
- [x] Inicializar un repositorio Git independiente.
- [x] Configurar la base de datos local del proyecto.
- [ ] Implementar los controladores de productos.
- [ ] Validar entradas y manejar errores.
- [ ] Probar todos los endpoints con MySQL.
- [ ] Completar la evidencia de funcionamiento.
- [ ] Publicar el proyecto en GitHub.

---

## 🔐 1. Configuración Local

- [x] Crear `.env` a partir de `.env.example`.
- [x] Completar las variables locales:
  - [x] `PORT`
  - [x] `DB_HOST`
  - [x] `DB_PORT`
  - [x] `DB_USER`
  - [x] `DB_PASSWORD`
  - [x] `DB_NAME`
- [x] Confirmar que `.env` continúa excluido por `.gitignore`.
- [x] Evitar escribir contraseñas directamente en el código fuente.

---

## 🗄️ 2. Base de Datos

- [x] Ejecutar `database/schema.sql` en MySQL.
- [x] Confirmar la creación de la base `products_db`.
- [x] Confirmar la creación de la tabla `products`.
- [x] Verificar los campos de la tabla:
  - [x] `id` entero, autoincremental y llave primaria.
  - [x] `name` obligatorio.
  - [x] `price` decimal con dos posiciones y obligatorio.
  - [x] `stock` entero y obligatorio.
  - [x] `description` obligatorio.
  - [x] `brand` opcional.
  - [x] `img` opcional.
  - [x] `active` booleano, obligatorio y con valor inicial verdadero.
- [x] Confirmar la conexión desde `src/conf/dbConnection.ts`.
- [x] Mantener la tabla vacía para crear los productos de prueba mediante la API.

---

## 🧠 3. Controladores de Productos

Archivo principal: `src/controllers/products.controller.ts`.

### Obtener todos los productos

- [ ] Implementar `getAllProducts`.
- [ ] Consultar solamente productos con `active = TRUE`.
- [ ] Responder con un arreglo JSON.

### Obtener un producto por ID

- [ ] Implementar `getProductById`.
- [ ] Validar que `id` sea un entero positivo.
- [ ] Buscar solamente productos activos.
- [ ] Responder `404` si no existe o está inactivo.

### Crear un producto

- [ ] Implementar `createProduct`.
- [ ] Validar `name`, `price`, `stock` y `description`.
- [ ] Permitir que `brand` e `img` sean opcionales.
- [ ] Validar que `price` sea numérico y mayor que cero.
- [ ] Validar que `stock` sea un entero válido.
- [ ] Utilizar una consulta `INSERT` parametrizada.
- [ ] Responder con estado `201` y el identificador generado.

### Actualizar un producto

- [ ] Implementar `updateProduct`.
- [ ] Validar el ID y el cuerpo completo.
- [ ] Actualizar solamente un producto activo.
- [ ] Utilizar una consulta `UPDATE` parametrizada.
- [ ] Responder `404` cuando el producto no exista o esté inactivo.

### Dar de baja un producto

- [ ] Implementar `deleteProduct`.
- [ ] Validar el ID recibido.
- [ ] Cambiar `active` a `FALSE`.
- [ ] No utilizar una sentencia `DELETE` física.
- [ ] Responder `404` cuando el producto no exista o ya esté inactivo.

### Cambiar el precio

- [ ] Implementar `changePrice`.
- [ ] Aceptar solamente `price` en el cuerpo de la solicitud.
- [ ] Validar que el precio sea numérico y mayor que cero.
- [ ] Modificar exclusivamente el campo `price`.
- [ ] Responder `404` cuando el producto no exista o esté inactivo.

---

## 🛡️ 4. Validaciones y Manejo de Errores

- [ ] Utilizar consultas parametrizadas con `?` en todas las operaciones.
- [ ] No concatenar valores de las solicitudes dentro del SQL.
- [ ] Responder `400` cuando el ID o los datos sean inválidos.
- [ ] Responder `404` cuando el producto no exista o esté inactivo.
- [ ] Responder `500` cuando ocurra un error interno o de base de datos.
- [ ] No exponer contraseñas, consultas completas ni detalles internos en los errores.
- [ ] Mantener respuestas JSON consistentes.
- [ ] Evitar el uso innecesario de `any`.
- [ ] Confirmar que el proyecto continúa compilando con `strict: true`.

---

## 🌐 5. Endpoints que Deben Funcionar

- [ ] `GET /api/v1/products/getAll`
- [ ] `GET /api/v1/products/getById/:id`
- [ ] `POST /api/v1/products/create`
- [ ] `PUT /api/v1/products/update/:id`
- [ ] `DELETE /api/v1/products/delete/:id`
- [ ] `PATCH /api/v1/products/change-price/:id`
- [ ] `GET /health`

---

## 🧪 6. Pruebas HTTP

Actualizar y ejecutar las solicitudes de `http/products.http`.

- [ ] Comprobar el endpoint de salud.
- [ ] Crear un producto válido.
- [ ] Consultar todos los productos activos.
- [ ] Consultar por ID el producto creado.
- [ ] Actualizar todos los datos del producto.
- [ ] Cambiar solamente su precio.
- [ ] Darlo de baja lógicamente.
- [ ] Confirmar que ya no aparece en `getAll`.
- [ ] Confirmar que `getById/:id` responde `404` después de la baja.
- [ ] Probar un ID inexistente.
- [ ] Probar un ID inválido.
- [ ] Probar un precio igual a cero o negativo.
- [ ] Probar un cuerpo con campos obligatorios faltantes.
- [ ] Guardar las respuestas necesarias para demostrar el funcionamiento.

---

## 🛠️ 7. Verificación Técnica

- [ ] Ejecutar `npm run typecheck` sin errores.
- [ ] Ejecutar `npm run build` sin errores.
- [ ] Ejecutar `npm start` desde `dist/app.js`.
- [ ] Confirmar que el servidor inicia con las variables de entorno.
- [ ] Confirmar que la API maneja correctamente una conexión fallida.
- [ ] Revisar que no existan archivos sensibles preparados para commit.
- [ ] Revisar el estado final con `git status`.

---

## 📘 8. Documentación

- [ ] Actualizar `README.md` cuando la implementación esté completa.
- [ ] Documentar los requisitos y comandos de ejecución.
- [ ] Documentar la configuración de la base de datos.
- [ ] Documentar el cuerpo JSON de `POST`, `PUT` y `PATCH`.
- [ ] Documentar los códigos de respuesta principales.
- [ ] Confirmar que los nombres de rutas coinciden con el código.

---

## 📦 9. Git y GitHub

- [x] Crear el repositorio Git local independiente.
- [x] Configurar la rama principal como `main`.
- [x] Crear el primer commit del proyecto.
- [ ] Crear el repositorio público `My-Server-w-MySQL2` en GitHub.
- [ ] Configurar el remoto `origin`.
- [ ] Subir la rama `main`.
- [ ] Verificar que `.env`, `node_modules` y `dist` no aparezcan en GitHub.
- [ ] Crear commits separados y descriptivos para los cambios restantes.
- [ ] Confirmar que el enlace público abre correctamente.

---

## 🏁 Definición de Proyecto Completo

El proyecto estará terminado cuando:

- [ ] Las seis operaciones funcionen con datos reales de MySQL.
- [ ] Las consultas normales oculten productos inactivos.
- [ ] La eliminación sea exclusivamente lógica.
- [ ] Todas las entradas esenciales estén validadas.
- [ ] Los códigos HTTP sean correctos.
- [ ] TypeScript compile sin errores.
- [ ] Las pruebas cubran casos exitosos y casos inválidos.
- [ ] La documentación permita instalar y ejecutar el proyecto.
- [ ] El repositorio público de GitHub esté actualizado.
