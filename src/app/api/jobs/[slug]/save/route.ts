// src/app/api/jobs/[slug]/save/route.ts

import { JobStatus, UserRole } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = await getAuthUserFromRequest(request);

    if (!authUser || authUser.role !== UserRole.JOBSEEKER) {
      return NextResponse.json({
        saved: false,
        authenticated: false,
      });
    }

    const { slug } = await params;

    const job = await prisma.job.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!job) {
      return NextResponse.json({
        saved: false,
        authenticated: true,
      });
    }

    const savedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: authUser.id,
          jobId: job.id,
        },
      },
    });

    return NextResponse.json({
      saved: Boolean(savedJob),
      authenticated: true,
    });
  } catch (error) {
    console.error("Check saved job error:", error);

    return NextResponse.json(
      { message: "Something went wrong while checking saved job." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = await getAuthUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json(
        {
          message: "Please login as a jobseeker to save jobs.",
          redirectTo: "/login?role=jobseeker",
        },
        { status: 401 }
      );
    }

    if (authUser.role !== UserRole.JOBSEEKER) {
      return NextResponse.json(
        { message: "Only jobseekers can save jobs." },
        { status: 403 }
      );
    }

    const { slug } = await params;

    const job = await prisma.job.findUnique({
      where: { slug },
    });

    if (!job) {
      return NextResponse.json({ message: "Job not found." }, { status: 404 });
    }

    if (job.status !== JobStatus.ACTIVE) {
      return NextResponse.json(
        { message: "Only active jobs can be saved." },
        { status: 400 }
      );
    }

    const savedJob = await prisma.savedJob.upsert({
      where: {
        userId_jobId: {
          userId: authUser.id,
          jobId: job.id,
        },
      },
      update: {},
      create: {
        userId: authUser.id,
        jobId: job.id,
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
        message: "Job saved successfully.",
        saved: true,
        savedJob,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save job error:", error);

    return NextResponse.json(
      { message: "Something went wrong while saving job." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = await getAuthUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json(
        { message: "Please login first." },
        { status: 401 }
      );
    }

    if (authUser.role !== UserRole.JOBSEEKER) {
      return NextResponse.json(
        { message: "Only jobseekers can remove saved jobs." },
        { status: 403 }
      );
    }

    const { slug } = await params;

    const job = await prisma.job.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!job) {
      return NextResponse.json({ message: "Job not found." }, { status: 404 });
    }

    await prisma.savedJob.deleteMany({
      where: {
        userId: authUser.id,
        jobId: job.id,
      },
    });

    return NextResponse.json({
      message: "Job removed from saved jobs.",
      saved: false,
    });
  } catch (error) {
    console.error("Remove saved job error:", error);

    return NextResponse.json(
      { message: "Something went wrong while removing saved job." },
      { status: 500 }
    );
  }
}