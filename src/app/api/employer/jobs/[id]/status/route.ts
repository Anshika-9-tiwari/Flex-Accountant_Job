// src/app/api/employer/jobs/[id]/status/route.ts

import { JobStatus, UserRole } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getEmployerCompanyId(userId: string) {
  const employerProfile = await prisma.employerProfile.findUnique({
    where: {
      userId,
    },
    select: {
      companyId: true,
    },
  });

  return employerProfile?.companyId || null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
        { message: "Only employers can update job status." },
        { status: 403 }
      );
    }

    const companyId = await getEmployerCompanyId(authUser.id);

    if (!companyId) {
      return NextResponse.json(
        { message: "Company profile not found." },
        { status: 404 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const status = String(body.status || "").toUpperCase() as JobStatus;

    const allowedStatuses: JobStatus[] = [
      JobStatus.CLOSED,
      JobStatus.PENDING,
      JobStatus.DRAFT,
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          message:
            "Employer can only move jobs to CLOSED, PENDING, or DRAFT.",
        },
        { status: 400 }
      );
    }

    const existingJob = await prisma.job.findFirst({
      where: {
        id,
        companyId,
      },
      select: {
        id: true,
      },
    });

    if (!existingJob) {
      return NextResponse.json(
        { message: "Job not found." },
        { status: 404 }
      );
    }

    const job = await prisma.job.update({
      where: {
        id,
      },
      data: {
        status,
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
    });

    return NextResponse.json({
      message: "Job status updated successfully.",
      job,
    });
  } catch (error) {
    console.error("Employer job status update error:", error);

    return NextResponse.json(
      { message: "Something went wrong while updating job status." },
      { status: 500 }
    );
  }
}