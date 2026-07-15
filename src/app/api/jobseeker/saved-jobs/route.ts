// src/app/api/jobseeker/saved-jobs/route.ts

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
        { message: "Only jobseekers can view saved jobs." },
        { status: 403 }
      );
    }

    const savedJobs = await prisma.savedJob.findMany({
      where: {
        userId: authUser.id,
      },
      include: {
        job: {
          include: {
            company: true,
            applications: {
              where: {
                userId: authUser.id,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ savedJobs });
  } catch (error) {
    console.error("Saved jobs fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching saved jobs." },
      { status: 500 }
    );
  }
}