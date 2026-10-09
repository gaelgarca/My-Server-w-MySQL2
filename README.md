# 🛒 My Server w MySQL2

API REST de productos construida con **Node.js**, **Express**, **TypeScript** y **MySQL2**.

La API permitirá consultar, crear y actualizar productos, cambiar únicamente su precio y realizar bajas lógicas sin eliminar registros físicamente de la base de datos.

---

## 🎯 Objetivo

Construir un servidor conectado a MySQL que exponga seis operaciones bajo el prefijo `/api/v1/products`:

- Consultar todos los productos activos.
- Consultar un producto activo por ID.
- Crear un producto.
- Actualizar completamente un producto.
- Dar de baja lógicamente un producto.
- Modificar exclusivamente el precio de un producto.

---

## 🗂️ Estructura del Proyecto

```text
My-Server-w-MySQL2/
├── .vscode/
│   └── settings.json                  # Oculta carpetas generadas en el explorador
│
├── database/
│   └── schema.sql                     # Creación de la base y tabla products
│
├── http/
│   ├── products.http                  # Colección reproducible de solicitudes
│   └── test-results.md                # Resultados de la verificación HTTP
│
├── src/
│   ├── conf/
│   │   └── dbConnection.ts            # Pool de conexiones con MySQL2
│   │
│   ├── controllers/
│   │   └── products.controller.ts     # Lógica de las operaciones de productos
│   │
│   ├── routes/
│   │   ├── index.ts                   # Agrupador de rutas
│   │   └── products.routes.ts         # Definición de endpoints de productos
│   │
│   ├── app.ts                         # Punto de entrada de la aplicación
│   └── server.ts                      # Configuración del servidor Express
│
├── .env.example                       # Variables de entorno requeridas
├── .gitignore                         # Archivos que no deben subirse al repositorio
├── package.json                       # Dependencias y comandos del proyecto
├── tsconfig.json                      # Configuración de TypeScript
└── README.md                          # Documentación general
```

---

## 🧩 Responsabilidad de Cada Carpeta

### `src/conf`

Contiene la configuración de infraestructura. `dbConnection.ts` crea y exporta el pool de conexiones de MySQL2.

### `src/controllers`

Contiene la lógica de cada operación de productos, sus validaciones, consultas parametrizadas y respuestas HTTP.

### `src/routes`

Define las URLs de la API y relaciona cada endpoint con su controlador correspondiente.

### `database`

Conserva el esquema SQL necesario para crear la base de datos y la tabla `products`.

### `http`

Agrupa las solicitudes utilizadas para probar y documentar el comportamiento de la API.

---

## 🌐 Endpoints

| Método | Ruta | Operación |
|---|---|---|
| `GET` | `/api/v1/products/getAll` | Obtener productos activos |
| `GET` | `/api/v1/products/getById/:id` | Obtener un producto activo |
| `POST` | `/api/v1/products/create` | Crear un producto |
| `PUT` | `/api/v1/products/update/:id` | Actualizar un producto completo |
| `DELETE` | `/api/v1/products/delete/:id` | Realizar una baja lógica |
| `PATCH` | `/api/v1/products/change-price/:id` | Cambiar únicamente el precio |

---

## ⚙️ Variables de Entorno

Copia `.env.example` como `.env` y completa las credenciales locales de MySQL:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=products_db
```

El archivo `.env` está excluido de Git para evitar publicar credenciales.

---

## 🚀 Comandos del Proyecto

Al descargar o clonar el proyecto por primera vez, instala las dependencias:

```bash
npm install
```

Después inicia el entorno de desarrollo:

```bash
npm run dev
```

Inicia el servidor TypeScript en desarrollo y recarga cuando cambia el código.

```bash
npm run build
npm start
```

Compila el proyecto dentro de `dist` y ejecuta la versión compilada.

```bash
npm run typecheck
```

Comprueba los tipos sin generar archivos.

---

## 📌 Estado del Proyecto

**Fase actual:** verificación técnica de producción completada.

Las dependencias están instaladas, TypeScript compila correctamente y la versión generada en `dist` inicia con `npm start`. Las operaciones fueron comprobadas con datos reales y los fallos de conexión producen respuestas JSON controladas.

---

## 🧭 Próximos Pasos

1. Terminar la documentación de cuerpos y respuestas.
2. Realizar la revisión final del repositorio publicado.
