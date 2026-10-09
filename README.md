# My Server w MySQL2

Servidor REST para administrar productos. Está hecho con Node.js, Express, TypeScript y MySQL2.

El proyecto permite crear productos, consultarlos, actualizar sus datos, cambiar su precio y darlos de baja sin borrar el registro de MySQL.

## Requisitos

- Node.js 20 o posterior
- npm
- MySQL Server 8 o posterior
- Una base de datos local accesible desde el proyecto

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/gaelgarca/My-Server-w-MySQL2.git
cd My-Server-w-MySQL2
```

Instalar las dependencias:

```bash
npm install
```

## Base de datos

El archivo `database/schema.sql` crea la base `products_db` y la tabla `products`.

Para prepararla:

1. Abrir MySQL Workbench.
2. Abrir `database/schema.sql`.
3. Ejecutar todo el archivo.
4. Confirmar que aparezca la tabla `products` dentro de `products_db`.

La tabla tiene los siguientes campos:

| Campo | Tipo | Uso |
|---|---|---|
| `id` | `INT UNSIGNED` | Identificador autoincremental |
| `name` | `VARCHAR(150)` | Nombre del producto |
| `price` | `DECIMAL(10,2)` | Precio |
| `stock` | `INT` | Existencias |
| `description` | `TEXT` | Descripción |
| `brand` | `VARCHAR(100)` | Marca opcional |
| `img` | `VARCHAR(500)` | Imagen opcional |
| `active` | `BOOLEAN` | Estado del producto |

## Variables de entorno

Crear `.env` a partir de `.env.example` y completar las credenciales de MySQL:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contrasena
DB_NAME=products_db
```

El archivo `.env` no se incluye en Git.

## Ejecución

Modo de desarrollo:

```bash
npm run dev
```

Compilar y ejecutar la versión generada:

```bash
npm run build
npm start
```

Revisar los tipos sin generar archivos:

```bash
npm run typecheck
```

El servidor utiliza `http://localhost:3000` si no se cambia el puerto en `.env`.

## Rutas

| Método | Ruta | Acción |
|---|---|---|
| `GET` | `/health` | Revisar que el servidor esté activo |
| `GET` | `/api/v1/products/getAll` | Consultar productos activos |
| `GET` | `/api/v1/products/getById/:id` | Consultar un producto por ID |
| `POST` | `/api/v1/products/create` | Crear un producto |
| `PUT` | `/api/v1/products/update/:id` | Actualizar un producto completo |
| `PATCH` | `/api/v1/products/change-price/:id` | Cambiar solamente el precio |
| `DELETE` | `/api/v1/products/delete/:id` | Dar de baja un producto |

## Crear un producto

```http
POST /api/v1/products/create
Content-Type: application/json
```

```json
{
  "name": "Mouse inalámbrico",
  "price": 499.90,
  "stock": 25,
  "description": "Mouse inalámbrico con receptor USB",
  "brand": "Logitech",
  "img": null
}
```

`name`, `price`, `stock` y `description` son obligatorios. `brand` e `img` pueden enviarse como `null`.

## Actualizar un producto

`PUT` recibe nuevamente todos los campos del producto:

```json
{
  "name": "Mouse inalámbrico actualizado",
  "price": 549.90,
  "stock": 20,
  "description": "Mouse actualizado mediante una solicitud PUT",
  "brand": "Logitech",
  "img": null
}
```

`PATCH` recibe solamente el precio:

```json
{
  "price": 449.90
}
```

## Baja lógica

La ruta `DELETE` no elimina la fila de MySQL. Cambia el campo `active` a `false`.

Los productos inactivos permanecen guardados, pero ya no aparecen en `getAll` y tampoco pueden consultarse por ID.

## Pruebas

Las solicitudes para REST Client están en `http/products.http`. También pueden ejecutarse manualmente desde Thunder Client.

Las capturas se encuentran en:

- `evidencias/thunder-client`
- `evidencias/mysql`

## Estructura principal

```text
database/
evidencias/
http/
src/
  conf/
  controllers/
  routes/
.env.example
package.json
tsconfig.json
```
