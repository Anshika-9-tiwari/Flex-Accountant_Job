// src/app/api/admin/approvals/route.ts

import { JobStatus, UserRole } from "@/generated/prisma/client";
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
        { message: "Only admin can view approvals." },
        { status: 403 }
      );
    }

    const [pendingJobs, pendingEmployers] = await prisma.$transaction([
      prisma.job.findMany({
        where: {
          status: JobStatus.PENDING,
        },
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
      }),

      prisma.employerProfile.findMany({
        where: {
          isVerified: false,
        },
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
                select: {
                  id: true,
                  status: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return NextResponse.json({
      pendingJobs,
      pendingEmployers,
      stats: {
        pendingJobs: pendingJobs.length,
        pendingEmployers: pendingEmployers.length,
        totalPendingApprovals: pendingJobs.length + pendingEmployers.length,
      },
    });
  } catch (error) {
    console.error("Admin approvals fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching approvals." },
      { status: 500 }
    );
  }
}