-- CreateTable
CREATE TABLE "role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cedula" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nombre_dos" TEXT DEFAULT '',
    "apellido" TEXT,
    "apellido_dos" TEXT DEFAULT '',
    "f_n" DATETIME,
    "genero" BOOLEAN NOT NULL,
    "telefono" TEXT,
    "correo" TEXT,
    "clave" TEXT,
    "token" TEXT NOT NULL,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "validado" BOOLEAN NOT NULL DEFAULT false,
    "rolId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "comunaId" INTEGER NOT NULL,
    "calleId" INTEGER,
    "familiaId" INTEGER,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "usuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "usuario_comunaId_fkey" FOREIGN KEY ("comunaId") REFERENCES "comuna" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "usuario_calleId_fkey" FOREIGN KEY ("calleId") REFERENCES "calle" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "usuario_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "familia" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comuna" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT,
    "estado" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "parroquia" TEXT NOT NULL,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "calle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "numero" INTEGER,
    "direccion" TEXT,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "comunaId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "calle_comunaId_fkey" FOREIGN KEY ("comunaId") REFERENCES "comuna" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "familia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "tipoVivienda" TEXT,
    "numero" INTEGER NOT NULL,
    "discapacidad" BOOLEAN NOT NULL DEFAULT false,
    "detallesDiscapacidad" TEXT,
    "servicioAgua" BOOLEAN NOT NULL DEFAULT false,
    "electricidad" BOOLEAN NOT NULL DEFAULT false,
    "observacion" TEXT,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "calleId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "familia_calleId_fkey" FOREIGN KEY ("calleId") REFERENCES "calle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "imagen" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "nombreOriginal" TEXT NOT NULL,
    "nombreSistema" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "formato" TEXT NOT NULL,
    "peso" INTEGER NOT NULL,
    "perfil" BOOLEAN NOT NULL DEFAULT true,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "imagen_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inviteToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "expireAt" DATETIME NOT NULL,
    "usadoAt" DATETIME,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "usuarioInvitaId" INTEGER NOT NULL,
    "usuarioAceptaId" INTEGER,
    "rolId" INTEGER NOT NULL,
    "comunaId" INTEGER,
    "calleId" INTEGER,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inviteToken_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inviteToken_usuarioInvitaId_fkey" FOREIGN KEY ("usuarioInvitaId") REFERENCES "usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "inviteToken_usuarioAceptaId_fkey" FOREIGN KEY ("usuarioAceptaId") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "inviteToken_comunaId_fkey" FOREIGN KEY ("comunaId") REFERENCES "comuna" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "inviteToken_calleId_fkey" FOREIGN KEY ("calleId") REFERENCES "calle" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tabla" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "ip" TEXT DEFAULT '',
    "descripcion" TEXT DEFAULT '',
    "datosAntes" JSONB,
    "datosDespues" JSONB,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "id_objeto" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "role_nombre_key" ON "role"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_cedula_key" ON "usuario"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_token_key" ON "usuario"("token");

-- CreateIndex
CREATE INDEX "usuario_rolId_idx" ON "usuario"("rolId");

-- CreateIndex
CREATE INDEX "usuario_comunaId_idx" ON "usuario"("comunaId");

-- CreateIndex
CREATE INDEX "usuario_calleId_idx" ON "usuario"("calleId");

-- CreateIndex
CREATE INDEX "usuario_familiaId_idx" ON "usuario"("familiaId");

-- CreateIndex
CREATE UNIQUE INDEX "comuna_nombre_key" ON "comuna"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "comuna_codigo_key" ON "comuna"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "calle_comunaId_nombre_key" ON "calle"("comunaId", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "familia_codigo_key" ON "familia"("codigo");

-- CreateIndex
CREATE INDEX "familia_calleId_idx" ON "familia"("calleId");

-- CreateIndex
CREATE UNIQUE INDEX "inviteToken_token_key" ON "inviteToken"("token");

-- CreateIndex
CREATE INDEX "inviteToken_correo_idx" ON "inviteToken"("correo");

-- CreateIndex
CREATE INDEX "inviteToken_expireAt_idx" ON "inviteToken"("expireAt");
