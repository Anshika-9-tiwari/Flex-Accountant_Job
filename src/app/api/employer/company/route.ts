// src/app/api/employer/company/route.ts

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

    if (authUser.role !== UserRole.EMPLOYER) {
      return NextResponse.json(
        { message: "Only employers can view company profile." },
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
        employerProfile: {
          include: {
            company: true,
          },
        },
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Employer company fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching company profile." },
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

    if (authUser.role !== UserRole.EMPLOYER) {
      return NextResponse.json(
        { message: "Only employers can update company profile." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const name = String(body.name || "").trim();
    const phone = body.phone ? String(body.phone).trim() : null;
    const designation = body.designation
      ? String(body.designation).trim()
      : null;

    const companyName = String(body.companyName || "").trim();
    const industry = body.industry ? String(body.industry).trim() : null;
    const size = body.size ? String(body.size).trim() : null;
    const website = body.website ? String(body.website).trim() : null;
    const location = body.location ? String(body.location).trim() : null;
    const logoUrl = body.logoUrl ? String(body.logoUrl).trim() : null;
    const description = body.description
      ? String(body.description).trim()
      : null;

    if (!name || !companyName) {
      return NextResponse.json(
        { message: "Contact name and company name are required." },
        { status: 400 }
      );
    }

    const existingEmployerProfile = await prisma.employerProfile.findUnique({
      where: {
        userId: authUser.id,
      },
      include: {
        company: true,
      },
    });

    const updatedUser = await prisma.user.update({
      where: {
        id: authUser.id,
      },
      data: {
        name,
        phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    let company;

    if (existingEmployerProfile?.companyId) {
      company = await prisma.company.update({
        where: {
          id: existingEmployerProfile.companyId,
        },
        data: {
          name: companyName,
          industry,
          size,
          website,
          location,
          logoUrl,
          description,
        },
      });

      await prisma.employerProfile.update({
        where: {
          userId: authUser.id,
        },
        data: {
          designation,
        },
      });
    } else {
      const createdCompany = await prisma.company.create({
        data: {
          name: companyName,
          industry,
          size,
          website,
          location,
          logoUrl,
          description,
        },
      });

      company = createdCompany;

      await prisma.employerProfile.upsert({
        where: {
          userId: authUser.id,
        },
        update: {
          designation,
          companyId: createdCompany.id,
        },
        create: {
          userId: authUser.id,
          designation,
          companyId: createdCompany.id,
        },
      });
    }

    const employerProfile = await prisma.employerProfile.findUnique({
      where: {
        userId: authUser.id,
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json({
      message: "Company profile updated successfully.",
      user: updatedUser,
      employerProfile,
      company,
    });
  } catch (error) {
    console.error("Employer company update error:", error);

    return NextResponse.json(
      { message: "Something went wrong while updating company profile." },
      { status: 500 }
    );
  }
}