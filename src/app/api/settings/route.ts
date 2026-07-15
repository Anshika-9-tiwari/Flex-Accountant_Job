// src/app/api/settings/route.ts

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

    const user = await prisma.user.findUnique({
      where: {
        id: authUser.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        isActive: true,
        createdAt: true,
        jobseekerProfile: true,
        employerProfile: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Settings fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching settings." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name = String(body.name || "").trim();
    const phone = body.phone ? String(body.phone).trim() : null;
    const image = body.image ? String(body.image).trim() : null;

    if (!name) {
      return NextResponse.json(
        { message: "Name is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: {
        id: authUser.id,
      },
      data: {
        name,
        phone,
        image,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        isActive: true,
        createdAt: true,
        jobseekerProfile: true,
        employerProfile: {
          include: {
            company: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Account settings updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Settings update error:", error);

    return NextResponse.json(
      { message: "Something went wrong while updating settings." },
      { status: 500 }
    );
  }
}