"use client"
import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="bg-base-100 py-16 md:py-18">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-8 lg:grid-cols-2">
        <div>
          <h1 className="font-heading text-[36px] md:text-[42px] font-bold text-[#2c2a33] leading-snug">
            About {" "} <span className="text-[#ff7900] ">Flex-Accountant</span>  
          </h1>
          <div className="mt-2 w-30 h-1 max-auto  bg-[#ff7900] rounded  "></div>

          <p className="mt-8 text-[18px] leading-relaxed text-gray-700">
            Since 2018, Flex-Accountant has been the #1 job site for finding the best remote, work-from-home, and flexible jobs. With extensive experience, we specialize in helping job seekers navigate the remote job market with confidence.
          </p>
          <p className="mt-5 text-[18px] leading-relaxed text-gray-700">
            Our expert team hand-screens every job listing to ensure legitimacy, saving you time and protecting you from scams. Whether you're looking for full-time, part-time, freelance, or flexible schedule opportunities, <span className="text-[#ff7900]">Flex-Accountant makes the job search faster, easier, and safer so you can focus on landing the right role.</span>  
          </p> 

          <Link href="/jobs" className="btn  bg-[#ff7900] mt-15 w-full max-w-xl text-xl text-white py-8 rounded-lg shadow">
            Find Your Next WFH Job!
          </Link>
        </div>

        <div className="flex justify-center">
            <div className="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px] rounded-full border-[3px] border-[#ff7a00] overflow-hidden shadow-md">
                <Image
                src="/about_flex-job.jpeg"
                alt="Remote accounting jobs"
                fill
                className="object-cover"
                priority
                />
            </div>
          </div>
      </div>
    </section>
  );
}