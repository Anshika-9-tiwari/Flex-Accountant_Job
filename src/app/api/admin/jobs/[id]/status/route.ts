// src/app/api/admin/jobs/[id]/status/route.ts

import { JobStatus, UserRole } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authUser = await getAuthUserFromRequest(request);

  if (!authUser || authUser.role !== UserRole.ADMIN) {
    return NextResponse.json(
      { message: "Only admin can update job status." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const body = await request.json();

  const status = String(body.status || "").toUpperCase() as JobStatus;

  if (!Object.values(JobStatus).includes(status)) {
    return NextResponse.json(
      { message: "Invalid job status." },
      { status: 400 }
    );
  }

  const job = await prisma.job.update({
    where: {
      id,
    },
    data: {
      status,
    },
    include: {
      company: true,
    },
  });

  return NextResponse.json({
    message: "Job status updated successfully.",
    job,
  });
}