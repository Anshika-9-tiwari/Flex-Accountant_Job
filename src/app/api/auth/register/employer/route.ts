// src/app/api/auth/register/employer/route.ts

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

    const companyName = String(
      body.companyName || body.company || body.company_name || ""
    ).trim();

    const designation = body.designation
      ? String(body.designation).trim()
      : null;

    const industry = body.industry ? String(body.industry).trim() : null;
    const website = body.website ? String(body.website).trim() : null;
    const location = body.location ? String(body.location).trim() : null;

    if (!name || !email || !password || !companyName) {
      return NextResponse.json(
        {
          message:
            "Name, email, password, and company name are required.",
        },
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
        { message: "An account with this email already exists. Please login instead." },
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
        role: UserRole.EMPLOYER,
        employerProfile: {
          create: {
            designation,
            company: {
              create: {
                name: companyName,
                industry,
                website,
                location,
              },
            },
          },
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
        message: "Employer account created successfully.",
        user,
        redirectTo: "/employer/dashboard",
      },
      { status: 201 }
    );

    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("Employer register error:", error);

    return NextResponse.json(
      { message: "Something went wrong while creating employer account." },
      { status: 500 }
    );
  }
}