# ------------------------------------------------------------------
# 1. ERRORES COMUNES DE PRISMA
# ------------------------------------------------------------------
# Para ejecutar un  comando de prisma hay que desactivar o comentar esta linea "url      = env("DATABASE_URL")" para que no de error  
# al agregar una peticion 
Error: "Cannot read properties of undefined (reading 'create')"
Descripción
Este error ocurre cuando Prisma no reconoce un modelo en el cliente generado.

Causas y Soluciones
# Causa 1: Modelo no existe en el schema
Síntoma: El modelo fue agregado recientemente pero no se regeneró el cliente.

Solución:
# Regenerar el cliente de Prisma
npx prisma generate

# Si el modelo es nuevo, también necesitas sincronizar la base de datos
npx prisma db push

# Causa 2: El servidor de desarrollo no se reinició
Síntoma: Después de regenerar el cliente, el error persiste.

Solución: Reiniciar el servidor de desarrollo es OBLIGATORIO porque Next.js cachea los módulos.

