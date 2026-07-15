// app/login/page.tsx

import LoginPage from "@/Components/auth/LoginPage";
import Footer from "@/Components/Layouts/Footer";
import MarketingHeader from "@/Components/Layouts/MarketingHeader";

export default function LoginPart(){

  return (
    <main className="bg-white text-[#3e3a4e]">
      <MarketingHeader/>
      <section>
        <LoginPage/>
      </section>
      <Footer/>
    </main>
  );
}


