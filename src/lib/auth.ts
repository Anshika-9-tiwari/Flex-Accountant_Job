// src/lib/auth.ts

import { UserRole } from "../generated/prisma/client";
import { jwtVerify, SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not set in .env");
  }

  return new TextEncoder().encode(secret);
}

export async function createAuthToken(user: AuthUser) {
  return new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());

    return {
      id: String(payload.id),
      name: String(payload.name),
      email: String(payload.email),
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getAuthUserFromRequest(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  return verifyAuthToken(token);
}

export function getDashboardPath(role: UserRole) {
  if (role === UserRole.JOBSEEKER) {
    return "/jobseeker/dashboard";
  }

  if (role === UserRole.EMPLOYER) {
    return "/employer/dashboard";
  }

  return "/admin/dashboard";
}