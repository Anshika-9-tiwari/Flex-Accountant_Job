// src/app/api/jobs/[slug]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const job = await prisma.job.findUnique({
    where: {
      slug,
    },
    include: {
      company: true,
      applications: true,
      savedJobs: true,
    },
  });

  if (!job) {
    return NextResponse.json({ message: "Job not found." }, { status: 404 });
  }

  return NextResponse.json({ job });
}