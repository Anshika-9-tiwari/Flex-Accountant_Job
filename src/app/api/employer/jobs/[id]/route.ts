// src/app/api/employer/jobs/[id]/route.ts

import { JobStatus, JobType, UserRole, WorkMode } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";

function normalizeJobType(value: string): JobType {
  const clean = value.toUpperCase().replaceAll(" ", "_").replaceAll("-", "_");

  if (clean === "FULL_TIME") return JobType.FULL_TIME;
  if (clean === "PART_TIME") return JobType.PART_TIME;
  if (clean === "CONTRACT") return JobType.CONTRACT;
  if (clean === "FREELANCE") return JobType.FREELANCE;
  if (clean === "INTERNSHIP") return JobType.INTERNSHIP;

  return JobType.FULL_TIME;
}

function normalizeWorkMode(value: string): WorkMode {
  const clean = value.toUpperCase().replaceAll("-", "").replaceAll(" ", "");

  if (clean === "REMOTE") return WorkMode.REMOTE;
  if (clean === "HYBRID") return WorkMode.HYBRID;
  if (clean === "ONSITE") return WorkMode.ONSITE;

  return WorkMode.REMOTE;
}

async function createUniqueSlug(title: string, currentJobId: string) {
  const baseSlug = createSlug(title);
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const existingJob = await prisma.job.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (!existingJob || existingJob.id === currentJobId) {
      return slug;
    }

    slug = `${baseSlug}-${count}`;
    count++;
  }
}

async function getEmployerCompanyId(userId: string) {
  const employerProfile = await prisma.employerProfile.findUnique({
    where: {
      userId,
    },
    select: {
      companyId: true,
    },
  });

  return employerProfile?.companyId || null;
}

export async function GET(
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

    if (authUser.role !== UserRole.EMPLOYER) {
      return NextResponse.json(
        { message: "Only employers can view this job." },
        { status: 403 }
      );
    }

    const companyId = await getEmployerCompanyId(authUser.id);

    if (!companyId) {
      return NextResponse.json(
        { message: "Company profile not found." },
        { status: 404 }
      );
    }

    const { id } = await params;

    const job = await prisma.job.findFirst({
      where: {
        id,
        companyId,
      },
      include: {
        company: true,
        applications: {
          select: {
            id: true,
          },
        },
        savedJobs: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { message: "Job not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Employer single job fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching job." },
      { status: 500 }
    );
  }
}

// update function
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

    if (authUser.role !== UserRole.EMPLOYER) {
      return NextResponse.json(
        { message: "Only employers can update jobs." },
        { status: 403 }
      );
    }

    const companyId = await getEmployerCompanyId(authUser.id);

    if (!companyId) {
      return NextResponse.json(
        { message: "Company profile not found." },
        { status: 404 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const existingJob = await prisma.job.findFirst({
      where: {
        id,
        companyId,
      },
    });

    if (!existingJob) {
      return NextResponse.json(
        { message: "Job not found." },
        { status: 404 }
      );
    }

    const title = String(body.title || "").trim();
    const category = String(body.category || "").trim();
    const type = normalizeJobType(String(body.type || ""));
    const workMode = normalizeWorkMode(String(body.workMode || ""));
    const location = String(body.location || "").trim();

    const experience = body.experience
      ? String(body.experience).trim()
      : null;

    const salaryMin = body.salaryMin ? Number(body.salaryMin) : null;
    const salaryMax = body.salaryMax ? Number(body.salaryMax) : null;

    const salaryType = body.salaryType
      ? String(body.salaryType).trim()
      : null;

    const summary = body.summary ? String(body.summary).trim() : null;

    const responsibilities = body.responsibilities
      ? String(body.responsibilities).trim()
      : null;

    const requirements = body.requirements
      ? String(body.requirements).trim()
      : null;

    const benefits = body.benefits ? String(body.benefits).trim() : null;

    const skills = Array.isArray(body.skills)
      ? body.skills.map((skill: unknown) => String(skill).trim()).filter(Boolean)
      : String(body.skills || "")
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);

    const applyMethod = body.applyMethod
      ? String(body.applyMethod).trim()
      : null;

    const externalApply = body.externalApply
      ? String(body.externalApply).trim()
      : null;

    const deadline = body.deadline ? new Date(body.deadline) : null;

    if (!title || !category || !location) {
      return NextResponse.json(
        { message: "Title, category, and location are required." },
        { status: 400 }
      );
    }

    const slug = await createUniqueSlug(title, id);

    const job = await prisma.job.update({
      where: {
        id,
      },
      data: {
        title,
        slug,
        category,
        type,
        workMode,
        location,
        experience,
        salaryMin,
        salaryMax,
        salaryType,
        summary,
        responsibilities,
        requirements,
        benefits,
        skills,
        applyMethod,
        externalApply,
        deadline,
        status: JobStatus.PENDING,
      },
      include: {
        company: true,
        applications: {
          select: {
            id: true,
          },
        },
        savedJobs: {
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Job updated successfully and sent for admin review.",
      job,
    });
  } catch (error) {
    console.error("Employer job update error:", error);

    return NextResponse.json(
      { message: "Something went wrong while updating job." },
      { status: 500 }
    );
  }
}

// delete function
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

    if (authUser.role !== UserRole.EMPLOYER) {
      return NextResponse.json(
        { message: "Only employers can delete jobs." },
        { status: 403 }
      );
    }

    const companyId = await getEmployerCompanyId(authUser.id);

    if (!companyId) {
      return NextResponse.json(
        { message: "Company profile not found." },
        { status: 404 }
      );
    }

    const { id } = await params;

    const job = await prisma.job.findFirst({
      where: {
        id,
        companyId,
      },
      include: {
        applications: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { message: "Job not found." },
        { status: 404 }
      );
    }

    if (job.applications.length > 0) {
      return NextResponse.json(
        {
          message:
            "This job has applications, so it cannot be deleted. Please close it instead.",
        },
        { status: 400 }
      );
    }

    await prisma.job.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Job deleted successfully.",
    });
  } catch (error) {
    console.error("Employer job delete error:", error);

    return NextResponse.json(
      { message: "Something went wrong while deleting job." },
      { status: 500 }
    );
  }
}