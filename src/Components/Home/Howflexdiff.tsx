"use client"
import Link from "next/link";
import { Search, BadgeCheck, Sparkles } from "lucide-react";

const features = [
  {
    title: "Higher-Quality WFH Job Listings",
    description:
      "Find legitimate work-from-home jobs with options for flexible hours and hybrid work.",
  },
  {
    title: "Unlimited Job Search Resources",
    description:
      "Full access to all features, including unlimited online jobs, articles, and webinars to help you with your remote job search.",
  },
  {
    title: "Save Time",
    description:
      "Go straight from online job listings to applications. No more hopping from one job board to the next to find jobs from home.",
  },
];

const employerBenefits = [
  "Flexible job advertising solutions",
  "Powerful resume search tools",
  "Access to qualified independent contractors for flexible hiring",
  "Seamless integration with 50+ applicant tracking systems",
  "Effective email and display ad campaigns",
];

export default function HowFlexDiff() {
  return (
    <main className="min-h-screen bg-white text-[#2c2935]">

      <section className="border-t border-transparent bg-white px-8 md:px-15 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-[#ff7900]/10 px-4 py-2 text-sm font-bold text-[#ff7900]">
              <Sparkles className="h-4 w-4" />
                flex-accountant matters
            </p>

            <h2 className="font-heading text-3xl font-extrabold leading-tight text-[#24222b] sm:text-4xl md:text-[46px]">
              How is Flex Accounting <span className="text-[#ff7900]">different?</span>
            </h2>

            <div className="mx-auto mt-6 h-1.5 w-24 rounded-full bg-[#ff7900]"/>
          </div>

          <div className="mt-20 grid items-center gap-14 lg:grid-cols-2">
            <div className="space-y-10">
              {features.map((item) => (
                <div key={item.title} className="flex gap-5">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-orange-300 bg-white">
                    <BadgeCheck className="h-4 w-4 text-[#ff7900]" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold tracking-wide text-[#2c2a31]">
                      {item.title}
                    </h2>
                    <p className="mt-3 max-w-xl text-lg leading-relaxed text-[#25222f]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}

              <Link
                href="/jobseeker/register"
                className="btn mt-10 h-16 w-full max-w-xl rounded-lg border-none bg-[#ff7900] text-xl font-bold text-white hover:bg-[#e96d00]"
              >
                Get Started
              </Link> 
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative h-[350px] w-full max-w-[480px] overflow-hidden rounded-lg border-2 border-[#ff7900]/50  bg-gray-200 bg-[url('/flex_job.jpg')] bg-cover bg-center shadow-md">
                <div className="absolute inset-0 bg-black/15" />

                  <div className="absolute left-8 right-8 top-1/2 flex -translate-y-1/2 items-center justify-between rounded-2xl border-2 border-orange-300 bg-transparent px-8 py-4 text-slate-700 backdrop-blur-[1px]">
                    <form className="join w-full">
                      <input
                        type="text"
                        placeholder="Search by keyword, title, etc"
                        className="w-full bg-transparent text-xl text-white tracking-wide font-semibold  outline-none"
                      />
                      <button type="submit" className="cursor-pointer">
                        <Search className="h-10 w-10 text-[#ffff]" />
                      </button>
                    </form>
                  </div>
               </div>
             </div>
           </div>
         </div>
      </section>

      <section className="bg-[#f1f6fc] px-8 md:px-15 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-5xl font-heading text-[33px] md:text-[44px] font-bold text-[#2c2935] tracking-wide leading-tight">
            Looking to hire qualified{" "}
            <span className="text-[#ff7900]">accounting talent?</span>
          </h2>

          <p className="mt-6 max-w-5xl text-[21px] font-semibold leading-relaxed text-gray-700">
            Reach our unique talent pool of 947,578 career-driven candidates.
          </p>

          <p className="mt-8 max-w-5xl text-lg leading-relaxed text-[#25222f]">
            Our industry focus and exceptional candidate experience attract job
            seekers that are qualified, dedicated, and ready to grow in their
            accounting careers. Quickly fill your open positions with our suite
            of recruiting tools including:
          </p>

          <ul className="mt-8 list-disc space-y-2 pl-8 text-lg leading-relaxed text-[#25222f]">
            {employerBenefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <Link
            href="/employer/register"
            className="btn mt-10 h-16 w-full max-w-lg rounded-lg border-none bg-[#ff7900] text-xl font-bold text-white hover:bg-[#e96d00]"
          >
            Find Your Next Hire
          </Link>
        </div>
      </section>
    </main>
  );
}