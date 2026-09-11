import HeroSection from "@/components/home/HeroSection";
import BiometricArchitectureSection from "@/components/home/BiometricArchitectureSection";
import BiomechanicalActionSection from "@/components/home/BiomechanicalActionSection";
import UserPrograms from "@/components/UserPrograms";
import HomeCtaSection from "@/components/home/HomeCtaSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. DUAL-GENDER BIOMETRIC PHYSIQUE ARCHITECTURE (DOMINANT VISUALS & CLEAR FACES) */}
      <BiometricArchitectureSection />

      {/* 3. REAL-TIME AI BIOMECHANICAL & KINETIC WORKOUT IN ACTION */}
      <BiomechanicalActionSection />

      {/* 4. FEATURED COMMUNITY & AI PLANS GALLERY */}
      <UserPrograms />

      {/* 5. FINAL HIGH-TECH CTA */}
      <HomeCtaSection />
    </div>
  );
}
