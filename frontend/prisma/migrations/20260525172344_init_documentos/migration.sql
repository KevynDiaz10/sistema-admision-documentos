-- CreateTable
CREATE TABLE `documentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` VARCHAR(191) NOT NULL,
    `tipo_documento` ENUM('foto_carnet', 'cedula', 'titulo', 'fondo_negro', 'notas_certificadas') NOT NULL,
    `estado` ENUM('sin_consignar', 'entregado', 'aprobado', 'rechazado') NOT NULL DEFAULT 'sin_consignar',
    `ruta_archivo` VARCHAR(500) NULL,
    `extension` ENUM('pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx') NULL,
    `peso_bytes` INTEGER NULL,
    `nombre_original` VARCHAR(200) NULL,
    `fecha_subida` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE INDEX `documentos_usuario_id_tipo_documento_key`(`usuario_id`, `tipo_documento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `documentos` ADD CONSTRAINT `documentos_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
