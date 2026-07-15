// src/app/api/jobseeker/applications/route.ts

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

    if (authUser.role !== UserRole.JOBSEEKER) {
      return NextResponse.json(
        { message: "Only jobseekers can view applications." },
        { status: 403 }
      );
    }

    const applications = await prisma.application.findMany({
      where: {
        userId: authUser.id,
      },
      include: {
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
    console.error("Jobseeker applications fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching applications." },
      { status: 500 }
    );
  }
}