// src/app/api/auth/me/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const authUser = await getAuthUserFromRequest(request);

  if (!authUser) {
    return NextResponse.json(
      { message: "Not authenticated." },
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
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ user });
}