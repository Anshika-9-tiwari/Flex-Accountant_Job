// src/app/(dashboard)/admin/billing/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Loader2,
  ReceiptText,
  Search,
  XCircle,
} from "lucide-react";

type BillingStatus = "FREE" | "ACTIVE" | "PAST_DUE" | "CANCELLED";
type InvoiceStatus = "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

type AdminBillingData = {
  stats: {
    totalSubscriptions: number;
    freeSubscriptions: number;
    activeSubscriptions: number;
    cancelledSubscriptions: number;
    totalInvoices: number;
    paidInvoices: number;
    pendingInvoices: number;
    totalRevenue: number;
  };
  subscriptions: {
    id: string;
    planName: string;
    price: number;
    currency: string;
    billingCycle: string;
    status: BillingStatus;
    startedAt: string;
    endsAt: string | null;
    company: {
      id: string;
      name: string;
      industry: string | null;
      location: string | null;
      jobs: {
        id: string;
      }[];
    };
    invoices: {
      id: string;
      status: InvoiceStatus;
      amount: number;
    }[];
  }[];
  invoices: {
    id: string;
    invoiceNumber: string;
    title: string;
    amount: number;
    currency: string;
    status: InvoiceStatus;
    createdAt: string;
    dueDate: string | null;
    paidAt: string | null;
    company: {
      id: string;
      name: string;
    };
  }[];
};

function formatDate(value: string | null) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatMoney(amount: number, currency = "USD") {
  return `${currency} ${amount.toLocaleString()}`;
}

function getBillingStatusStyle(status: BillingStatus) {
  if (status === "FREE" || status === "ACTIVE") {
    return "bg-green-50 text-green-700 border-green-200";
  }

  if (status === "PAST_DUE") {
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }

  return "bg-red-50 text-red-700 border-red-200";
}

function getInvoiceStatusStyle(status: InvoiceStatus) {
  if (status === "PAID") return "bg-green-50 text-green-700 border-green-200";
  if (status === "PENDING") return "bg-yellow-50 text-yellow-700 border-yellow-200";
  if (status === "OVERDUE") return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

export default function AdminBillingPage() {
  const [data, setData] = useState<AdminBillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  useEffect(() => {
    async function fetchBilling() {
      try {
        const response = await fetch("/api/admin/billing", {
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

  const filteredSubscriptions = useMemo(() => {
    const subscriptions = data?.subscriptions || [];

    return subscriptions.filter((subscription) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        subscription.company.name.toLowerCase().includes(keyword) ||
        subscription.planName.toLowerCase().includes(keyword) ||
        (subscription.company.industry || "").toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All Status" || subscription.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  async function updateSubscriptionStatus(
    subscriptionId: string,
    status: BillingStatus
  ) {
    setError("");
    setSuccess("");
    setUpdatingId(subscriptionId);

    try {
      const response = await fetch(
        `/api/admin/billing/subscriptions/${subscriptionId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to update subscription.");
        return;
      }

      setData((currentData) => {
        if (!currentData) return currentData;

        return {
          ...currentData,
          subscriptions: currentData.subscriptions.map((subscription) =>
            subscription.id === subscriptionId
              ? {
                  ...subscription,
                  status,
                }
              : subscription
          ),
        };
      });

      setSuccess("Subscription status updated successfully.");
    } catch {
      setError("Something went wrong while updating subscription.");
    } finally {
      setUpdatingId("");
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-72 items-center justify-center rounded-2xl bg-white shadow-sm">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7900]" />
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading admin billing...
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

  const stats = data.stats;

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-[#0b5f68] to-[#083f46] p-6 text-white shadow-md sm:p-8">
        <div>
          <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
            Admin Billing
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Platform billing overview
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
            View subscriptions, invoices, revenue, and company billing status
            across the platform.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Subscriptions</p>
          <h2 className="mt-2 text-2xl font-bold text-[#2c2935]">
            {stats.totalSubscriptions}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Free Plans</p>
          <h2 className="mt-2 text-2xl font-bold text-[#2c2935]">
            {stats.freeSubscriptions}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Invoices</p>
          <h2 className="mt-2 text-2xl font-bold text-[#2c2935]">
            {stats.totalInvoices}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Revenue</p>
          <h2 className="mt-2 text-2xl font-bold text-[#2c2935]">
            {formatMoney(stats.totalRevenue)}
          </h2>
        </div>
      </div>

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
          {success}
        </div>
      )}

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
            <Search className="mr-3 h-5 w-5 text-[#ff7900]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search company, plan, or industry..."
              className="w-full bg-transparent py-3 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="select select-bordered h-13 w-full rounded-xl bg-white"
          >
            <option>All Status</option>
            <option value="FREE">Free</option>
            <option value="ACTIVE">Active</option>
            <option value="PAST_DUE">Past Due</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <section className="grid gap-8 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          {filteredSubscriptions.map((subscription) => (
            <article
              key={subscription.id}
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex flex-col justify-between gap-6 xl:flex-row">
                <div className="min-w-0 flex-1">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getBillingStatusStyle(
                        subscription.status
                      )}`}
                    >
                      {subscription.status}
                    </span>

                    <span className="rounded-full bg-[#ff7900]/10 px-3 py-1 text-xs font-bold text-[#ff7900]">
                      {subscription.planName}
                    </span>
                  </div>

                  <h2 className="text-2xl font-extrabold text-[#2c2935]">
                    {subscription.company.name}
                  </h2>

                  <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-500 md:grid-cols-4">
                    <span className="inline-flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#ff7900]" />
                      {subscription.company.industry || "Industry not added"}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-[#ff7900]" />
                      {formatMoney(subscription.price, subscription.currency)}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <BriefcaseBusinessIcon />
                      {subscription.company.jobs.length} jobs
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#ff7900]" />
                      {formatDate(subscription.startedAt)}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-3 xl:w-[200px]">
                  <select
                    value={subscription.status}
                    disabled={updatingId === subscription.id}
                    onChange={(event) =>
                      updateSubscriptionStatus(
                        subscription.id,
                        event.target.value as BillingStatus
                      )
                    }
                    className="select select-bordered h-12 w-full rounded-xl bg-white"
                  >
                    <option value="FREE">Free</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PAST_DUE">Past Due</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                  {updatingId === subscription.id && (
                    <p className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}

          {filteredSubscriptions.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <CreditCard className="mx-auto h-10 w-10 text-[#ff7900]" />
              <h2 className="mt-5 text-2xl font-extrabold text-[#2c2935]">
                No subscriptions found
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                No billing subscriptions match your current filters.
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#2c2935]">
                Recent Invoices
              </h2>

              <ReceiptText className="h-6 w-6 text-[#ff7900]" />
            </div>

            {data.invoices.length === 0 ? (
              <p className="text-sm leading-6 text-slate-500">
                No invoices created yet.
              </p>
            ) : (
              <div className="space-y-4">
                {data.invoices.slice(0, 8).map((invoice) => (
                  <article
                    key={invoice.id}
                    className="rounded-2xl bg-[#f5f7fb] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-extrabold text-[#2c2935]">
                          {invoice.company.name}
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {invoice.invoiceNumber}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${getInvoiceStatusStyle(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </div>

                    <p className="mt-3 font-extrabold text-[#2c2935]">
                      {formatMoney(invoice.amount, invoice.currency)}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      Created {formatDate(invoice.createdAt)}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-[#0b5f68] p-6 text-white shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <FileText className="h-7 w-7 text-[#ff7900]" />
            </div>

            <h3 className="mt-5 text-xl font-extrabold">Billing Note</h3>

            <p className="mt-3 text-sm leading-6 text-white/85">
              This page tracks free and paid subscription status. Payment gateway
              integration can be added later without changing dashboard routes.
            </p>
          </div>
        </aside>
      </section>
    </section>
  );
}

function BriefcaseBusinessIcon() {
  return <CheckCircle2 className="h-4 w-4 text-[#ff7900]" />;
}