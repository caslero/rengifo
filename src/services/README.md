# Servicios

Coloca aqui la logica de negocio, por ejemplo autenticacion, invitaciones,
administracion del censo y consultas de reportes. Los Route Handlers de
`src/app/api` deben validar con Zod, invocar estos servicios y responder con
`src/lib/api-response.js`.