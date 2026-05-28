import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/landing/HeroSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import TrustSection from "@/components/landing/TrustSection";
import AssessmentPreview from "@/components/landing/AssessmentPreview";
import ResultPreview from "@/components/landing/ResultPreview";
import AuthCTASection from "@/components/landing/AuthCTASection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureGrid />
        <HowItWorks />
        <TrustSection />
        <AssessmentPreview />
        <ResultPreview />
        <AuthCTASection />
      </main>
      <Footer />
    </>
  );
}
