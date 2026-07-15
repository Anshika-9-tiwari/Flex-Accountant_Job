// src/app/api/auth/register/jobseeker/route.ts

import bcrypt from "bcryptjs";
import { UserRole } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { createAuthToken, setAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || body.fullName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const phone = body.phone ? String(body.phone).trim() : null;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: UserRole.JOBSEEKER,
        jobseekerProfile: {
          create: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    const token = await createAuthToken(user);

    const response = NextResponse.json(
      {
        message: "Jobseeker account created successfully.",
        user,
        redirectTo: "/jobseeker/dashboard",
      },
      { status: 201 }
    );

    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("Jobseeker register error:", error);

    return NextResponse.json(
      { message: "Something went wrong while creating account." },
      { status: 500 }
    );
  }
}