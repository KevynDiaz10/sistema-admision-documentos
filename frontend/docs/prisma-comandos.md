# ------------------------------------------------------------------
# 1. SINCRONIZACIÓN Y DESARROLLO (Modificaciones locales)
# ------------------------------------------------------------------

# Trae cambios hechos directamente en la DB hacia schema.prisma
npx prisma db pull

# Actualiza el cliente TypeScript según schema.prisma
npx prisma generate

# Crea y aplica una nueva migración según tus cambios en schema.prisma
npx prisma migrate dev


# ------------------------------------------------------------------
# 2. DESPLIEGUE Y POBLADO DE DATOS
# ------------------------------------------------------------------

# Aplica migraciones pendientes en servidores o producción
npx prisma migrate deploy

# Aplica cambios de schema a la DB sin crear archivos de migración
npx prisma db push

# Ejecuta el script de datos iniciales o de prueba
npx prisma db seed


# ------------------------------------------------------------------
# 3. HERRAMIENTAS E INSPECCIÓN
# ------------------------------------------------------------------

# Abre la interfaz visual web para gestionar la DB (localhost:5555)
npx prisma studio

# Revisa la sintaxis del archivo schema.prisma
npx prisma validate

# Formatea automáticamente el archivo schema.prisma
npx prisma format