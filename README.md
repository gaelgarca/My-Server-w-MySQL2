# My Server w MySQL2

API REST de productos desarrollada con Node.js, Express, TypeScript y MySQL2.

El servidor permite consultar, crear y actualizar productos, modificar únicamente su precio y realizar bajas lógicas sin eliminar registros de la base de datos.

## Objetivo

Exponer seis operaciones de productos bajo el prefijo `/api/v1/products`:

- Consultar todos los productos activos.
- Consultar un producto activo por ID.
- Crear un producto.
- Actualizar completamente un producto.
- Dar de baja lógicamente un producto.
- Modificar únicamente el precio de un producto.

## Tecnologías

- Node.js
- Express
- TypeScript
- MySQL Community Server
- MySQL2
- dotenv
- tsx

## Requisitos

Antes de instalar el proyecto se necesita:

- Node.js 20 o una versión posterior.
- npm.
- MySQL Server 8 o una versión posterior.
- Git, si se desea clonar el repositorio.
- La extensión REST Client de VS Code es opcional para ejecutar `http/products.http`.

La verificación local se realizó con Node.js 24.19.0, npm 11.17.0 y MySQL Community Server 8.4.9.

## Estructura del proyecto

```text
My-Server-w-MySQL2/
|-- .vscode/
|   \-- settings.json
|-- database/
|   \-- schema.sql
|-- evidencias/
|   |-- mysql/
|   |   |-- 01-producto-activo.png
|   |   \-- 02-producto-inactivo.png
|   \-- thunder-client/
|       |-- 00-get-health.png
|       |-- 01-post-crear-producto.png
|       |-- 02-get-listar-productos.png
|       |-- 03-get-producto-por-id.png
|       |-- 04-put-actualizar-producto.png
|       |-- 05-patch-cambiar-precio.png
|       |-- 06-delete-baja-logica.png
|       \-- 07-get-despues-de-baja-404.png
|-- http/
|   \-- products.http
|-- src/
|   |-- conf/
|   |   \-- dbConnection.ts
|   |-- controllers/
|   |   \-- products.controller.ts
|   |-- routes/
|   |   |-- index.ts
|   |   \-- products.routes.ts
|   |-- app.ts
|   \-- server.ts
|-- .env.example
|-- .gitignore
|-- package.json
|-- tsconfig.json
\-- README.md
```

## Responsabilidad de las carpetas

### src/conf

Contiene la configuración de infraestructura. `dbConnection.ts` crea y exporta el pool de conexiones de MySQL2.

### src/controllers

Contiene la lógica de las operaciones de productos, las validaciones, las consultas parametrizadas y las respuestas HTTP.

### src/routes

Define las rutas de la API y relaciona cada endpoint con su controlador.

### database

Contiene el esquema SQL para crear la base de datos y la tabla `products`.

### evidencias

Contiene capturas de Thunder Client para cada endpoint y capturas de MySQL que demuestran el estado del producto antes y después de la baja lógica.

### http

Contiene una colección reproducible de solicitudes para probar la API.

## Instalación

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone https://github.com/gaelgarca/My-Server-w-MySQL2.git
cd My-Server-w-MySQL2
```

Instala las dependencias:

```bash
npm install
```

## Configuración de MySQL

El archivo `database/schema.sql` crea la base de datos `products_db` y la tabla `products`.

Se puede ejecutar desde MySQL Workbench, MySQL Shell o la línea de comandos:

```bash
mysql -u root -p < database/schema.sql
```

La tabla utiliza la siguiente estructura:

| Campo | Tipo | Restricción |
|---|---|---|
| `id` | `INT UNSIGNED` | Llave primaria y autoincremental |
| `name` | `VARCHAR(150)` | Obligatorio |
| `price` | `DECIMAL(10,2)` | Obligatorio |
| `stock` | `INT` | Obligatorio |
| `description` | `TEXT` | Obligatorio |
| `brand` | `VARCHAR(100)` | Opcional |
| `img` | `VARCHAR(500)` | Opcional |
| `active` | `BOOLEAN` | Obligatorio y verdadero por defecto |

## Variables de entorno

Copia `.env.example` como `.env`:

```powershell
Copy-Item .env.example .env
```

En macOS o Linux se puede usar:

```bash
cp .env.example .env
```

Después completa las credenciales locales de MySQL:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contrasena
DB_NAME=products_db
```

El archivo `.env` está excluido mediante `.gitignore`. Las credenciales locales no deben escribirse en el código ni publicarse en el repositorio.

## Comandos

| Comando | Descripción |
|---|---|
| `npm install` | Instala las dependencias del proyecto |
| `npm run dev` | Inicia el servidor en desarrollo y recarga al detectar cambios |
| `npm run typecheck` | Comprueba los tipos sin generar archivos |
| `npm run build` | Compila TypeScript dentro de `dist` |
| `npm start` | Ejecuta la versión compilada desde `dist/app.js` |

Para trabajar en desarrollo:

```bash
npm run dev
```

Para compilar y ejecutar la versión de producción:

```bash
npm run build
npm start
```

De manera predeterminada, el servidor queda disponible en `http://localhost:3000`.

## Endpoints

| Método | Ruta | Operación |
|---|---|---|
| `GET` | `/health` | Comprobar el estado del servidor |
| `GET` | `/api/v1/products/getAll` | Obtener todos los productos activos |
| `GET` | `/api/v1/products/getById/:id` | Obtener un producto activo por ID |
| `POST` | `/api/v1/products/create` | Crear un producto |
| `PUT` | `/api/v1/products/update/:id` | Actualizar completamente un producto activo |
| `DELETE` | `/api/v1/products/delete/:id` | Dar de baja lógicamente un producto activo |
| `PATCH` | `/api/v1/products/change-price/:id` | Cambiar únicamente el precio de un producto activo |

El parámetro `:id` debe ser un entero positivo.

## Cuerpos JSON

Todas las solicitudes que envían datos deben incluir el encabezado `Content-Type: application/json`.

### Crear un producto

Solicitud:

```http
POST /api/v1/products/create
```

Cuerpo completo:

```json
{
  "name": "Teclado mecánico",
  "price": 1299.90,
  "stock": 15,
  "description": "Teclado con interruptores mecánicos",
  "brand": "TechBoard",
  "img": "https://example.com/teclado.jpg"
}
```

`brand` e `img` pueden enviarse como `null` u omitirse. Los demás campos son obligatorios.

### Actualizar un producto

Solicitud:

```http
PUT /api/v1/products/update/:id
```

El cuerpo debe representar el producto completo:

```json
{
  "name": "Teclado mecánico actualizado",
  "price": 1399.50,
  "stock": 12,
  "description": "Teclado mecánico con iluminación",
  "brand": "TechBoard",
  "img": null
}
```

### Cambiar el precio

Solicitud:

```http
PATCH /api/v1/products/change-price/:id
```

El cuerpo debe contener únicamente el campo `price`:

```json
{
  "price": 1199.99
}
```

## Validaciones principales

- `name` debe ser texto no vacío con un máximo de 150 caracteres.
- `price` debe ser un número mayor que cero, con un máximo de dos decimales y no puede superar `99999999.99`.
- `stock` debe ser un entero mayor o igual que cero.
- `description` debe ser texto no vacío.
- `brand` es opcional y admite un máximo de 100 caracteres.
- `img` es opcional y admite un máximo de 500 caracteres.
- `POST` y `PUT` rechazan campos no definidos por el modelo.
- `PATCH` rechaza cualquier campo distinto de `price`.
- Los productos inactivos no se consultan ni se modifican.

## Respuestas HTTP

| Código | Uso |
|---:|---|
| `200` | Consulta, actualización, cambio de precio o baja lógica correctos |
| `201` | Producto creado correctamente |
| `400` | ID, cuerpo JSON o datos inválidos |
| `404` | Producto inexistente, inactivo o ruta no registrada |
| `500` | Error interno o error de conexión con MySQL |

Las respuestas de error utilizan una estructura JSON consistente:

```json
{
  "message": "Descripción del error."
}
```

La creación correcta devuelve el producto y su identificador generado:

```json
{
  "message": "Producto creado correctamente.",
  "product": {
    "id": 1,
    "name": "Teclado mecánico",
    "price": 1299.9,
    "stock": 15,
    "description": "Teclado con interruptores mecánicos",
    "brand": "TechBoard",
    "img": "https://example.com/teclado.jpg",
    "active": true
  }
}
```

## Baja lógica

El endpoint `DELETE` no elimina físicamente el registro. Ejecuta una actualización que establece `active = FALSE`. Desde ese momento el producto deja de aparecer en las consultas y no puede volver a modificarse mediante los endpoints disponibles.

## Pruebas

El archivo `http/products.http` contiene solicitudes listas para REST Client. La colección conserva el ID generado al crear un producto y lo reutiliza en las operaciones posteriores.

Orden recomendado:

1. Iniciar el servidor con `npm run dev` o `npm start`.
2. Ejecutar la comprobación de salud.
3. Crear un producto.
4. Consultar todos los productos.
5. Consultar el producto por ID.
6. Actualizar el producto completo.
7. Cambiar únicamente su precio.
8. Ejecutar las solicitudes con datos inválidos.
9. Dar de baja el producto.
10. Confirmar que ya no aparece en las consultas.

Cada solicitud indica el código HTTP esperado para facilitar la comprobación del resultado.

Las capturas de la ejecución se encuentran en `evidencias/thunder-client`. La carpeta `evidencias/mysql` muestra que el producto permanece almacenado y que la baja modifica únicamente el campo `active`.

## Estado del proyecto

La implementación, las validaciones, las pruebas HTTP, la compilación y la documentación están completas. El proyecto se encuentra publicado en GitHub y puede instalarse siguiendo las instrucciones de este archivo.

## Repositorio

El código fuente está disponible en:

`https://github.com/gaelgarca/My-Server-w-MySQL2`
