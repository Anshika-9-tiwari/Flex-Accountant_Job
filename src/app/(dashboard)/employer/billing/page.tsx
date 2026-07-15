// src/app/(dashboard)/employer/billing/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Loader2,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

type BillingStatus = "FREE" | "ACTIVE" | "PAST_DUE" | "CANCELLED";
type InvoiceStatus = "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

type EmployerBillingData = {
  company: {
    id: string;
    name: string;
    industry: string | null;
    location: string | null;
    jobs: {
      id: string;
      status: string;
    }[];
  };
  subscription: {
    id: string;
    planName: string;
    price: number;
    currency: string;
    billingCycle: string;
    status: BillingStatus;
    startedAt: string;
    endsAt: string | null;
  };
  invoices: {
    id: string;
    invoiceNumber: string;
    title: string;
    amount: number;
    currency: string;
    status: InvoiceStatus;
    dueDate: string | null;
    paidAt: string | null;
    createdAt: string;
  }[];
  stats: {
    totalJobs: number;
    activeJobs: number;
    pendingJobs: number;
    totalInvoices: number;
    paidInvoices: number;
    pendingInvoices: number;
  };
};

function formatDate(value: string | null) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString()}`;
}

function getInvoiceStatusStyle(status: InvoiceStatus) {
  if (status === "PAID") return "bg-green-50 text-green-700 border-green-200";
  if (status === "PENDING") return "bg-yellow-50 text-yellow-700 border-yellow-200";
  if (status === "OVERDUE") return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

export default function EmployerBillingPage() {
  const [data, setData] = useState<EmployerBillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBilling() {
      try {
        const response = await fetch("/api/employer/billing", {
          credentials: "include",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Failed to fetch billing.");
          return;
        }

        setData(result);
      } catch {
        setError("Something went wrong while loading billing.");
      } finally {
        setLoading(false);
      }
    }

    fetchBilling();
  }, []);

  if (loading) {
    return (
      <section className="flex min-h-72 items-center justify-center rounded-2xl bg-white shadow-sm">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7900]" />
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading billing...
          </p>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-600">
        {error || "Billing data not found."}
      </section>
    );
  }

  const { company, subscription, invoices, stats } = data;

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-[#0b5f68] to-[#083f46] p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Employer Billing
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Billing and subscription
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              View your current plan, billing status, invoices, and employer
              usage.
            </p>
          </div>

          <Link
            href="/pricing"
            className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
          >
            <CreditCard className="h-5 w-5" />
            View Pricing
          </Link>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Current Plan</p>
          <h2 className="mt-2 text-2xl font-bold text-[#2c2935]">
            {subscription.planName}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Monthly Price</p>
          <h2 className="mt-2 text-2xl font-bold text-[#2c2935]">
            {formatMoney(subscription.price, subscription.currency)}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Posted Jobs</p>
          <h2 className="mt-2 text-3xl font-bold text-[#2c2935]">
            {stats.totalJobs}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Invoices</p>
          <h2 className="mt-2 text-3xl font-bold text-[#2c2935]">
            {stats.totalInvoices}
          </h2>
        </div>
      </div>

      <section className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Subscription Details
                </h2>
                <p className="text-sm text-slate-500">
                  Your active employer subscription.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#f5f7fb] p-5">
                <p className="text-xs font-bold uppercase text-slate-400">
                  Plan
                </p>
                <p className="mt-2 text-lg font-extrabold text-[#2c2935]">
                  {subscription.planName}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f5f7fb] p-5">
                <p className="text-xs font-bold uppercase text-slate-400">
                  Status
                </p>
                <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {subscription.status}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f5f7fb] p-5">
                <p className="text-xs font-bold uppercase text-slate-400">
                  Billing Cycle
                </p>
                <p className="mt-2 text-lg font-extrabold text-[#2c2935]">
                  {subscription.billingCycle}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f5f7fb] p-5">
                <p className="text-xs font-bold uppercase text-slate-400">
                  Started
                </p>
                <p className="mt-2 text-lg font-extrabold text-[#2c2935]">
                  {formatDate(subscription.startedAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Invoices
                </h2>
                <p className="text-sm text-slate-500">
                  Billing invoice history.
                </p>
              </div>

              <ReceiptText className="h-7 w-7 text-[#ff7900]" />
            </div>

            {invoices.length === 0 ? (
              <div className="rounded-2xl bg-[#f5f7fb] p-8 text-center">
                <FileText className="mx-auto h-10 w-10 text-[#ff7900]" />
                <h3 className="mt-4 text-xl font-extrabold text-[#2c2935]">
                  No invoices yet
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Since your current plan is free, invoices may not be generated.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <article
                    key={invoice.id}
                    className="rounded-2xl border border-base-300 p-5"
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <h3 className="font-extrabold text-[#2c2935]">
                          {invoice.title}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {invoice.invoiceNumber} • Created{" "}
                          {formatDate(invoice.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${getInvoiceStatusStyle(
                            invoice.status
                          )}`}
                        >
                          {invoice.status}
                        </span>

                        <span className="font-extrabold text-[#2c2935]">
                          {formatMoney(invoice.amount, invoice.currency)}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b5f68] text-white">
              <Building2 className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-xl font-extrabold text-[#2c2935]">
              {company.name}
            </h3>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {company.industry || "Industry not added"}
            </p>

            <div className="mt-5 space-y-3 text-sm font-semibold text-slate-500">
              <p>{company.location || "Location not added"}</p>
              <p>{stats.activeJobs} active jobs</p>
              <p>{stats.pendingJobs} pending jobs</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0b5f68] p-6 text-white shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Clock className="h-7 w-7 text-[#ff7900]" />
            </div>

            <h3 className="mt-5 text-xl font-extrabold">Billing Note</h3>

            <p className="mt-3 text-sm leading-6 text-white/85">
              Your current employer plan is free. This billing page is prepared
              for future paid plans and invoice tracking.
            </p>
          </div>
        </aside>
      </section>
    </section>
  );
}