#Architecture Decision Record (ADR)
##is a short, text-based document that captures a significant architectural decision, its context, and its consequences during a software project

#ADR 001: NextAuth.js para la autentificación
estado: 
##Contexto
El sistema requiere un mecanismo robusto para gestionar la identidad de los usuarios, proteger rutas específicas y asegurar que cada usuario solo pueda acceder y registrarse. Necesitamos una solución que se integre nativamente con el ecosistema de Next.js (App Router) y que soporte:

Diferenciar entre Admin, User, etc.

Middleware: Bloqueo de rutas a nivel de servidor.


##Decisión
Utilizaremos NextAuth.js (v5/Auth.js) como proveedor central de autenticación debido a su integración profunda con el Middleware de Next.js y su capacidad para extender el objeto de sesión.

1. Gestión de Roles
Extenderemos el esquema de la base de datos y la sesión de NextAuth para incluir un campo role.

Implementación: Se usará el callback jwt y session para inyectar el rol del usuario en el cliente y servidor.

2. Protección vía Middleware
Se implementará un archivo middleware.ts en la raíz para interceptar peticiones.

Lógica: Si el usuario no tiene sesión o no cumple con el rol requerido para rutas específicas (ej. /admin), se redirigirá automáticamente al steps.

Seguridad: En las Server Actions o API Routes, nunca confiaremos en un ID enviado desde el cuerpo del cliente. El userId se obtendrá directamente de auth() en el servidor antes de realizar cualquier operación de base de datos.

##Consecuencias
Positivas
Seguridad Centralizada: El Middleware reduce el riesgo de olvidar proteger una página individualmente.

Experiencia de Usuario: Manejo nativo de sesiones y redirecciones rápidas.

Escalabilidad: El modelo de roles permite añadir permisos más complejos en el futuro sin cambiar la base del sistema.