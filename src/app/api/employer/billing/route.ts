// src/app/api/employer/billing/route.ts

import { BillingStatus, JobStatus, UserRole } from "@/generated/prisma/client";
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
        { message: "Only employers can view billing." },
        { status: 403 }
      );
    }

    const employerProfile = await prisma.employerProfile.findUnique({
      where: {
        userId: authUser.id,
      },
      include: {
        company: {
          include: {
            jobs: {
              select: {
                id: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!employerProfile?.companyId || !employerProfile.company) {
      return NextResponse.json(
        { message: "Company profile not found." },
        { status: 404 }
      );
    }

    const companyId = employerProfile.companyId;

    const subscription = await prisma.billingSubscription.upsert({
      where: {
        companyId,
      },
      update: {},
      create: {
        companyId,
        planName: "Free Employer",
        price: 0,
        currency: "USD",
        billingCycle: "Monthly",
        status: BillingStatus.FREE,
      },
    });

    const invoices = await prisma.invoice.findMany({
      where: {
        companyId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const jobs = employerProfile.company.jobs;

    const stats = {
      totalJobs: jobs.length,
      activeJobs: jobs.filter((job) => job.status === JobStatus.ACTIVE).length,
      pendingJobs: jobs.filter((job) => job.status === JobStatus.PENDING)
        .length,
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter((invoice) => invoice.status === "PAID")
        .length,
      pendingInvoices: invoices.filter(
        (invoice) => invoice.status === "PENDING"
      ).length,
    };

    return NextResponse.json({
      company: employerProfile.company,
      subscription,
      invoices,
      stats,
    });
  } catch (error) {
    console.error("Employer billing fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching billing." },
      { status: 500 }
    );
  }
}