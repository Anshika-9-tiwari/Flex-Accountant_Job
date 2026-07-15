// src/app/api/admin/users/route.ts

import { UserRole } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    if (authUser.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { message: "Only admin can view users." },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        isActive: true,
        createdAt: true,
        jobseekerProfile: true,
        employerProfile: {
          include: {
            company: true,
          },
        },
        applications: {
          select: {
            id: true,
          },
        },
        savedJobs: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin users fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching users." },
      { status: 500 }
    );
  }
}