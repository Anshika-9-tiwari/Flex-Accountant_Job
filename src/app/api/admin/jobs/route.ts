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
        { message: "Only admin can view jobs." },
        { status: 403 }
      );
    }

    const jobs = await prisma.job.findMany({
      include: {
        company: true,
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

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Admin jobs fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching jobs." },
      { status: 500 }
    );
  }
}