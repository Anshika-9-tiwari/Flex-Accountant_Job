// src/app/api/admin/billing/route.ts

import { BillingStatus, UserRole } from "@/generated/prisma/client";
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

    if (authUser.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { message: "Only admin can view billing." },
        { status: 403 }
      );
    }

    const companies = await prisma.company.findMany({
      select: {
        id: true,
      },
    });

    await Promise.all(
      companies.map((company) =>
        prisma.billingSubscription.upsert({
          where: {
            companyId: company.id,
          },
          update: {},
          create: {
            companyId: company.id,
            planName: "Free Employer",
            price: 0,
            currency: "USD",
            billingCycle: "Monthly",
            status: BillingStatus.FREE,
          },
        })
      )
    );

    const [subscriptions, invoices] = await prisma.$transaction([
      prisma.billingSubscription.findMany({
        include: {
          company: {
            include: {
              jobs: {
                select: {
                  id: true,
                },
              },
            },
          },
          invoices: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.invoice.findMany({
        include: {
          company: true,
          subscription: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    const stats = {
      totalSubscriptions: subscriptions.length,
      freeSubscriptions: subscriptions.filter(
        (subscription) => subscription.status === "FREE"
      ).length,
      activeSubscriptions: subscriptions.filter(
        (subscription) => subscription.status === "ACTIVE"
      ).length,
      cancelledSubscriptions: subscriptions.filter(
        (subscription) => subscription.status === "CANCELLED"
      ).length,
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter((invoice) => invoice.status === "PAID")
        .length,
      pendingInvoices: invoices.filter(
        (invoice) => invoice.status === "PENDING"
      ).length,
      totalRevenue: invoices
        .filter((invoice) => invoice.status === "PAID")
        .reduce((total, invoice) => total + invoice.amount, 0),
    };

    return NextResponse.json({
      stats,
      subscriptions,
      invoices,
    });
  } catch (error) {
    console.error("Admin billing fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching billing." },
      { status: 500 }
    );
  }
}