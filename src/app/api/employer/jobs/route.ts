// src/app/api/employer/jobs/route.ts

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

    if (authUser.role !== UserRole.EMPLOYER) {
      return NextResponse.json(
        { message: "Only employers can view employer jobs." },
        { status: 403 }
      );
    }

    const employerProfile = await prisma.employerProfile.findUnique({
      where: {
        userId: authUser.id,
      },
      include: {
        company: {
          include: {
            jobs: {
              include: {
                applications: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    });

    if (!employerProfile?.company) {
      return NextResponse.json({ jobs: [] });
    }

    return NextResponse.json({
      jobs: employerProfile.company.jobs,
    });
  } catch (error) {
    console.error("Employer jobs fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching employer jobs." },
      { status: 500 }
    );
  }
}