# Task API

API REST para gestión de tareas construida con Node.js, Express, Prisma y Supabase (PostgreSQL).

## Tecnologías

- Node.js + TypeScript
- Express 5
- Prisma ORM 7
- Supabase (PostgreSQL)
- express-validator

## Requisitos

- Node.js 18+
- Cuenta y proyecto en [Supabase](https://supabase.com)

## Instalación

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repo>
cd todo-backend
npm install
```

### 2. Variables de entorno

Copia `.env.example` a `.env` y completa con tus credenciales de Supabase:

```bash
cp .env.example .env
```

```env
PORT=3000

# Transaction Pooler (puerto 6543) - para queries normales
DATABASE_URL="postgresql://usuario:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection (puerto 5432) - para migraciones
DIRECT_URL="postgresql://usuario:password@aws-0-region.pooler.supabase.com:5432/postgres"
```

Las URLs las encuentras en Supabase: **Settings → Database → Connection string**.

### 3. Crear tablas en Supabase

```bash
npx prisma db push
```

### 4. Generar cliente Prisma

```bash
npx prisma generate
```

### 5. Levantar el servidor

```bash
npm run dev
```

Servidor disponible en `http://localhost:3000`.

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/tasks` | Obtener todas las tareas |
| GET | `/api/tasks/:id` | Obtener tarea por ID |
| POST | `/api/tasks` | Crear tarea |
| PUT | `/api/tasks/:id` | Actualizar tarea |
| DELETE | `/api/tasks/:id` | Eliminar tarea |

## Modelo Task

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int | ID autoincremental |
| title | String | Título (requerido) |
| description | String? | Descripción opcional |
| completed | Boolean | Estado completado (default: false) |
| priority | String | Prioridad: low, medium, high (default: medium) |
| status | String | Estado: pending, in-progress, done (default: pending) |
| dueDate | DateTime? | Fecha límite opcional |
| category | String? | Categoría opcional |
| order | Int | Orden (default: 0) |
| createdAt | DateTime | Fecha de creación |
| updatedAt | DateTime | Fecha de última actualización |

## Scripts

```bash
npm run dev    # Servidor en modo desarrollo con hot-reload
npm start      # Servidor en producción
```
