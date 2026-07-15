// src/app/api/jobseeker/job-alerts/route.ts

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
        { message: "Only jobseekers can view job alerts." },
        { status: 403 }
      );
    }

    const jobAlerts = await prisma.jobAlert.findMany({
      where: {
        userId: authUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ jobAlerts });
  } catch (error) {
    console.error("Job alerts fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching job alerts." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
        { message: "Only jobseekers can create job alerts." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const title = String(body.title || "").trim();
    const keyword = body.keyword ? String(body.keyword).trim() : null;
    const location = body.location ? String(body.location).trim() : null;
    const category = body.category ? String(body.category).trim() : null;
    const frequency = body.frequency
      ? String(body.frequency).trim()
      : "Daily";

    if (!title) {
      return NextResponse.json(
        { message: "Alert title is required." },
        { status: 400 }
      );
    }

    const jobAlert = await prisma.jobAlert.create({
      data: {
        userId: authUser.id,
        title,
        keyword,
        location,
        category,
        frequency,
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        message: "Job alert created successfully.",
        jobAlert,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Job alert create error:", error);

    return NextResponse.json(
      { message: "Something went wrong while creating job alert." },
      { status: 500 }
    );
  }
}