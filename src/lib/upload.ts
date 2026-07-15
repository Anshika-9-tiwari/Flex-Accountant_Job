// src/lib/upload.ts

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { Buffer } from "buffer";

type AllowedFile = {
  mime: string;
  extension: string;
};

type SaveUploadOptions = {
  file: File;
  folder: string;
  allowedFiles: AllowedFile[];
  maxSizeMb: number;
};

export async function saveUploadedFile({
  file,
  folder,
  allowedFiles,
  maxSizeMb,
}: SaveUploadOptions) {
  if (!file) {
    throw new Error("File is required.");
  }

  const matchedType = allowedFiles.find((item) => item.mime === file.type);

  if (!matchedType) {
    throw new Error("Invalid file type.");
  }

  const maxSizeBytes = maxSizeMb * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    throw new Error(`File size must be less than ${maxSizeMb}MB.`);
  }

  const fileName = `${randomUUID()}.${matchedType.extension}`;
  const uploadDirectory = path.join(process.cwd(), "public", "uploads", folder);

  await mkdir(uploadDirectory, {
    recursive: true,
  });

  const filePath = path.join(uploadDirectory, fileName);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(filePath, buffer);

  return {
    fileName,
    url: `/uploads/${folder}/${fileName}`,
  };
}