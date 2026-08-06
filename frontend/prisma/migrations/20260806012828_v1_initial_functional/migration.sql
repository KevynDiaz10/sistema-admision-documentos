/*
  Warnings:

  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `documentos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verificationtoken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `documentos` DROP FOREIGN KEY `documentos_usuario_id_fkey`;

-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `Session_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` VARCHAR(50) NULL;

-- DropTable
DROP TABLE `account`;

-- DropTable
DROP TABLE `documentos`;

-- DropTable
DROP TABLE `session`;

-- DropTable
DROP TABLE `verificationtoken`;

-- CreateTable
CREATE TABLE `perfil_documentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `perfil_id` INTEGER NOT NULL,
    `tipo` VARCHAR(40) NOT NULL,
    `nombre_archivo` VARCHAR(255) NOT NULL,
    `mime_type` VARCHAR(120) NOT NULL,
    `tamano` INTEGER NOT NULL,
    `contenido` LONGBLOB NOT NULL,
    `creado_en` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_perfil`(`perfil_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombres` VARCHAR(120) NOT NULL,
    `apellidos` VARCHAR(120) NOT NULL,
    `cedula` VARCHAR(40) NOT NULL,
    `correo` VARCHAR(160) NOT NULL,
    `telefono` VARCHAR(40) NOT NULL,
    `fecha_nacimiento` VARCHAR(20) NULL,
    `genero` VARCHAR(40) NULL,
    `direccion` VARCHAR(255) NOT NULL,
    `carrera` VARCHAR(160) NOT NULL,
    `semestre` VARCHAR(10) NULL,
    `creado_en` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id_user` VARCHAR(191) NULL,

    INDEX `FK_perfiles_user`(`id_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitudes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_perfil` INTEGER NULL,
    `carrera` VARCHAR(50) NULL,
    `comentarios` TEXT NULL,
    `estatus` ENUM('aprobado', 'rechazado', 'pendiente') NULL DEFAULT 'pendiente',
    `fecha_actualizacion` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_creacion` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_perfil`(`id_perfil`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `perfil_documentos` ADD CONSTRAINT `fk_perfil` FOREIGN KEY (`perfil_id`) REFERENCES `perfiles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `perfiles` ADD CONSTRAINT `FK_perfiles_user` FOREIGN KEY (`id_user`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitudes` ADD CONSTRAINT `solicitudes_ibfk_1` FOREIGN KEY (`id_perfil`) REFERENCES `perfiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
