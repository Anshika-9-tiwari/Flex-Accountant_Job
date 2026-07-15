// src/app/api/employer/dashboard/route.ts

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

    if (authUser.role !== UserRole.EMPLOYER) {
      return NextResponse.json(
        { message: "Only employers can view this dashboard." },
        { status: 403 }
      );
    }

    const employerProfile = await prisma.employerProfile.findUnique({
      where: {
        userId: authUser.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        company: true,
      },
    });

    if (!employerProfile?.companyId) {
      return NextResponse.json({
        employerProfile,
        company: null,
        stats: {
          totalJobs: 0,
          activeJobs: 0,
          pendingJobs: 0,
          rejectedJobs: 0,
          closedJobs: 0,
          totalApplicants: 0,
          reviewedApplicants: 0,
          shortlistedApplicants: 0,
          interviewApplicants: 0,
        },
        recentJobs: [],
        recentApplicants: [],
      });
    }

    const companyId = employerProfile.companyId;

    const [jobs, applications] = await prisma.$transaction([
      prisma.job.findMany({
        where: {
          companyId,
        },
        include: {
          applications: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.application.findMany({
        where: {
          job: {
            companyId,
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
      }),
    ]);

    const stats = {
      totalJobs: jobs.length,
      activeJobs: jobs.filter((job) => job.status === JobStatus.ACTIVE).length,
      pendingJobs: jobs.filter((job) => job.status === JobStatus.PENDING)
        .length,
      rejectedJobs: jobs.filter((job) => job.status === JobStatus.REJECTED)
        .length,
      closedJobs: jobs.filter((job) => job.status === JobStatus.CLOSED).length,
      totalApplicants: applications.length,
      reviewedApplicants: applications.filter(
        (application) => application.status === "REVIEWED"
      ).length,
      shortlistedApplicants: applications.filter(
        (application) => application.status === "SHORTLISTED"
      ).length,
      interviewApplicants: applications.filter(
        (application) => application.status === "INTERVIEW"
      ).length,
    };

    return NextResponse.json({
      employerProfile,
      company: employerProfile.company,
      stats,
      recentJobs: jobs.slice(0, 5),
      recentApplicants: applications.slice(0, 6),
    });
  } catch (error) {
    console.error("Employer dashboard fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching employer dashboard." },
      { status: 500 }
    );
  }
}