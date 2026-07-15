"use client"
import {  BadgeCheck, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";

const cards = [
  { 
    icon: UserRound,
    title: "Job-Seeker First",
    text: "Unlike other job boards, we prioritize jobs that match your needs.",
  },
  { 
    icon: BadgeCheck,
    title: "Double-Screened Verified",
    text: "Say goodbye to worrying about ads, scams, or junk listings.",
  },
  { 
    icon: ShieldCheck,
    title: "High-Quality Jobs",
    text: "We curate remote jobs with important details like salary ranges and benefits.",
  },
];

export default function OrdinaryJobBoardSection() {
  return (
    <section className="bg-gray-100 py-22">
      <div className="mx-auto max-w-7xl px-8">
        <h2 className="text-center font-heading text-[34px] md:text-[44px] font-bold text-[#2c2935]">
          We’re not an ordinary job board.
        </h2>

        <div className="w-30 h-1 bg-[#ff7900] mx-auto md:mx-[45%] mt-6 "></div>

        <div className="mt-16 md:mt-20 grid gap-8 md:grid-cols-3 px-10">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="card border border-orange-100 rounded-xl bg-base-100 hover:scale-105 transition shadow-md hover:shadow-xl py-2"
              >
                <div className="card-body gap-6 ">
                  <div className="w-12 h-12 flex justify-center items-center bg-orange-100 shadow-sm rounded-full ">
                    <Icon className="w-6 h-6 text-[#ff7900]" />
                  </div>
                  <h3 className="card-title text-[22px] text-gray-700 font-semibold">
                    {card.title}
                  </h3>
                <p className="text-slate-600">{card.text}</p>
              </div>
             </div>
            )
          })}
        </div>

        <div className="mt-20 text-center">
          <Link href="/jobs" className="btn bg-[#ff7900] w-full max-w-2xl text-xl text-white py-7 shadow rounded-xl">
            Find Your Next WFH Job!
          </Link>
        </div>
      </div>
    </section>
  );
}