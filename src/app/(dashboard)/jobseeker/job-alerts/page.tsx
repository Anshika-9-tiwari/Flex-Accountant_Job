// src/app/(dashboard)/jobseeker/job-alerts/page.tsx

"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Bell,
  BellOff,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  Edit,
  Loader2,
  MapPin,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";

type JobAlert = {
  id: string;
  userId: string;
  title: string;
  keyword: string | null;
  location: string | null;
  category: string | null;
  frequency: string;
  isActive: boolean;
  createdAt: string;
};

const categories = [
  "Any Category",
  "Accounting",
  "Bookkeeping",
  "Tax Preparation",
  "Audit",
  "Payroll",
  "Accounts Payable",
  "Accounts Receivable",
  "Financial Analyst",
  "Controller/CFO",
  "Accounting Manager",
];

const frequencies = ["Daily", "Weekly", "Immediately"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function emptyForm() {
  return {
    title: "",
    keyword: "",
    location: "",
    category: "Any Category",
    frequency: "Daily",
    isActive: true,
  };
}

export default function JobseekerJobAlertsPage() {
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([]);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  useEffect(() => {
    async function fetchJobAlerts() {
      try {
        const response = await fetch("/api/jobseeker/job-alerts", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch job alerts.");
          return;
        }

        setJobAlerts(data.jobAlerts || []);
      } catch {
        setError("Something went wrong while loading job alerts.");
      } finally {
        setLoading(false);
      }
    }

    fetchJobAlerts();
  }, []);

  const filteredAlerts = useMemo(() => {
    return jobAlerts.filter((alert) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        alert.title.toLowerCase().includes(keyword) ||
        (alert.keyword || "").toLowerCase().includes(keyword) ||
        (alert.location || "").toLowerCase().includes(keyword) ||
        (alert.category || "").toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All Status" ||
        (statusFilter === "Active" && alert.isActive) ||
        (statusFilter === "Paused" && !alert.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [jobAlerts, search, statusFilter]);

  const totalAlerts = jobAlerts.length;
  const activeAlerts = jobAlerts.filter((alert) => alert.isActive).length;
  const pausedAlerts = jobAlerts.filter((alert) => !alert.isActive).length;

  function updateFormField(field: keyof ReturnType<typeof emptyForm>, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm());
    setEditingId("");
  }

  function startEditing(alert: JobAlert) {
    setEditingId(alert.id);
    setForm({
      title: alert.title,
      keyword: alert.keyword || "",
      location: alert.location || "",
      category: alert.category || "Any Category",
      frequency: alert.frequency || "Daily",
      isActive: alert.isActive,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = {
        title: form.title,
        keyword: form.keyword,
        location: form.location,
        category: form.category === "Any Category" ? "" : form.category,
        frequency: form.frequency,
        isActive: form.isActive,
      };

      const response = await fetch(
        editingId
          ? `/api/jobseeker/job-alerts/${editingId}`
          : "/api/jobseeker/job-alerts",
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to save job alert.");
        return;
      }

      if (editingId) {
        setJobAlerts((currentAlerts) =>
          currentAlerts.map((alert) =>
            alert.id === editingId ? data.jobAlert : alert
          )
        );
      } else {
        setJobAlerts((currentAlerts) => [data.jobAlert, ...currentAlerts]);
      }

      setSuccess(
        editingId
          ? "Job alert updated successfully."
          : "Job alert created successfully."
      );

      resetForm();
    } catch {
      setError("Something went wrong while saving job alert.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleAlert(alert: JobAlert) {
    setError("");
    setSuccess("");
    setUpdatingId(alert.id);

    try {
      const response = await fetch(`/api/jobseeker/job-alerts/${alert.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: alert.title,
          keyword: alert.keyword || "",
          location: alert.location || "",
          category: alert.category || "",
          frequency: alert.frequency,
          isActive: !alert.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update alert.");
        return;
      }

      setJobAlerts((currentAlerts) =>
        currentAlerts.map((currentAlert) =>
          currentAlert.id === alert.id ? data.jobAlert : currentAlert
        )
      );

      setSuccess(
        !alert.isActive ? "Job alert activated." : "Job alert paused."
      );
    } catch {
      setError("Something went wrong while updating job alert.");
    } finally {
      setUpdatingId("");
    }
  }

  async function deleteAlert(alertId: string) {
    setError("");
    setSuccess("");
    setDeletingId(alertId);

    try {
      const response = await fetch(`/api/jobseeker/job-alerts/${alertId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete job alert.");
        return;
      }

      setJobAlerts((currentAlerts) =>
        currentAlerts.filter((alert) => alert.id !== alertId)
      );

      if (editingId === alertId) {
        resetForm();
      }

      setSuccess("Job alert deleted successfully.");
    } catch {
      setError("Something went wrong while deleting job alert.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0b5f68] to-[#083f46] p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Job Alerts
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Manage your job alerts
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              Create alerts for accounting jobs based on keyword, category,
              location, and frequency.
            </p>
          </div>

          <Link
            href="/jobs"
            className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
          >
            <BriefcaseBusiness className="h-5 w-5" />
            Browse Jobs
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total Alerts</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {totalAlerts}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Active Alerts</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {activeAlerts}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Paused Alerts</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {pausedAlerts}
          </h2>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
          {success}
        </div>
      )}

      <section className="grid gap-8 xl:grid-cols-[420px_1fr]">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-2xl bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[#2c2935]">
                {editingId ? "Edit Alert" : "Create Alert"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Save your preferred job search criteria.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
              {editingId ? <Edit className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Alert Title
              </label>

              <input
                type="text"
                required
                value={form.title}
                onChange={(event) => updateFormField("title", event.target.value)}
                placeholder="Example: Remote bookkeeping jobs"
                className="input input-bordered h-13 w-full rounded-xl bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Keyword
              </label>

              <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                <Search className="mr-3 h-5 w-5 text-[#ff7900]" />
                <input
                  type="text"
                  value={form.keyword}
                  onChange={(event) =>
                    updateFormField("keyword", event.target.value)
                  }
                  placeholder="Bookkeeper, Tax, QuickBooks"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Location
              </label>

              <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                <MapPin className="mr-3 h-5 w-5 text-[#ff7900]" />
                <input
                  type="text"
                  value={form.location}
                  onChange={(event) =>
                    updateFormField("location", event.target.value)
                  }
                  placeholder="Remote, New York, USA"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Category
              </label>

              <select
                value={form.category}
                onChange={(event) =>
                  updateFormField("category", event.target.value)
                }
                className="select select-bordered h-13 w-full rounded-xl bg-white"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Frequency
              </label>

              <select
                value={form.frequency}
                onChange={(event) =>
                  updateFormField("frequency", event.target.value)
                }
                className="select select-bordered h-13 w-full rounded-xl bg-white"
              >
                {frequencies.map((frequency) => (
                  <option key={frequency}>{frequency}</option>
                ))}
              </select>
            </div>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-base-300 px-4 py-3">
              <span className="text-sm font-semibold text-[#2c2935]">
                Alert Active
              </span>

              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  updateFormField("isActive", event.target.checked)
                }
                className="toggle toggle-warning"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="submit"
                disabled={saving}
                className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    {editingId ? "Update Alert" : "Create Alert"}
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Alert List */}
        <div className="space-y-6">
          {/* Filters */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[1fr_200px]">
              <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                <Search className="mr-3 h-5 w-5 text-[#ff7900]" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search alerts..."
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="select select-bordered h-13 w-full rounded-xl bg-white"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Paused</option>
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-72 items-center justify-center rounded-2xl bg-white shadow-sm">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7900]" />
                <p className="mt-3 text-sm font-semibold text-slate-500">
                  Loading job alerts...
                </p>
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading && filteredAlerts.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff7900]/10 text-[#ff7900]">
                <Bell className="h-8 w-8" />
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-[#2c2935]">
                No job alerts found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Create your first job alert to track jobs matching your
                accounting career preferences.
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && filteredAlerts.length > 0 && (
            <div className="space-y-5">
              {filteredAlerts.map((alert) => (
                <article
                  key={alert.id}
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex flex-col justify-between gap-6 xl:flex-row">
                    <div className="min-w-0 flex-1">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        {alert.isActive ? (
                          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                            <Bell className="h-4 w-4" />
                            ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                            <BellOff className="h-4 w-4" />
                            PAUSED
                          </span>
                        )}

                        <span className="rounded-full bg-[#ff7900]/10 px-3 py-1 text-xs font-bold text-[#ff7900]">
                          {alert.frequency}
                        </span>

                        {alert.category && (
                          <span className="rounded-full bg-[#0b5f68]/10 px-3 py-1 text-xs font-bold text-[#0b5f68]">
                            {alert.category}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl font-extrabold text-[#2c2935]">
                        {alert.title}
                      </h2>

                      <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-500 md:grid-cols-2 xl:grid-cols-4">
                        <span className="inline-flex items-center gap-2">
                          <Search className="h-4 w-4 text-[#ff7900]" />
                          {alert.keyword || "Any keyword"}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#ff7900]" />
                          {alert.location || "Any location"}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <BriefcaseBusiness className="h-4 w-4 text-[#ff7900]" />
                          {alert.category || "Any category"}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#ff7900]" />
                          Created {formatDate(alert.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-3 xl:w-[190px]">
                      <button
                        type="button"
                        onClick={() => startEditing(alert)}
                        className="btn border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
                      >
                        <Edit className="h-5 w-5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={updatingId === alert.id}
                        onClick={() => toggleAlert(alert)}
                        className={
                          alert.isActive
                            ? "btn border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                            : "btn border-none bg-green-600 text-white hover:bg-green-700"
                        }
                      >
                        {updatingId === alert.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : alert.isActive ? (
                          <BellOff className="h-5 w-5" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5" />
                        )}

                        {alert.isActive ? "Pause" : "Activate"}
                      </button>

                      <button
                        type="button"
                        disabled={deletingId === alert.id}
                        onClick={() => deleteAlert(alert.id)}
                        className="btn border border-red-200 bg-white text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        {deletingId === alert.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </section>
  );
}