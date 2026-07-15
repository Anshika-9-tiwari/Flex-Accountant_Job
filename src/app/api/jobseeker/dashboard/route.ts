// src/app/api/jobseeker/dashboard/route.ts

import { ApplicationStatus, JobStatus, UserRole } from "@/generated/prisma/client";
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
        { message: "Only jobseekers can view this dashboard." },
        { status: 403 }
      );
    }

    const [user, applications, savedJobs, recommendedJobs] =
      await prisma.$transaction([
        prisma.user.findUnique({
          where: {
            id: authUser.id,
          },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            jobseekerProfile: true,
          },
        }),

        prisma.application.findMany({
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
        }),

        prisma.savedJob.findMany({
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
        }),

        prisma.job.findMany({
          where: {
            status: JobStatus.ACTIVE,
          },
          include: {
            company: true,
            applications: {
              where: {
                userId: authUser.id,
              },
              select: {
                id: true,
              },
            },
            savedJobs: {
              where: {
                userId: authUser.id,
              },
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 12,
        }),
      ]);

    const stats = {
      totalApplications: applications.length,
      savedJobs: savedJobs.length,
      reviewedApplications: applications.filter(
        (application) => application.status === ApplicationStatus.REVIEWED
      ).length,
      interviewApplications: applications.filter(
        (application) => application.status === ApplicationStatus.INTERVIEW
      ).length,
      shortlistedApplications: applications.filter(
        (application) => application.status === ApplicationStatus.SHORTLISTED
      ).length,
      hiredApplications: applications.filter(
        (application) => application.status === ApplicationStatus.HIRED
      ).length,
    };

    return NextResponse.json({
      user,
      stats,
      recentApplications: applications.slice(0, 5),
      recentSavedJobs: savedJobs.slice(0, 5),
      recommendedJobs,
    });
  } catch (error) {
    console.error("Jobseeker dashboard fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching jobseeker dashboard." },
      { status: 500 }
    );
  }
}