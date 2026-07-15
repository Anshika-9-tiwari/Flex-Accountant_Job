// src/app/api/admin/employers/route.ts

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
        { message: "Only admin can view employers." },
        { status: 403 }
      );
    }

    const employers = await prisma.employerProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            isActive: true,
            createdAt: true,
          },
        },
        company: {
          include: {
            jobs: {
              include: {
                applications: {
                  select: {
                    id: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ employers });
  } catch (error) {
    console.error("Admin employers fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching employers." },
      { status: 500 }
    );
  }
}