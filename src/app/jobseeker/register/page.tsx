// app/jobseeker/register/page.tsx
import JobSeekerRegisterForm from "@/Components/auth/JobSeekerRegisterForm";
import Footer from "@/Components/Layouts/Footer";
import MarketingHeader from "@/Components/Layouts/MarketingHeader";

export default function JobSeekerRegisterPage() {
  return (
    <main className="bg-white text-[#3e3a4e]">
      <MarketingHeader/>
      <section>
        <JobSeekerRegisterForm />
      </section>
      <Footer/>
    </main>
  );
}