// src/app/api/messages/contacts/route.ts

import { UserRole } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ContactItem = {
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  role: UserRole;
  subtitle: string;
  companyName: string | null;
  relatedJobTitle: string | null;
  lastMessage: string | null;
  lastMessageAt: Date | null;
  unreadCount: number;
};

async function addMessageInfo(currentUserId: string, contact: ContactItem) {
  const [lastMessage, unreadCount] = await prisma.$transaction([
    prisma.message.findFirst({
      where: {
        OR: [
          {
            senderId: currentUserId,
            receiverId: contact.userId,
          },
          {
            senderId: contact.userId,
            receiverId: currentUserId,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.message.count({
      where: {
        senderId: contact.userId,
        receiverId: currentUserId,
        isRead: false,
      },
    }),
  ]);

  return {
    ...contact,
    lastMessage: lastMessage?.body || null,
    lastMessageAt: lastMessage?.createdAt || null,
    unreadCount,
  };
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const contactsMap = new Map<string, ContactItem>();

    if (authUser.role === UserRole.JOBSEEKER) {
      const applications = await prisma.application.findMany({
        where: {
          userId: authUser.id,
        },
        include: {
          job: {
            include: {
              company: {
                include: {
                  employers: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          name: true,
                          email: true,
                          phone: true,
                          image: true,
                          role: true,
                          isActive: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      for (const application of applications) {
        for (const employerProfile of application.job.company.employers) {
          const employerUser = employerProfile.user;

          if (!employerUser.isActive) continue;

          if (!contactsMap.has(employerUser.id)) {
            contactsMap.set(employerUser.id, {
              userId: employerUser.id,
              name: employerUser.name,
              email: employerUser.email,
              phone: employerUser.phone,
              image: employerUser.image,
              role: employerUser.role,
              subtitle:
                employerProfile.designation ||
                `Employer at ${application.job.company.name}`,
              companyName: application.job.company.name,
              relatedJobTitle: application.job.title,
              lastMessage: null,
              lastMessageAt: null,
              unreadCount: 0,
            });
          }
        }
      }
    }

    if (authUser.role === UserRole.EMPLOYER) {
      const employerProfile = await prisma.employerProfile.findUnique({
        where: {
          userId: authUser.id,
        },
        select: {
          companyId: true,
        },
      });

      if (employerProfile?.companyId) {
        const applications = await prisma.application.findMany({
          where: {
            job: {
              companyId: employerProfile.companyId,
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
                role: true,
                isActive: true,
                jobseekerProfile: true,
              },
            },
            job: {
              select: {
                title: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        for (const application of applications) {
          const jobseekerUser = application.user;

          if (!jobseekerUser.isActive) continue;

          if (!contactsMap.has(jobseekerUser.id)) {
            contactsMap.set(jobseekerUser.id, {
              userId: jobseekerUser.id,
              name: jobseekerUser.name,
              email: jobseekerUser.email,
              phone: jobseekerUser.phone,
              image: jobseekerUser.image,
              role: jobseekerUser.role,
              subtitle:
                jobseekerUser.jobseekerProfile?.headline ||
                "Accounting Candidate",
              companyName: null,
              relatedJobTitle: application.job.title,
              lastMessage: null,
              lastMessageAt: null,
              unreadCount: 0,
            });
          }
        }
      }
    }

    if (authUser.role === UserRole.ADMIN) {
      const users = await prisma.user.findMany({
        where: {
          id: {
            not: authUser.id,
          },
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          role: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      for (const user of users) {
        contactsMap.set(user.id, {
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.image,
          role: user.role,
          subtitle: user.role,
          companyName: null,
          relatedJobTitle: null,
          lastMessage: null,
          lastMessageAt: null,
          unreadCount: 0,
        });
      }
    }

    const contactsWithMessageInfo = await Promise.all(
      Array.from(contactsMap.values()).map((contact) =>
        addMessageInfo(authUser.id, contact)
      )
    );

    contactsWithMessageInfo.sort((a, b) => {
      const aTime = a.lastMessageAt
        ? new Date(a.lastMessageAt).getTime()
        : 0;
      const bTime = b.lastMessageAt
        ? new Date(b.lastMessageAt).getTime()
        : 0;

      return bTime - aTime;
    });

    return NextResponse.json({
      currentUser: authUser,
      contacts: contactsWithMessageInfo,
    });
  } catch (error) {
    console.error("Message contacts fetch error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching message contacts." },
      { status: 500 }
    );
  }
}