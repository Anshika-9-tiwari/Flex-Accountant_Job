// src/app/api/upload/resume/route.ts

import { UserRole } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
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
        { message: "Only jobseekers can upload resumes." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Resume file is required." },
        { status: 400 }
      );
    }

    const uploadedFile = await saveUploadedFile({
      file,
      folder: "resumes",
      maxSizeMb: 5,
      allowedFiles: [
        {
          mime: "application/pdf",
          extension: "pdf",
        },
        {
          mime: "application/msword",
          extension: "doc",
        },
        {
          mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          extension: "docx",
        },
      ],
    });

    return NextResponse.json({
      message: "Resume uploaded successfully.",
      url: uploadedFile.url,
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while uploading resume.",
      },
      { status: 500 }
    );
  }
}