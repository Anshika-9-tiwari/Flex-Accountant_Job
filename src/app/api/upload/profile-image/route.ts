// src/app/api/upload/profile-image/route.ts

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

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Profile image is required." },
        { status: 400 }
      );
    }

    const uploadedFile = await saveUploadedFile({
      file,
      folder: "profile-images",
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
      message: "Profile image uploaded successfully.",
      url: uploadedFile.url,
    });
  } catch (error) {
    console.error("Profile image upload error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while uploading profile image.",
      },
      { status: 500 }
    );
  }
}