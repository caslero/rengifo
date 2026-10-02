# Gestion Comunal Zamora

Base de sistema de gestion comunal y censo poblacional para Zamora, Aragua.
El proyecto usa Next.js App Router, JavaScript, Tailwind CSS, Prisma 6.5 y
SQLite para desarrollo local.

## Inicio local

1. Copia `.env.example` a `.env` y define un `JWT_SECRET` aleatorio de al menos
   32 caracteres. Configura tambien las credenciales SMTP antes de enviar correos.
2. Instala dependencias con `npm install`.
3. Genera Prisma Client con `npm run db:generate`.
4. Crea/actualiza la base local con `npm run db:push`.
5. Inicia el servidor con `npm run dev`.

La aplicacion queda disponible en `http://localhost:3000`.

## Estructura

- `src/app/`: paginas, layouts y futuros Route Handlers de App Router.
- `src/components/`: componentes reutilizables de interfaz.
- `src/lib/`: Prisma, autenticacion, correo, respuestas API y esquemas Zod.
- `src/services/`: reglas de negocio y operaciones de censo/invitaciones/reportes.
- `src/middleware.js`: control inicial de acceso por rol.
- `prisma/`: esquema y migraciones de base de datos.
- `public/`: recursos publicos y futuro service worker.

## Base de datos

SQLite es el proveedor inicial. Para PostgreSQL, cambia `provider` en
`prisma/schema.prisma` a `postgresql`, configura `DATABASE_URL` y crea una
migracion nueva. Roles y parentescos se guardan como texto para mantener
compatibilidad con SQLite y se restringen en los esquemas Zod.

## Seguridad y siguientes pasos

Las rutas bajo `/dashboard` y `/api/{admin,comunidad,calle}` tienen una primera
capa de rol en `src/middleware.js`; verifica tambien el usuario activo, el alcance
comunal/calle y los permisos dentro de cada servicio antes de leer o modificar
datos. El valor de `tokenHash` de invitaciones debe ser un hash del token
aleatorio enviado por correo, nunca el token original.

La carpeta `public/`, el manifiesto de `src/app/manifest.js` y `pdfkit` dejan el
proyecto listo para completar PWA y reportes PDF. Esta base no incluye todavia
flujos de login, aceptacion de invitacion, CRUD ni generacion de informes.