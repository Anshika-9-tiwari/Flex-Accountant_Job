// src/app/api/messages/[userId]/route.ts

import { UserRole } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function canMessage(
  authUser: {
    id: string;
    role: UserRole;
  },
  otherUserId: string
) {
  if (authUser.id === otherUserId) {
    return false;
  }

  const otherUser = await prisma.user.findUnique({
    where: {
      id: otherUserId,
    },
    select: {
      id: true,
      role: true,
      isActive: true,
    },
  });

  if (!otherUser || !otherUser.isActive) {
    return false;
  }

  if (authUser.role === UserRole.ADMIN) {
    return true;
  }

  if (
    authUser.role === UserRole.JOBSEEKER &&
    otherUser.role === UserRole.EMPLOYER
  ) {
    const application = await prisma.application.findFirst({
      where: {
        userId: authUser.id,
        job: {
          company: {
            employers: {
              some: {
                userId: otherUserId,
              },
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    return Boolean(application);
  }

  if (
    authUser.role === UserRole.EMPLOYER &&
    otherUser.role === UserRole.JOBSEEKER
  ) {
    const employerProfile = await prisma.employerProfile.findUnique({
      where: {
        userId: authUser.id,
      },
      select: {
        companyId: true,
      },
    });

    if (!employerProfile?.companyId) {
      return false;
    }

    const application = await prisma.application.findFirst({
      where: {
        userId: otherUserId,
        job: {
          companyId: employerProfile.companyId,
        },
      },
      select: {
        id: true,
      },
    });

    return Boolean(application);
  }

  return false;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const authUser = await getAuthUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const { userId } = await params;

    const allowed = await canMessage(authUser, userId);

    if (!allowed) {
      return NextResponse.json(
        { message: "You cannot view this conversation." },
        { status: 403 }
      );
    }

    await prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: authUser.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: authUser.id,
            receiverId: userId,
          },
          {
            senderId: userId,
            receiverId: authUser.id,
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Conversation fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching conversation." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const authUser = await getAuthUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const { userId } = await params;
    const body = await request.json();

    const messageBody = String(body.body || "").trim();

    if (!messageBody) {
      return NextResponse.json(
        { message: "Message cannot be empty." },
        { status: 400 }
      );
    }

    const allowed = await canMessage(authUser, userId);

    if (!allowed) {
      return NextResponse.json(
        { message: "You cannot send message to this user." },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId: authUser.id,
        receiverId: userId,
        body: messageBody,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Message sent successfully.",
        chatMessage: message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Send message error:", error);

    return NextResponse.json(
      { message: "Something went wrong while sending message." },
      { status: 500 }
    );
  }
}