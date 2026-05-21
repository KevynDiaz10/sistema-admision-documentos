// proxy.ts
export { default as proxy } from "next-auth/middleware";

export const config = {
  // Ajusta el matcher a las rutas que quieras proteger
  matcher: ["/dashboard/:path*"],
};