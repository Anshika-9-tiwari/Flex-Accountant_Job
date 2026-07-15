// src/Components/Jobs/ApplyJobButton.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";

type ApplyJobButtonProps = {
  slug: string;
  className?: string;
};

export default function ApplyJobButton({ slug, className }: ApplyJobButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleApply() {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/jobs/${slug}/apply`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push(`/login?role=jobseeker&next=/jobs/${slug}`);
        return;
      }

      if (!response.ok) {
        setError(data.message || "Failed to apply.");
        return;
      }

      router.push(data.redirectTo || "/jobseeker/applications");
      router.refresh();
    } catch {
      setError("Something went wrong while applying.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={loading}
        onClick={handleApply}
        className={
          className ||
          "btn w-full border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
        }
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Applying...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Apply Now
          </>
        )}
      </button>

      {error && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}