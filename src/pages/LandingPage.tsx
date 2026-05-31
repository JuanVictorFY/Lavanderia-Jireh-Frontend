import Navbar            from "@/components/landing/Navbar";
import HeroSection       from "@/components/landing/HeroSection";
import AboutSection      from "@/components/landing/AboutSection";
import ServicesSection   from "@/components/landing/ServicesSection";
import FeaturesSection   from "@/components/landing/FeaturesSection";
import ProcessSection    from "@/components/landing/ProcessSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import BlogSection       from "@/components/landing/BlogSection";
import Footer            from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <FeaturesSection />
        <ProcessSection />
        <TestimonialsSection />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}
