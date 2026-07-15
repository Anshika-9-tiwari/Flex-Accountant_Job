// src/app/api/jobs/route.ts

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const workMode = searchParams.get("workMode");
  const keyword = searchParams.get("q");

  const jobs = await prisma.job.findMany({
    where: {
      status: status ? (status as JobStatus) : JobStatus.ACTIVE,
      ...(category && category !== "All Categories"
        ? {
            category,
          }
        : {}),
      ...(workMode && workMode !== "All Locations"
        ? {
            workMode: normalizeWorkMode(workMode),
          }
        : {}),
      ...(keyword
        ? {
            OR: [
              {
                title: {
                  contains: keyword,
                  mode: "insensitive",
                },
              },
              {
                company: {
                  name: {
                    contains: keyword,
                    mode: "insensitive",
                  },
                },
              },
              {
                category: {
                  contains: keyword,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },
    include: {
      company: true,
      applications: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ jobs });
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json(
        { message: "You must be logged in to post a job." },
        { status: 401 }
      );
    }

    if (authUser.role !== UserRole.EMPLOYER && authUser.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { message: "Only employers can post jobs." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const title = String(body.title || "").trim();
    const category = String(body.category || "").trim();
    const type = String(body.type || "Full Time").trim();
    const workMode = String(body.workMode || "Remote").trim();
    const location = String(body.location || "Remote").trim();

    if (!title || !category || !location) {
      return NextResponse.json(
        { message: "Job title, category, and location are required." },
        { status: 400 }
      );
    }

    const employerProfile = await prisma.employerProfile.findUnique({
      where: {
        userId: authUser.id,
      },
      include: {
        company: true,
      },
    });

    if (!employerProfile?.companyId) {
      return NextResponse.json(
        { message: "Please complete company profile before posting a job." },
        { status: 400 }
      );
    }

    const baseSlug = createSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (
      await prisma.job.findUnique({
        where: {
          slug,
        },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const job = await prisma.job.create({
      data: {
        companyId: employerProfile.companyId,
        title,
        slug,
        category,
        type: normalizeJobType(type),
        workMode: normalizeWorkMode(workMode),
        location,
        experience: body.experience ? String(body.experience) : null,
        salaryMin: body.salaryMin ? Number(body.salaryMin) : null,
        salaryMax: body.salaryMax ? Number(body.salaryMax) : null,
        salaryType: body.salaryType ? String(body.salaryType) : null,
        summary: body.summary ? String(body.summary) : null,
        responsibilities: body.responsibilities
          ? String(body.responsibilities)
          : null,
        requirements: body.requirements ? String(body.requirements) : null,
        benefits: body.benefits ? String(body.benefits) : null,
        skills: Array.isArray(body.skills)
          ? body.skills
          : body.skills
          ? String(body.skills)
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        applyMethod: body.applyMethod ? String(body.applyMethod) : null,
        externalApply: body.externalApply ? String(body.externalApply) : null,
        deadline: body.deadline ? new Date(body.deadline) : null,
        status: JobStatus.PENDING,
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json(
      {
        message: "Job created successfully and sent for approval.",
        job,
        redirectTo: "/employer/jobs",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create job error:", error);

    return NextResponse.json(
      { message: "Something went wrong while creating job." },
      { status: 500 }
    );
  }
}