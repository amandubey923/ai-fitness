import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CpuIcon, SparklesIcon, ZapIcon, ActivityIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BiometricArchitectureSection() {
  return (
    <section className="relative z-10 py-16 sm:py-24 border-t border-border/40 bg-card/20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono tracking-widest uppercase">
            <span className="inline-block size-2 rounded-full bg-primary animate-pulse" />
            <span>NEURAL PHYSIQUE ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            <span>Engineered for </span>
            <span className="text-primary">Every Physique</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Whether your objective is maximum mechanical hypertrophy, functional kinetic power, or high-density metabolic sculpting, FitPilot custom-calibrates volume splits, rep tempos, and macro profiles to your exact physiology.
          </p>
        </div>

        {/* DUAL ATHLETE CARDS - LARGE PREMIUM PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* MALE ATHLETE CARD */}
          <div className="group relative rounded-2xl border border-border/80 bg-cyber-black/90 overflow-hidden hover:border-primary/60 transition-all duration-500 shadow-2xl shadow-black/60 flex flex-col">
            {/* CORNER TECH ACCENTS */}
            <div className="absolute top-0 left-0 w-10 h-10 border-l-2 border-t-2 border-primary/50 z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-10 h-10 border-r-2 border-t-2 border-primary/50 z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-l-2 border-b-2 border-primary/50 z-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-r-2 border-b-2 border-primary/50 z-20 pointer-events-none" />

            {/* DOMINANT LARGE IMAGE CONTAINER (3:4 RATIO - NO FACE CROPPING) */}
            <div className="relative w-full aspect-[3/4] min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] overflow-hidden bg-cyber-black">
              <Image
                src="/athlete-male.jpg"
                alt="FitPilot Male Hypertrophy and Strength Architecture"
                fill
                sizes="(max-width: 1024px) 100vw, 620px"
                className="object-cover object-[center_top] group-hover:scale-103 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* AMBIENT SCANLINE & GRADIENTS */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-size-[100%_10px] opacity-25 pointer-events-none" />
              <div className="absolute inset-0 bg-linear-to-t from-cyber-black via-cyber-black/40 to-transparent" />

              {/* FLOATING HUD BADGES (TOP) */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/80 border border-primary/50 font-mono text-xs text-primary backdrop-blur-md shadow-md shadow-black/40">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                <span className="font-bold tracking-wider">SPEC: ALPHA-01 // HYPERTROPHY</span>
              </div>

              <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/80 border border-border/90 font-mono text-xs text-muted-foreground backdrop-blur-md">
                <ActivityIcon className="size-3.5 text-primary" />
                <span>LOAD EFFICIENCY: 98.6%</span>
              </div>

              {/* OVERLAY TELEMETRY CONTENT AT BOTTOM OF IMAGE */}
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 z-10 space-y-4 bg-linear-to-t from-cyber-black via-cyber-black/90 to-transparent pt-16">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-primary font-bold tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/30">
                      MALE BIOMETRIC PROTOCOL
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">CNS RECOVERY: OPTIMAL</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
                    Hypertrophy & Power Engine
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">
                    High-output mechanical tension algorithms designed for muscle cross-sectional density, explosive compound strength, and targeted progressive overload.
                  </p>
                </div>

                {/* TELEMETRY TAGS */}
                <div className="grid grid-cols-3 gap-2.5 pt-1 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-black/70 border border-border/70 backdrop-blur-xs text-center">
                    <div className="text-primary font-bold text-sm">PPL SPLIT</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Adaptive Waves</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/70 border border-border/70 backdrop-blur-xs text-center">
                    <div className="text-primary font-bold text-sm">SURPLUS</div>
                    <div className="text-[10px] text-muted-foreground uppercase">High Partitioning</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/70 border border-border/70 backdrop-blur-xs text-center">
                    <div className="text-primary font-bold text-sm">DELOAD</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Fatigue Sensor</div>
                  </div>
                </div>

                {/* ACTION CTA */}
                <div className="pt-2">
                  <Button
                    size="lg"
                    asChild
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-sm font-semibold shadow-lg shadow-primary/20 justify-between group/btn"
                  >
                    <Link href="/generate-program">
                      <span>Deploy Male Strength Spec</span>
                      <ArrowRightIcon className="size-4 group-hover/btn:translate-x-1.5 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* FEMALE ATHLETE CARD */}
          <div className="group relative rounded-2xl border border-border/80 bg-cyber-black/90 overflow-hidden hover:border-primary/60 transition-all duration-500 shadow-2xl shadow-black/60 flex flex-col">
            {/* CORNER TECH ACCENTS */}
            <div className="absolute top-0 left-0 w-10 h-10 border-l-2 border-t-2 border-primary/50 z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-10 h-10 border-r-2 border-t-2 border-primary/50 z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-l-2 border-b-2 border-primary/50 z-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-r-2 border-b-2 border-primary/50 z-20 pointer-events-none" />

            {/* DOMINANT LARGE IMAGE CONTAINER (3:4 RATIO - NO FACE CROPPING) */}
            <div className="relative w-full aspect-[3/4] min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] overflow-hidden bg-cyber-black">
              <Image
                src="/athlete-female.jpg"
                alt="FitPilot Female Athletic Sculpt and Tone Architecture"
                fill
                sizes="(max-width: 1024px) 100vw, 620px"
                className="object-cover object-[center_top] group-hover:scale-103 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* AMBIENT SCANLINE & GRADIENTS */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-size-[100%_10px] opacity-25 pointer-events-none" />
              <div className="absolute inset-0 bg-linear-to-t from-cyber-black via-cyber-black/40 to-transparent" />

              {/* FLOATING HUD BADGES (TOP) */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/80 border border-primary/50 font-mono text-xs text-primary backdrop-blur-md shadow-md shadow-black/40">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                <span className="font-bold tracking-wider">SPEC: BETA-02 // SCULPT & TONE</span>
              </div>

              <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/80 border border-border/90 font-mono text-xs text-muted-foreground backdrop-blur-md">
                <ZapIcon className="size-3.5 text-primary" />
                <span>METABOLIC RATE: ELEVATED</span>
              </div>

              {/* OVERLAY TELEMETRY CONTENT AT BOTTOM OF IMAGE */}
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 z-10 space-y-4 bg-linear-to-t from-cyber-black via-cyber-black/90 to-transparent pt-16">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-primary font-bold tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/30">
                      FEMALE BIOMETRIC PROTOCOL
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">VO2 KINETICS: ACTIVE</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
                    Athletic Conditioning & Sculpt Engine
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">
                    High-density kinetic conditioning tailored for core stability, posterior chain power, metabolic acceleration, and functional lean definition.
                  </p>
                </div>

                {/* TELEMETRY TAGS */}
                <div className="grid grid-cols-3 gap-2.5 pt-1 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-black/70 border border-border/70 backdrop-blur-xs text-center">
                    <div className="text-primary font-bold text-sm">CORE & GLUTES</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Kinetic Tension</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/70 border border-border/70 backdrop-blur-xs text-center">
                    <div className="text-primary font-bold text-sm">CARB TIMING</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Insulin Sensitivity</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/70 border border-border/70 backdrop-blur-xs text-center">
                    <div className="text-primary font-bold text-sm">FAT BURNING</div>
                    <div className="text-[10px] text-muted-foreground uppercase">EPOC Activation</div>
                  </div>
                </div>

                {/* ACTION CTA */}
                <div className="pt-2">
                  <Button
                    size="lg"
                    asChild
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-sm font-semibold shadow-lg shadow-primary/20 justify-between group/btn"
                  >
                    <Link href="/generate-program">
                      <span>Deploy Female Sculpt Spec</span>
                      <ArrowRightIcon className="size-4 group-hover/btn:translate-x-1.5 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
