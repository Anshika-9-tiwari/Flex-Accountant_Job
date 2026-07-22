"use client";

import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";

const cards = [
  {
    icon: UserRound,
    title: "Job-Seeker First",
    text: "We focus on flexible accounting roles that help you find better work without wasting time on irrelevant listings.",
    points: ["Remote-first roles", "Accounting-focused jobs", "Cleaner search experience"],
  },
  {
    icon: BadgeCheck,
    title: "Verified Listings",
    text: "Jobs are reviewed before being shown, helping reduce scams, junk posts, and low-quality opportunities.",
    points: ["Screened employers", "Less spam", "Trusted job posts"],
  },
  {
    icon: ShieldCheck,
    title: "Quality Over Quantity",
    text: "We highlight useful job details such as job type, location, salary range, benefits, and employer information.",
    points: ["Salary details", "Clear requirements", "Better job matching"],
  },
];

export default function OrdinaryJobBoardSection() {
  return (
    <section className="relative overflow-hidden bg-[#f5f7fb] py-20 sm:py-22">
      {/* Background decoration */}
      <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-[#ff7900]/10 blur-3xl" />
      <div className="absolute bottom-[-140px] right-[-120px] h-80 w-80 rounded-full bg-[#0b5f68]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-[#ff7900]/10 px-4 py-2 text-sm font-bold text-[#ff7900]">
            <Sparkles className="h-4 w-4" />
            Built for accounting professionals
          </p>

          <h2 className="font-heading text-3xl font-extrabold leading-tight text-[#2c2935] sm:text-4xl md:text-[46px]">
            We’re not an ordinary job board.
          </h2>

          <div className="mx-auto mt-6 h-1.5 w-24 rounded-full bg-[#ff7900]" />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Flex-Accountant helps jobseekers find trusted work-from-home
            accounting roles with cleaner listings, better details, and less
            noise.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#ff7900]/40 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff7900]/10 text-[#ff7900] transition group-hover:bg-[#ff7900] group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-7 text-2xl font-extrabold text-[#2c2935]">
                  {card.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {card.text}
                </p>

                <div className="mt-6 space-y-3">
                  {card.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-3 text-sm font-semibold text-slate-600"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#0b5f68]" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-[#0b5f68] p-6 text-center shadow-lg sm:p-8 md:flex md:items-center md:justify-between md:text-left">
          <div>
            <h3 className="text-2xl font-extrabold text-white">
              Ready to find your next WFH accounting job?
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
              Browse remote and flexible roles in bookkeeping, tax, audit,
              payroll, accounting, and finance.
            </p>
          </div>

          <Link
            href="/jobs"
            className="btn mt-6 border-none bg-[#ff7900] px-8 text-base font-bold text-white hover:bg-[#e2720f] md:mt-0"
          >
            Find Your Next WFH Job
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}