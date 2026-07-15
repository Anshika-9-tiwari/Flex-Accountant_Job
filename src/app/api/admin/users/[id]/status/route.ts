// src/app/api/admin/users/[id]/status/route.ts

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
        { message: "Only admin can update user status." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const isActive = Boolean(body.isActive);

    if (id === authUser.id) {
      return NextResponse.json(
        { message: "You cannot deactivate your own admin account." },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      message: isActive
        ? "User activated successfully."
        : "User deactivated successfully.",
      user,
    });
  } catch (error) {
    console.error("Admin user status update error:", error);

    return NextResponse.json(
      { message: "Something went wrong while updating user status." },
      { status: 500 }
    );
  }
}