import AboutSection from "@/Components/HowFlexAccWork/AboutSection";
import HowWorkSection from "@/Components/HowFlexAccWork/HowWorkSection";
import WhyFlexAccounting from "@/Components/HowFlexAccWork/WhyFlexAccounting";
import Footer from "@/Components/Layouts/Footer";
import MarketingHeader from "@/Components/Layouts/MarketingHeader";

export default function HowFlexAccountantWorksPage() {
  return (
    <>
       <MarketingHeader/>
       <AboutSection />
       <HowWorkSection/>
       <WhyFlexAccounting/>
       <Footer/>  
    </>
  );
}