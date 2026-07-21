// src/app/forgot-password/page.tsx

"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, KeyRound, Loader2, Mail, Send } from "lucide-react";
import MarketingHeader from "@/Components/Layouts/MarketingHeader";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setResetLink("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to generate reset link.");
        return;
      }

      setSuccess(data.message || "Reset link generated.");
      setResetLink(data.resetLink || "");
    } catch {
      setError("Something went wrong while generating reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <MarketingHeader/>
      <main className="min-h-screen bg-[#f5f7fb] px-4 py-10">
        <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center">
            <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-[1fr_520px]">
            <div className="hidden bg-gradient-to-br from-[#0b5f68] to-[#083f46] p-10 text-white lg:block">
                <Link href="/" className="text-3xl font-extrabold">
                <span className="text-[#ff7900]">flex</span>
                <span>-accountant</span>
                </Link>

                <div className="mt-24">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                    <KeyRound className="h-8 w-8 text-[#ff7900]" />
                </div>

                <h1 className="mt-8 text-4xl font-extrabold leading-tight">
                    Reset your account password
                </h1>

                <p className="mt-5 max-w-md text-base leading-7 text-white/80">
                    Enter your registered email address and generate a secure reset
                    link.
                </p>
                </div>
            </div>

            <div className="p-6 sm:p-10">
                <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0b5f68] hover:text-[#ff7900]"
                >
                <ArrowLeft className="h-4 w-4" />
                Back to login
                </Link>

                <div className="mt-10">
                <p className="mb-3 inline-flex rounded-full bg-[#ff7900]/10 px-4 py-2 text-sm font-bold text-[#ff7900]">
                    Forgot Password
                </p>

                <h2 className="text-3xl font-extrabold text-[#2c2935]">
                    Generate reset link
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    Enter your account email address. For local development, the
                    reset link will appear below after submission.
                </p>
                </div>

                {error && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                    {error}
                </div>
                )}

                {success && (
                <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
                    {success}
                </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                    Email Address
                    </label>

                    <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                    <Mail className="mr-3 h-5 w-5 text-[#ff7900]" />
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter registered email"
                        className="w-full bg-transparent py-3 outline-none"
                    />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn w-full border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
                >
                    {loading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating...
                    </>
                    ) : (
                    <>
                        <Send className="h-5 w-5" />
                        Generate Reset Link
                    </>
                    )}
                </button>
                </form>

                {resetLink && (
                <div className="mt-8 rounded-2xl border border-[#0b5f68]/20 bg-[#0b5f68]/5 p-5">
                    <p className="text-sm font-bold text-[#2c2935]">
                    Local development reset link:
                    </p>

                    <a
                    href={resetLink}
                    className="mt-3 block break-all text-sm font-semibold text-[#0b5f68] hover:text-[#ff7900]"
                    >
                    {resetLink}
                    </a>

                    <p className="mt-3 text-xs font-semibold text-slate-500">
                    In production, do not show this link on screen. Send it by
                    email instead.
                    </p>
                </div>
                )}
            </div>
            </div>
        </section>
      </main>
    </>
  );
}