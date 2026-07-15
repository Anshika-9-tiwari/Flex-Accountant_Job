// src/app/api/jobs/[slug]/apply/route.ts

import { JobStatus, UserRole } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = await getAuthUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json(
        {
          message: "Please login as a jobseeker to apply.",
          redirectTo: "/login?role=jobseeker",
        },
        { status: 401 }
      );
    }

    if (authUser.role !== UserRole.JOBSEEKER) {
      return NextResponse.json(
        { message: "Only jobseekers can apply to jobs." },
        { status: 403 }
      );
    }

    const { slug } = await params;

    const job = await prisma.job.findUnique({
      where: {
        slug,
      },
      include: {
        company: true,
      },
    });

    if (!job) {
      return NextResponse.json({ message: "Job not found." }, { status: 404 });
    }

    if (job.status !== JobStatus.ACTIVE) {
      return NextResponse.json(
        { message: "This job is not open for applications." },
        { status: 400 }
      );
    }

    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId: authUser.id,
          jobId: job.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          message: "You have already applied to this job.",
          redirectTo: "/jobseeker/applications",
        },
        { status: 409 }
      );
    }

    const jobseekerProfile = await prisma.jobseekerProfile.findUnique({
      where: {
        userId: authUser.id,
      },
    });

    const application = await prisma.application.create({
      data: {
        userId: authUser.id,
        jobId: job.id,
        resumeUrl: jobseekerProfile?.resumeUrl || null,
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully.",
        application,
        redirectTo: "/jobseeker/applications",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Apply job error:", error);

    return NextResponse.json(
      { message: "Something went wrong while applying to this job." },
      { status: 500 }
    );
  }
}