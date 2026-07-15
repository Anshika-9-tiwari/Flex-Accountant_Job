// src/app/api/admin/employers/[id]/verify/route.ts

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

    if (authUser.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { message: "Only admin can verify employers." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const isVerified = Boolean(body.isVerified);

    const employer = await prisma.employerProfile.update({
      where: {
        id,
      },
      data: {
        isVerified,
      },
      include: {
        user: true,
        company: true,
      },
    });

    return NextResponse.json({
      message: isVerified
        ? "Employer verified successfully."
        : "Employer verification removed.",
      employer,
    });
  } catch (error) {
    console.error("Employer verification update error:", error);

    return NextResponse.json(
      { message: "Something went wrong while updating employer verification." },
      { status: 500 }
    );
  }
}