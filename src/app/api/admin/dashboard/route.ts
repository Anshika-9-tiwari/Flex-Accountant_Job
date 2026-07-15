// src/app/api/admin/dashboard/route.ts

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
        { message: "Only admin can view this dashboard." },
        { status: 403 }
      );
    }

    const [users, jobs, applications, companies, pendingEmployers] =
      await prisma.$transaction([
        prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.job.findMany({
          include: {
            company: true,
            applications: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.application.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
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

        prisma.company.findMany({
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.employerProfile.findMany({
          where: {
            isVerified: false,
          },
          include: {
            user: true,
            company: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

    const stats = {
      totalUsers: users.length,
      jobseekers: users.filter((user) => user.role === UserRole.JOBSEEKER)
        .length,
      employers: users.filter((user) => user.role === UserRole.EMPLOYER)
        .length,
      admins: users.filter((user) => user.role === UserRole.ADMIN).length,

      totalCompanies: companies.length,

      totalJobs: jobs.length,
      activeJobs: jobs.filter((job) => job.status === JobStatus.ACTIVE).length,
      pendingJobs: jobs.filter((job) => job.status === JobStatus.PENDING)
        .length,
      rejectedJobs: jobs.filter((job) => job.status === JobStatus.REJECTED)
        .length,
      closedJobs: jobs.filter((job) => job.status === JobStatus.CLOSED).length,

      totalApplications: applications.length,
      pendingEmployerVerifications: pendingEmployers.length,
    };

    return NextResponse.json({
      stats,
      recentUsers: users.slice(0, 6),
      recentJobs: jobs.slice(0, 6),
      recentApplications: applications.slice(0, 6),
      pendingEmployers: pendingEmployers.slice(0, 6),
    });
  } catch (error) {
    console.error("Admin dashboard fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching admin dashboard." },
      { status: 500 }
    );
  }
}