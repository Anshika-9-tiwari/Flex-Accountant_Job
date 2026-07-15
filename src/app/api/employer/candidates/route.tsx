// src/app/api/employer/candidates/route.ts

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
        { message: "Only employers can view candidates." },
        { status: 403 }
      );
    }

    const employerProfile = await prisma.employerProfile.findUnique({
      where: {
        userId: authUser.id,
      },
      include: {
        company: true,
      },
    });

    if (!employerProfile?.companyId) {
      return NextResponse.json({
        company: null,
        candidates: [],
        stats: {
          totalCandidates: 0,
          candidatesWithResume: 0,
          candidatesAppliedToCompany: 0,
        },
      });
    }

    const candidates = await prisma.user.findMany({
      where: {
        role: UserRole.JOBSEEKER,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        createdAt: true,
        jobseekerProfile: true,
        applications: {
          where: {
            job: {
              companyId: employerProfile.companyId,
            },
          },
          include: {
            job: {
              select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                status: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const stats = {
      totalCandidates: candidates.length,
      candidatesWithResume: candidates.filter(
        (candidate) => candidate.jobseekerProfile?.resumeUrl
      ).length,
      candidatesAppliedToCompany: candidates.filter(
        (candidate) => candidate.applications.length > 0
      ).length,
    };

    return NextResponse.json({
      company: employerProfile.company,
      candidates,
      stats,
    });
  } catch (error) {
    console.error("Employer candidates fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching candidates." },
      { status: 500 }
    );
  }
}