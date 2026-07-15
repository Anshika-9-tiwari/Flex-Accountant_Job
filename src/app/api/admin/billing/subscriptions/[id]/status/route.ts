// src/app/api/admin/billing/subscriptions/[id]/status/route.ts
import { BillingStatus, UserRole } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    if (authUser.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { message: "Only admin can update subscription status." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const status = String(body.status || "").toUpperCase() as BillingStatus;

    if (!Object.values(BillingStatus).includes(status)) {
      return NextResponse.json(
        { message: "Invalid billing status." },
        { status: 400 }
      );
    }

    const subscription = await prisma.billingSubscription.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        company: true,
        invoices: true,
      },
    });

    return NextResponse.json({
      message: "Subscription status updated successfully.",
      subscription,
    });
  } catch (error) {
    console.error("Subscription status update error:", error);

    return NextResponse.json(
      { message: "Something went wrong while updating subscription status." },
      { status: 500 }
    );
  }
}