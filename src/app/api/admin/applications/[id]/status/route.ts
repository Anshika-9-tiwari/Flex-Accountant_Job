// src/app/api/admin/applications/[id]/status/route.ts

import { ApplicationStatus, UserRole } from "@/generated/prisma/client";
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

    if (authUser.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { message: "Only admin can update application status." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const status = String(body.status || "").toUpperCase() as ApplicationStatus;

    if (!Object.values(ApplicationStatus).includes(status)) {
      return NextResponse.json(
        { message: "Invalid application status." },
        { status: 400 }
      );
    }

    const application = await prisma.application.update({
      where: {
        id,
      },
      data: {
        status,
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
    });

    return NextResponse.json({
      message: "Application status updated successfully.",
      application,
    });
  } catch (error) {
    console.error("Admin application status update error:", error);

    return NextResponse.json(
      { message: "Something went wrong while updating application status." },
      { status: 500 }
    );
  }
}