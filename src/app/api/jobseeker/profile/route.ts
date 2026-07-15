
import { UserRole } from "@/generated/prisma/client";
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

    if (authUser.role !== UserRole.JOBSEEKER) {
      return NextResponse.json(
        { message: "Only jobseekers can view this profile." },
        { status: 403 }
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
        jobseekerProfile: {
          select: {
            headline: true,
            location: true,
            experience: true,
            skills: true,
            resumeUrl: true,
            bio: true,
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
    console.error("Jobseeker profile fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching profile." },
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

    if (authUser.role !== UserRole.JOBSEEKER) {
      return NextResponse.json(
        { message: "Only jobseekers can update this profile." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const name = String(body.name || "").trim();
    const phone = body.phone ? String(body.phone).trim() : null;
    const image = body.image ? String(body.image).trim() : null;

    const headline = body.headline ? String(body.headline).trim() : null;
    const location = body.location ? String(body.location).trim() : null;
    const experience = body.experience ? String(body.experience).trim() : null;
    const resumeUrl = body.resumeUrl ? String(body.resumeUrl).trim() : null;
    const bio = body.bio ? String(body.bio).trim() : null;

    const skills = Array.isArray(body.skills)
      ? body.skills.map((skill: unknown) => String(skill).trim()).filter(Boolean)
      : String(body.skills || "")
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);

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
        jobseekerProfile: {
          upsert: {
            create: {
              headline,
              location,
              experience,
              skills,
              resumeUrl,
              bio,
            },
            update: {
              headline,
              location,
              experience,
              skills,
              resumeUrl,
              bio,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        jobseekerProfile: {
          select: {
            headline: true,
            location: true,
            experience: true,
            skills: true,
            resumeUrl: true,
            bio: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Jobseeker profile update error:", error);

    return NextResponse.json(
      { message: "Something went wrong while updating profile." },
      { status: 500 }
    );
  }
}