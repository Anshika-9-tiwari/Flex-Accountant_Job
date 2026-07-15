// app/how-it-works/page.tsx
"use client"

import Image from "next/image";
import Link from "next/link";

export default function WhyFlexAccounting() {
  return (
    <main className="bg-white text-[#2f2b3f]">

      {/* CTA Section */}
      <section className=" bg-gradient-to-br from-[#144e75] via-[#073947] to-[#022e27]">
        <div className="max-w-7xl mx-auto px-8 md:px-10 py-20 text-center ">
          <h2 className="text-[32px] md:text-[44px] font-bold leading-tight tracking-wide text-white max-w-6xl">
            Over 1 Million Job Seekers Have Used Flex-Accountant to Find a
            Better Way to Work
          </h2>
          <div className="w-30 h-1 bg-[#ff7900] mx-auto md:mx-[45%] mt-6 mb-18"></div>

          <div className="flex justify-center ">
            <Link
              href="/jobseeker/register"
              className="btn bg-gray-100 hover:bg-gray-200 border-none text-[#25232e] text-xl font-bold px-16 h-16 rounded-xl shadow-md"
            >
              Find Your Next WFH Job!
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-24">
        <div className="text-center">
          <h1 className="text-[32px] md:text-[44px] font-bold  tracking-wide text-[#2e2b3b]">
             Why Flex-Accountant Started
          </h1>

          {/* Orange curved underline */}
          <div className="flex justify-center mt-1">
            <svg
              width="400"
              height="45"
              viewBox="0 0 460 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="max-w-full"
            >
              <path
                d="M10 5C95 65 220 5 320 16C375 22 420 40 450 47"
                stroke="#ff7a00"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>
        </div>

        <p className="mt-10 max-w-6xl mx-auto text-center md:text-left text-lg md:text-xl leading-9 tracking-wide text-[#282435]">
          Flex-Accountant work from home jobs site was created in 2018 to
          provide a trusted, more effective, friendly, and overall better way to
          find professional, remote, and flexible jobs.
        </p>

        <div className="mt-15 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-18 items-center">
          {/* Left Image */}
          <div className="flex justify-center lg:justify-between">
            <div className="relative w-[320px] h-[320px] md:w-[440px] md:h-[440px] rounded-full border-[3px] border-[#ff7a00] overflow-hidden shadow-md">
              <Image
                src="/why-flexaccountant.jpeg"
                alt="Flexible accounting job"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right Text */}
          <div className="space-y-5 text-lg  leading-10 tracking-wide text-[#282435]">
            <p>
              We were founded by job space pioneer Sara Sutton after she had been looking for a flexible job after starting her family. She realized that millions of others were just as frustrated by the ads, scams, and inefficiencies on other job boards that wasted her time in finding a good, flexible job, so she decided to create the solution she was looking for.
            </p>

            <p>
              <span className="text-[#ff7900]">It wasn’t our original intention, but somehow Flex-Accountant has become a leader in the flexible job movement that's currently disrupting the traditional workforce.</span> We seem to show up in the
              press weekly as people turn to us for guidance.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}