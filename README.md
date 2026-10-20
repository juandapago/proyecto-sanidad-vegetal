# API Sanidad Vegetal

API REST para el cliente **Breaze in the Moon** que gestiona plantas, patógenos, enfermedades, tratamientos, susceptibilidades, cultivos y brotes, con endpoints compuestos y estadísticas de brotes. Está hecha con NestJS, TypeORM y MySQL, y se documenta con Swagger.

## Integrantes

| Integrante | 
|---|
| Jhonatan Tamayo |
| Karol Viviana Castano Usma |
| Juan David Patiño |

## Tecnologías

- NestJS 12 (TypeScript, módulos ESM)
- TypeORM con MySQL
- Swagger (`@nestjs/swagger`)
- pnpm como gestor de paquetes
- Bruno para probar los endpoints

## Estructura del proyecto

```
src/
├── main.ts                 # Arranque y configuración de Swagger
├── app.module.ts
└── modules/
    ├── pathogens/
    ├── diseases/
    ├── treatments/
    ├── plants/
    ├── susceptibilities/
    ├── crops/
    ├── outbreaks/
    ├── statistics/
    └── shared/infrastructure/mysql/
bruno/                      # Colección de pruebas
database/seed.sql           # Datos de ejemplo
scripts/seed.mjs            # Comando pnpm seed
```

## Requisitos

- Node.js 22 o superior
- pnpm (`npm install -g pnpm`)
- MySQL 8
- Bruno, para ejecutar la colección de pruebas

## Instalación

```bash
git clone https://github.com/juandapago/proyecto-sanidad-vegetal.git
cd proyecto-sanidad-vegetal
pnpm install
```

## Configuración

1. Crear la base de datos y un usuario para la API (en MySQL Workbench o en la consola de MySQL):

   ```sql
   CREATE DATABASE sanidad_vegetal;
   CREATE USER 'sanidad'@'localhost' IDENTIFIED BY 'sanidad123';
   GRANT ALL PRIVILEGES ON sanidad_vegetal.* TO 'sanidad'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. Copiar `.env.example` como `.env` y completar los valores:

   | Variable | Descripción | Ejemplo |
   |---|---|---|
   | `PORT` | Puerto de la API | `3000` |
   | `DB_HOST` | Servidor de MySQL | `localhost` |
   | `DB_PORT` | Puerto de MySQL | `3306` |
   | `DB_USERNAME` | Usuario de la base de datos | `sanidad` |
   | `DB_PASSWORD` | Contraseña del usuario | `sanidad123` |
   | `DB_NAME` | Nombre de la base de datos | `sanidad_vegetal` |
   | `DB_SYNCHRONIZE` | `true` para que TypeORM cree las tablas en desarrollo | `true` |

   El archivo `.env` no se sube al repositorio.

## Ejecución

```bash
pnpm start:dev
```

- API: `http://localhost:3000`
- Documentación Swagger: `http://localhost:3000/docs`

## Datos de ejemplo

Con la API iniciada al menos una vez (para que se creen las tablas), en otra terminal:

```bash
pnpm seed
```

Borra el contenido de todas las tablas y carga datos realistas: 8 patógenos, 8 enfermedades, 16 tratamientos, 6 plantas, 12 susceptibilidades, 8 cultivos y 30 brotes. Se puede ejecutar las veces que se necesite.

## Pruebas con Bruno

1. Con la API corriendo, abrir en Bruno la carpeta `bruno/` (**Open Collection**).
2. Seleccionar el entorno **local** (`baseUrl = http://localhost:3000`).
3. Clic derecho sobre la colección → **Run** → **Run Collection**.

La colección está organizada por recurso e incluye casos exitosos y un caso por cada restricción del cliente. Cada carpeta crea sus propios datos de prueba y los elimina al final, así que se puede ejecutar con o sin los datos de ejemplo cargados.

## Endpoints

| Recurso | Endpoints |
|---|---|
| Patógenos | `GET/POST /pathogens`, `GET/PATCH/DELETE /pathogens/:id` |
| Enfermedades | `GET/POST /diseases`, `GET/PATCH/DELETE /diseases/:id` |
| Tratamientos | `GET/POST /treatments`, `GET/PATCH/DELETE /treatments/:id` |
| Plantas | `GET/POST /plants`, `GET/PATCH/DELETE /plants/:id` |
| Susceptibilidades | `GET/POST /susceptibilities`, `GET/PATCH/DELETE /susceptibilities/:id` |
| Cultivos | `GET/POST /crops`, `GET/PATCH/DELETE /crops/:id` |
| Brotes | `GET/POST /outbreaks`, `GET/PATCH/DELETE /outbreaks/:id` |
| Verificación de mutaciones | `GET /crops/:id/mutations` |
| Endpoints compuestos | `GET /pathogens/:id/diseases`, `GET /diseases/:id/details`, `GET /plants/:id/diseases`, `GET /crops/:id/risk`, `GET /outbreaks/:id/details` |
| Estadísticas | `GET /statistics/outbreaks/by-disease`, `by-plant`, `by-pathogen`, `by-region`, `by-month`, `summary` |

Los listados aceptan filtros por query params; el detalle de cada filtro y de cada respuesta posible está en Swagger.
