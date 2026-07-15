// src/app/api/upload/company-logo/route.ts

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

    if (authUser.role !== UserRole.EMPLOYER) {
      return NextResponse.json(
        { message: "Only employers can upload company logos." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Company logo is required." },
        { status: 400 }
      );
    }

    const uploadedFile = await saveUploadedFile({
      file,
      folder: "company-logos",
      maxSizeMb: 3,
      allowedFiles: [
        {
          mime: "image/jpeg",
          extension: "jpg",
        },
        {
          mime: "image/png",
          extension: "png",
        },
        {
          mime: "image/webp",
          extension: "webp",
        },
      ],
    });

    return NextResponse.json({
      message: "Company logo uploaded successfully.",
      url: uploadedFile.url,
    });
  } catch (error) {
    console.error("Company logo upload error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while uploading company logo.",
      },
      { status: 500 }
    );
  }
}