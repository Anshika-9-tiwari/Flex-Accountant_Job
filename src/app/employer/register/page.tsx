// app/employer/register/page.tsx
import EmployerRegisterPage from "@/Components/auth/EmployerRegisterPage";
import Footer from "@/Components/Layouts/Footer";
import MarketingHeader from "@/Components/Layouts/MarketingHeader";

export default function EmployersRegisterPage() {
  return (
    <main className="bg-white text-gray-700">
      <MarketingHeader/>
      <EmployerRegisterPage />
      <Footer/>
    </main>
  );
}0