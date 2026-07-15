// src/app/api/employer/applicants/route.ts

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
        { message: "Only employers can view applicants." },
        { status: 403 }
      );
    }

    const employerProfile = await prisma.employerProfile.findUnique({
      where: {
        userId: authUser.id,
      },
      select: {
        companyId: true,
      },
    });

    if (!employerProfile?.companyId) {
      return NextResponse.json({ applications: [] });
    }

    const applications = await prisma.application.findMany({
      where: {
        job: {
          companyId: employerProfile.companyId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            jobseekerProfile: true,
          },
        },
        job: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Employer applicants fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching applicants." },
      { status: 500 }
    );
  }
}