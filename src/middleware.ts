import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // You can add custom logic here if needed
    // For example, role-based access control
    const token = req.nextauth.token;

    // Optional: Add role-based redirection or access control
    if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => token !== null
    },
    pages: {
      signIn: "/auth/login"
    }
  }
);

export const config = { 
  matcher: [
    "/", 
    "/pacientes", 
    "/vacunas", 
    "/registro",
    "/perfil"
  ] 
};