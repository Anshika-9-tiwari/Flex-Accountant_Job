// src/app/reset-password/page.tsx
"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Lock } from "lucide-react";
import MarketingHeader from "@/Components/Layouts/MarketingHeader";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(params.get("token") || "");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to reset password.");
        return;
      }

      setNewPassword("");
      setConfirmPassword("");
      setResetDone(true);
      setSuccess("Password reset successfully. You can now login.");
    } catch {
      setError("Something went wrong while resetting password.");
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
                        <Lock className="h-8 w-8 text-[#ff7900]" />
                    </div>

                    <h1 className="mt-8 text-4xl font-extrabold leading-tight">
                        Create a new password
                    </h1>

                    <p className="mt-5 max-w-md text-base leading-7 text-white/80">
                        Use a secure password with at least 8 characters.
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
                        Reset Password
                     </p>

                     <h2 className="text-3xl font-extrabold text-[#2c2935]">
                        Set new password
                     </h2>

                     <p className="mt-3 text-sm leading-6 text-slate-500">
                        Enter and confirm your new password below.
                     </p>
                    </div>

                    {!token && (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm  font-semibold text-red-600">
                       Reset token is missing. Please generate a new reset link.
                    </div>
                    )}

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

                    {!resetDone ? (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                            New Password
                          </label>

                          <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                              <KeyRound className="mr-3 h-5 w-5 text-[#ff7900]" />
                              <input
                                type="password"
                                required
                                minLength={8}
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                placeholder="Enter new password"
                                className="w-full bg-transparent py-3 outline-none"
                               />
                           </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                                Confirm Password
                            </label>

                            <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                                <Lock className="mr-3 h-5 w-5 text-[#ff7900]" />
                                <input
                                type="password"
                                required
                                minLength={8}
                                value={confirmPassword}
                                onChange={(event) =>
                                setConfirmPassword(event.target.value)
                                }
                                placeholder="Confirm new password"
                                className="w-full bg-transparent py-3 outline-none"
                                />
                            </div>
                        </div>

                        <button
                        type="submit"
                        disabled={loading || !token}
                        className="btn w-full border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
                        >
                        {loading ? (
                            <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Resetting...
                            </>
                        ) : (
                            <>
                            <Lock className="h-5 w-5" />
                            Reset Password
                            </>
                        )}
                        </button>
                    </form>
                    ) : (
                    <div className="mt-8 rounded-2xl bg-green-50 p-6 text-center">
                        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />

                        <h3 className="mt-4 text-xl font-extrabold text-[#2c2935]">
                        Password changed
                        </h3>

                        <p className="mt-2 text-sm font-semibold text-slate-500">
                        You can now login with your new password.
                        </p>

                        <Link
                        href="/login"
                        className="btn mt-6 border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
                        >
                        Go to Login
                        </Link>
                    </div>
                    )}
               </div>
           </div>
        </section>
     </main>
   </>
  );
}