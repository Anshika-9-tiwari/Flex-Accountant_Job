"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { BriefcaseBusiness, Loader2, Lock, Mail } from "lucide-react";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role");
  const next = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      const fallbackRedirect =
        role === "employer"
          ? "/employer/dashboard"
          : role === "admin"
          ? "/admin/dashboard"
          : "/jobseeker/dashboard";

      router.push(next || data.redirectTo || fallbackRedirect);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const registerLink =
    role === "employer" ? "/employer/register" : "/jobseeker/register";

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-10">
      <section className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        {/* Left */}
        <div className="bg-gradient-to-br from-[#0b5f68] to-[#083f46] p-8 text-white sm:p-12">
          <Link href="/" className="text-3xl font-extrabold">
            <span className="text-[#ff7900]">flex</span>
            <span className="text-white">-accountant</span>
          </Link>

          <div className="mt-20">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-6 py-2 text-sm font-semibold">
              Account Login
            </p>

            <h1 className="text-4xl font-extrabold leading-tight">
              Sign in to your dashboard
            </h1>

            <p className="mt-5 max-w-md leading-7 text-white/85">
              Use one login page for jobseekers, employers, and admins. Your
              account role will automatically send you to the correct dashboard.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="p-6 sm:p-10">
          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff7900]/10 text-[#ff7900]">
                <BriefcaseBusiness className="h-7 w-7" />
              </div>

              <h2 className="text-3xl font-extrabold text-[#2c2935]">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Login to continue to Flex-Accountant.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder="Enter your email"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Password
                </label>
                <div className="flex items-center rounded-xl border border-base-300 bg-white px-4 mb-1">
                  <Lock className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>

                {/* Forgot Password */}
                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-[#2c2935] hover:text-[#ff7900]"
                  >
                    Forgot password?
                  </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn w-full border-none bg-[#ff7900] text-white hover:bg-[#e86e00] py-3 text-lg font-medium rounded-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Do not have an account?{" "}
              <Link
                href={registerLink}
                className="font-bold text-[#ff7900] hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}