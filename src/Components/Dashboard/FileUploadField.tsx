// src/Components/Dashboard/FileUploadField.tsx

"use client";

import { ChangeEvent, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";

type FileUploadFieldProps = {
  label: string;
  uploadUrl: string;
  accept: string;
  currentUrl?: string;
  buttonText?: string;
  onUploaded: (url: string) => void;
};

export default function FileUploadField({
  label,
  uploadUrl,
  accept,
  currentUrl,
  buttonText = "Upload File",
  onUploaded,
}: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(uploadUrl, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Upload failed.");
        return;
      }

      onUploaded(data.url);
    } catch {
      setError("Something went wrong while uploading.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
        {label}
      </label>

      <div className="rounded-xl border border-base-300 bg-white p-4">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-400 bg-[#f8fbff] px-5 py-6 text-center transition hover:border-[#ff7900] hover:bg-[#ff7900]/5">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-[#ff7900]" />
          ) : (
            <UploadCloud className="h-8 w-8 text-[#ff7900]" />
          )}

          <span className="mt-3 text-sm font-bold text-[#2c2935]">
            {uploading ? "Uploading..." : buttonText}
          </span>

          <span className="mt-1 text-xs font-semibold text-slate-400">
            Click to choose file
          </span>

          <input
            type="file"
            accept={accept}
            disabled={uploading}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {currentUrl && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex text-sm font-bold text-[#0b5f68] hover:text-[#ff7900]"
          >
            View current file
          </a>
        )}

        {error && (
          <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}