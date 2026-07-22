// src/app/api/auth/forgot-password/route.ts

import { randomBytes, createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/emails/passwordResetEmail";

export const runtime = "nodejs";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getBaseUrl() {
  return process.env.APP_URL || "http://localhost:3000";   
}

//  https://www.flex-accountant.com/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { message: "Email address is required." },
        { status: 400 }
      );
    }

    const safeMessage =
      "If this email is registered, a password reset link has been sent.";

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({
        message: safeMessage,
      });
    }

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
    });

    const token = randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const resetLink = `${getBaseUrl()}/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetLink,
      });
    } catch (emailError) {
      console.error("Reset password email send error:", emailError);

      await prisma.passwordResetToken.deleteMany({
        where: {
          tokenHash,
        },
      });

      return NextResponse.json(
        {
          message:
            "Unable to send reset email right now. Please check SMTP settings.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: safeMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { message: "Something went wrong while generating reset email." },
      { status: 500 }
    );
  }
}