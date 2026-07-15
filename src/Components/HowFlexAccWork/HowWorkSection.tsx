"use client"
import {  BadgeCheck, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";

const cards = [
  { 
    icon: UserRound,
    title: "Explore Verified Job",
    text: "All of Flex-Accountant remote jobs and flexible opportunities , When you log in, you’ll only find high-quality opportunities—no scams, junk listings, or commission-only roles.",
  },
  { 
    icon: BadgeCheck,
    title: "Find Smarter, Apply Faster",
    text: "Use advanced search filters to find roles that match your skills, & preferences. Save searches, track applications, & follow companies to stay updated on new openings.",
  },
  { 
    icon: ShieldCheck,
    title: "Access Career Support , Resources",
    text: "Get expert guidance with webinars, downloadable guides, job search articles, and more, all designed to help you land the right job faster.",
  },
];

export default function HowWorkSection() {
  return (
    <section className="bg-base-200 py-22">
      <div className="mx-auto max-w-7xl px-8">
        <div className="flex flex-col gap-5 items-center justify-center">
          <h2 className="text-center font-heading text-[34px] md:text-[44px] font-bold text-[#2c2935]">
             How Flex-Accountant Works?
          </h2>
          <div className="w-30 h-1 max-auto bg-orange-600 "></div>
        </div>

        {/* card section */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="card border border-orange-100 rounded-2xl bg-base-100 hover:scale-105 transition-all shadow-md hover:shadow-xl"
              >
                <div className="card-body gap-6 border-t-5 border-[#ff7900] rounded-2xl">
                  <div className="w-12 h-12 mb-4 inline-flex rounded-full bg-[#ff7900]/10 p-3 text-[#ff7900]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="card-title text-[20px] text-gray-700 font-semibold">
                    {card.title}
                  </h3>
                <p className="leading-6 text-[14px] text-slate-600">{card.text}</p>
              </div>
             </div>
            )
          })}
        </div>

        <div className="mt-24 text-center">
          <Link href="/pricing" className="btn bg-[#ff7900] w-full max-w-2xl text-[18px] text-white py-7 shadow rounded-xl">
            Know more about  Flex-accountant!
          </Link>
        </div>
      </div>
    </section>
  );
}