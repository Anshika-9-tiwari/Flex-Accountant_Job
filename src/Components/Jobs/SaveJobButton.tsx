// src/Components/Jobs/SaveJobButton.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bookmark, Loader2 } from "lucide-react";

type SaveJobButtonProps = {
  slug: string;
  className?: string;
  savedClassName?: string;
};

export default function SaveJobButton({
  slug,
  className,
  savedClassName,
}: SaveJobButtonProps) {
  const router = useRouter();

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkSavedStatus() {
      try {
        const response = await fetch(`/api/jobs/${slug}/save`, {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (response.ok) {
          setSaved(Boolean(data.saved));
        }
      } catch {
        // Ignore check error silently.
      } finally {
        setChecking(false);
      }
    }

    checkSavedStatus();
  }, [slug]);

  async function handleSaveToggle() {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/jobs/${slug}/save`, {
        method: saved ? "DELETE" : "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push(`/login?role=jobseeker&next=/jobs/${slug}`);
        return;
      }

      if (!response.ok) {
        setError(data.message || "Failed to update saved job.");
        return;
      }

      setSaved(Boolean(data.saved));
      router.refresh();
    } catch {
      setError("Something went wrong while updating saved job.");
    } finally {
      setLoading(false);
    }
  }

  const defaultClass =
    "btn border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white";

  const defaultSavedClass =
    "btn border-none bg-[#0b5f68] text-white hover:bg-[#084a51]";

  return (
    <div>
      <button
        type="button"
        disabled={loading || checking}
        onClick={handleSaveToggle}
        className={saved ? savedClassName || defaultSavedClass : className || defaultClass}
      >
        {loading || checking ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
        )}

        {saved ? "Saved" : "Save Job"}
      </button>

      {error && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}