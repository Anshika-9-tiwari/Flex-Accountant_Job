import AccountingCategoriesSection from "@/Components/Home/AccountingCategories";
import CTASection from "@/Components/Home/CTASection";
import HomeHero from "@/Components/Home/HomeHero";
import HowFlexDiff from "@/Components/Home/Howflexdiff";
import OrdinaryJobBoardSection from "@/Components/Home/OrdinaryJobBoardSection";
import Footer from "@/Components/Layouts/Footer";
import MarketingHeader from "@/Components/Layouts/MarketingHeader";

export default function HomePage() {
  return (
    <>
      <MarketingHeader/>
      <HomeHero />
      <AccountingCategoriesSection/>
      <OrdinaryJobBoardSection />
      <HowFlexDiff/>
      <CTASection/>
      <Footer/>
    </>
  );
}