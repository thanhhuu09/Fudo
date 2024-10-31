import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/LandingPage/HeroSection";
import HowItWorks from "@/components/LandingPage/HowItWorks";
import PopularMenu from "@/components/LandingPage/PopularMenu";
import Navbar from "@/components/layout/Navbar";

export default function Page() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <PopularMenu />
      <Footer />
    </>
  );
}
