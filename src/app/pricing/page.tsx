
import Footer from "@/Components/Layouts/Footer";
import MarketingHeader from "@/Components/Layouts/MarketingHeader";
import PricingPage from "@/Components/Pricing/PricingHero";
import PricingHighlights from "@/Components/Pricing/PricingHigligts";

export default function Page() {
  return (
    <>
      <MarketingHeader/>
      <PricingPage />
      <PricingHighlights />
      <Footer/>
    </>
  );
}
