// src/app/api/jobseeker/job-alerts/[id]/route.ts

import { UserRole } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    if (authUser.role !== UserRole.JOBSEEKER) {
      return NextResponse.json(
        { message: "Only jobseekers can update job alerts." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const title = String(body.title || "").trim();
    const keyword = body.keyword ? String(body.keyword).trim() : null;
    const location = body.location ? String(body.location).trim() : null;
    const category = body.category ? String(body.category).trim() : null;
    const frequency = body.frequency
      ? String(body.frequency).trim()
      : "Daily";
    const isActive =
      typeof body.isActive === "boolean" ? body.isActive : true;

    if (!title) {
      return NextResponse.json(
        { message: "Alert title is required." },
        { status: 400 }
      );
    }

    const existingAlert = await prisma.jobAlert.findFirst({
      where: {
        id,
        userId: authUser.id,
      },
    });

    if (!existingAlert) {
      return NextResponse.json(
        { message: "Job alert not found." },
        { status: 404 }
      );
    }

    const jobAlert = await prisma.jobAlert.update({
      where: {
        id,
      },
      data: {
        title,
        keyword,
        location,
        category,
        frequency,
        isActive,
      },
    });

    return NextResponse.json({
      message: "Job alert updated successfully.",
      jobAlert,
    });
  } catch (error) {
    console.error("Job alert update error:", error);

    return NextResponse.json(
      { message: "Something went wrong while updating job alert." },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    if (authUser.role !== UserRole.JOBSEEKER) {
      return NextResponse.json(
        { message: "Only jobseekers can delete job alerts." },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existingAlert = await prisma.jobAlert.findFirst({
      where: {
        id,
        userId: authUser.id,
      },
    });

    if (!existingAlert) {
      return NextResponse.json(
        { message: "Job alert not found." },
        { status: 404 }
      );
    }

    await prisma.jobAlert.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Job alert deleted successfully.",
    });
  } catch (error) {
    console.error("Job alert delete error:", error);

    return NextResponse.json(
      { message: "Something went wrong while deleting job alert." },
      { status: 500 }
    );
  }
}