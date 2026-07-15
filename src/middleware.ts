// src/middleware.ts

import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  return new TextEncoder().encode(secret);
}

function getDashboardPath(role: string) {
  if (role === "JOBSEEKER") {
    return "/jobseeker/dashboard";
  }

  if (role === "EMPLOYER") {
    return "/employer/dashboard";
  }

  if (role === "ADMIN") {
    return "/admin/dashboard";
  }

  return "/login";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    "/login",
    "/jobseeker/register",
    "/employer/register",
  ];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const isProtectedRoute =
    pathname.startsWith("/jobseeker") ||
    pathname.startsWith("/employer") ||
    pathname.startsWith("/admin");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const requiredRole = pathname.startsWith("/jobseeker")
    ? "JOBSEEKER"
    : pathname.startsWith("/employer")
    ? "EMPLOYER"
    : "ADMIN";

  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const userRole = String(payload.role);

    if (userRole !== requiredRole) {
      return NextResponse.redirect(
        new URL(getDashboardPath(userRole), request.url)
      );
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/jobseeker/:path*", "/employer/:path*", "/admin/:path*"],
};