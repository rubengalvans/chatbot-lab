import NextAuth from "next-auth";
import { authConfig } from "@/app/(auth)/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;
  const isOnLoginPage = nextUrl.pathname.startsWith("/login");
  const isOnRegisterPage = nextUrl.pathname.startsWith("/register");
  const isApiRoute = nextUrl.pathname.startsWith("/api");

  // Permitir rutas públicas
  if (isOnLoginPage || isOnRegisterPage || isApiRoute) {
    return;
  }

  // Si no hay sesión → redirigir a login
  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // Si es guest → redirigir a login para que se registre con email
  if (session?.user?.type === "guest") {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
