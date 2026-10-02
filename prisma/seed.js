const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Roles con los nombres exactos especificados en el comentario del schema
const rolesData = [
  {
    nombre: "JEFE_COMUNIDAD",
    descripcion:
      "administrador principal de la comunidad. registra jefes de calle y familias.",
  },
  {
    nombre: "JEFE_CALLE",
    descripcion:
      "responsable de supervisar y registrar las familias/personas de su calle asignada.",
  },
  {
    nombre: "HABITANTE",
    descripcion:
      "persona o integrante de una familia registrada en la comunidad.",
  },
];

async function main() {
  console.log("iniciando seed...");

  // 1. Crear / actualizar Roles
  const roles = {};
  for (const r of rolesData) {
    roles[r.nombre] = await prisma.role.upsert({
      where: { nombre: r.nombre },
      update: { descripcion: r.descripcion },
      create: r,
    });
  }

  // 2. Crear / actualizar Comuna
  const comuna = await prisma.comuna.upsert({
    where: { nombre: "zamora" },
    update: {
      codigo: "com-zamora-001",
      estado: "aragua",
      municipio: "zamora",
      parroquia: "villa de cura",
    },
    create: {
      nombre: "zamora",
      codigo: "com-zamora-001",
      estado: "aragua",
      municipio: "zamora",
      parroquia: "villa de cura",
    },
  });

  // 3. Crear / actualizar Calle
  const calle = await prisma.calle.upsert({
    where: {
      comunaId_nombre: { comunaId: comuna.id, nombre: "calle principal" },
    },
    update: { numero: 1, direccion: "calle principal zamora" },
    create: {
      nombre: "calle principal",
      numero: 1,
      direccion: "calle principal zamora",
      comuna: { connect: { id: comuna.id } },
    },
  });

  // 4. Crear Usuario Principal (JEFE_COMUNIDAD)
  const jefeComunidad = await prisma.usuario.upsert({
    where: { cedula: "21259230" },
    update: {
      nombre: "carlos",
      apellido: "peraza",
      correo: "carlosjperazab@gmail.com",
      token: "dvx0pwnjweaxjtr1",
      validado: true,
      genero: true,
      clave: "$2a$05$qv5dKCZmInzicTS5D0BFu.ThM5g99ScAkKKDjqKfQzMraQjhRnqgS",
      roles: { connect: { id: roles["JEFE_COMUNIDAD"].id } },
      comuna: { connect: { id: comuna.id } },
      calle: { connect: { id: calle.id } },
    },
    create: {
      cedula: "21259230",
      nombre: "carlos",
      apellido: "peraza",
      correo: "carlosjperazab@gmail.com",
      token: "dvx0pwnjweaxjtr1",
      validado: true,
      genero: true,
      clave: "$2a$05$qv5dKCZmInzicTS5D0BFu.ThM5g99ScAkKKDjqKfQzMraQjhRnqgS",
      roles: { connect: { id: roles["JEFE_COMUNIDAD"].id } },
      comuna: { connect: { id: comuna.id } },
      calle: { connect: { id: calle.id } },
    },
  });

  // 5. Crear Jefe de Calle (Registrado por el jefeComunidad)
  const jefeCalle = await prisma.usuario.upsert({
    where: { cedula: "27568441" },
    update: {
      nombre: "caslero",
      apellido: "barboza",
      correo: "caslerojperazab@gmail.com",
      token: "6kur603facbrux1n",
      validado: true,
      genero: true,
      clave: "$2a$05$029a1Dus7qStop21IuIKCOgGtrge/F6LvDwGgb9pnxz5/uqEQ3MU.",
      roles: { connect: { id: roles["JEFE_CALLE"].id } },
      creador: { connect: { id: jefeComunidad.id } },
      comuna: { connect: { id: comuna.id } },
      calle: { connect: { id: calle.id } },
    },
    create: {
      cedula: "27568441",
      nombre: "caslero",
      apellido: "barboza",
      correo: "27568441opsu@gmail.com",
      token: "6kur603facbrux1n",
      validado: true,
      genero: true,
      clave: "$2a$05$029a1Dus7qStop21IuIKCOgGtrge/F6LvDwGgb9pnxz5/uqEQ3MU.",
      roles: { connect: { id: roles["JEFE_CALLE"].id } },
      creador: { connect: { id: jefeComunidad.id } },
      comuna: { connect: { id: comuna.id } },
      calle: { connect: { id: calle.id } },
    },
  });

  // 6. Crear Familia asociada a la Calle
  const familia = await prisma.familia.upsert({
    where: { codigo: "fam-001" },
    update: {
      nombre: "familia perez",
      direccion: "casa nro 12, calle principal",
      numero: 12,
      discapacidad: false,
      detallesDiscapacidad: "sin discapacidad",
      servicioAgua: true,
      electricidad: true,
      calle: { connect: { id: calle.id } },
    },
    create: {
      nombre: "familia perez",
      codigo: "fam-001",
      direccion: "casa nro 12, calle principal",
      numero: 12,
      discapacidad: false,
      detallesDiscapacidad: "sin discapacidad",
      servicioAgua: true,
      electricidad: true,
      calle: { connect: { id: calle.id } },
    },
  });

  // 7. Crear Habitante (con token String no nulo y único exigido por el schema)
  await prisma.usuario.upsert({
    where: { cedula: "30123456" },
    update: {
      nombre: "ana",
      apellido: "perez",
      correo: null,
      clave: null,
      token: "6kur603facbrux4s",
      validado: false,
      genero: false,
      roles: { connect: { id: roles["HABITANTE"].id } },
      creador: { connect: { id: jefeCalle.id } },
      comuna: { connect: { id: comuna.id } },
      calle: { connect: { id: calle.id } },
      familia: { connect: { id: familia.id } },
    },
    create: {
      cedula: "30123456",
      nombre: "ana",
      apellido: "perez",
      correo: null,
      clave: null,
      token: "6kur603facbrux4s",
      validado: false,
      genero: false,
      roles: { connect: { id: roles["HABITANTE"].id } },
      creador: { connect: { id: jefeCalle.id } },
      comuna: { connect: { id: comuna.id } },
      calle: { connect: { id: calle.id } },
      familia: { connect: { id: familia.id } },
    },
  });
}

main()
  .then(() => {
    console.log("seed ejecutado correctamente");
  })
  .catch((error) => {
    console.error("error al ejecutar el seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
