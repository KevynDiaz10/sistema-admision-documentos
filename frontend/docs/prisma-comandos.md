# ------------------------------------------------------------------
# 1. SINCRONIZACIÓN Y DESARROLLO (Modificaciones locales)
# ------------------------------------------------------------------

# Trae cambios hechos directamente en la DB hacia schema.prisma
npx prisma db pull

# Actualiza el cliente TypeScript según schema.prisma
npx prisma generate

# Crea y aplica una nueva migración según tus cambios en schema.prisma
npx prisma migrate dev

# Este comando eliminará la base de datos local previa, creará una nueva limpia basada exactamente en tu schema.prisma actual y creará un único folder de migración inicial en prisma/migrations/.
npx prisma migrate dev --name init


# ------------------------------------------------------------------
# 2. DESPLIEGUE Y POBLADO DE DATOS
# ------------------------------------------------------------------

# Aplica migraciones pendientes en servidores o producción: Prisma va leyendo las carpetas en orden cronológico (de la más vieja a la más nueva) y ejecuta cada archivo SQL uno por uno. Al terminar, la base de datos queda exactamente igual a la tuya.
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