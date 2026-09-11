import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ZapIcon, ActivityIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BiometricArchitectureSection() {
  return (
    <section className="relative z-10 py-12 sm:py-16 border-t border-border/40 bg-card/20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono tracking-widest uppercase">
            <span className="inline-block size-1.5 rounded-full bg-primary animate-pulse" />
            <span>NEURAL PHYSIQUE ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            <span>Engineered for </span>
            <span className="text-primary">Every Physique</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Whether your objective is maximum mechanical hypertrophy, functional kinetic power, or high-density metabolic sculpting, FitPilot custom-calibrates volume splits, rep tempos, and macro profiles to your exact physiology.
          </p>
        </div>

        {/* DUAL ATHLETE CARDS - IMAGE-FIRST VERTICAL CARDS WITH COMPACT BOTTOM BAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* MALE ATHLETE CARD */}
          <div className="group relative rounded-2xl border border-border/80 bg-cyber-black overflow-hidden hover:border-primary/60 transition-all duration-500 shadow-2xl shadow-black/60 flex flex-col justify-between aspect-[3/4] min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] w-full">
            {/* CORNER TECH ACCENTS */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/50 z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary/50 z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary/50 z-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/50 z-20 pointer-events-none" />

            {/* FULL MALE IMAGE (HEAD + FACE + SHOULDERS + TORSO VISIBLE) */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-cyber-black">
              <Image
                src="/athlete-male.jpg"
                alt="FitPilot Male Hypertrophy and Strength Architecture"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover object-top group-hover:scale-102 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* AMBIENT SCANLINE */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-size-[100%_10px] opacity-15 pointer-events-none" />

              {/* GENTLE BOTTOM SHADOW FOR READABILITY */}
              <div className="absolute inset-0 bg-linear-to-t from-cyber-black/90 via-transparent to-transparent" />
            </div>

            {/* FLOATING HUD BADGES (TOP) */}
            <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 border border-primary/50 font-mono text-[11px] sm:text-xs text-primary backdrop-blur-md shadow-md shadow-black/40">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-bold tracking-wider">SPEC: ALPHA-01 // HYPERTROPHY</span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 border border-border/90 font-mono text-[11px] text-muted-foreground backdrop-blur-md">
                <ActivityIcon className="size-3 text-primary" />
                <span>LOAD EFFICIENCY: 98.6%</span>
              </div>
            </div>

            {/* COMPACT BOTTOM CONTENT BOX (AS PER USER REFERENCE DIAGRAM) */}
            <div className="relative z-10 m-3 sm:m-4 p-3.5 sm:p-4 rounded-xl bg-black/90 backdrop-blur-md border border-border/80 shadow-2xl space-y-2.5 font-mono">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-primary font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 border border-primary/30 uppercase">
                    MALE SPEC
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                    Hypertrophy & Power Engine
                  </h3>
                </div>
                <span className="text-[10px] text-muted-foreground hidden sm:inline-block">RECOVERY: 98%</span>
              </div>

              <p className="text-[11px] sm:text-xs text-muted-foreground font-sans leading-relaxed line-clamp-2">
                High-output mechanical tension algorithms designed for muscle density, compound strength, and progressive overload.
              </p>

              {/* TELEMETRY CHIPS */}
              <div className="flex items-center gap-1.5 text-[10px] text-primary flex-wrap">
                <span className="px-2 py-0.5 rounded bg-card/80 border border-border/70 font-semibold">PPL Waves</span>
                <span className="px-2 py-0.5 rounded bg-card/80 border border-border/70 font-semibold">Macro Surplus</span>
                <span className="px-2 py-0.5 rounded bg-card/80 border border-border/70 font-semibold">Auto Deload</span>
              </div>

              {/* COMPACT CTA BUTTON */}
              <div className="pt-0.5">
                <Button
                  size="sm"
                  asChild
                  className="w-full h-8 sm:h-8.5 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs font-semibold shadow-xs justify-between group/btn"
                >
                  <Link href="/generate-program">
                    <span>Deploy Male Strength Spec</span>
                    <ArrowRightIcon className="size-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* FEMALE ATHLETE CARD */}
          <div className="group relative rounded-2xl border border-border/80 bg-cyber-black overflow-hidden hover:border-primary/60 transition-all duration-500 shadow-2xl shadow-black/60 flex flex-col justify-between aspect-[3/4] min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] w-full">
            {/* CORNER TECH ACCENTS */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/50 z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary/50 z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary/50 z-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/50 z-20 pointer-events-none" />

            {/* FULL FEMALE IMAGE (HEAD + FACE + SHOULDERS + TORSO VISIBLE) */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-cyber-black">
              <Image
                src="/athlete-female.jpg"
                alt="FitPilot Female Athletic Sculpt and Tone Architecture"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover object-top group-hover:scale-102 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* AMBIENT SCANLINE */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-size-[100%_10px] opacity-15 pointer-events-none" />

              {/* GENTLE BOTTOM SHADOW FOR READABILITY */}
              <div className="absolute inset-0 bg-linear-to-t from-cyber-black/90 via-transparent to-transparent" />
            </div>

            {/* FLOATING HUD BADGES (TOP) */}
            <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 border border-primary/50 font-mono text-[11px] sm:text-xs text-primary backdrop-blur-md shadow-md shadow-black/40">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-bold tracking-wider">SPEC: BETA-02 // SCULPT & TONE</span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 border border-border/90 font-mono text-[11px] text-muted-foreground backdrop-blur-md">
                <ZapIcon className="size-3 text-primary" />
                <span>METABOLIC: ELEVATED</span>
              </div>
            </div>

            {/* COMPACT BOTTOM CONTENT BOX (AS PER USER REFERENCE DIAGRAM) */}
            <div className="relative z-10 m-3 sm:m-4 p-3.5 sm:p-4 rounded-xl bg-black/90 backdrop-blur-md border border-border/80 shadow-2xl space-y-2.5 font-mono">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-primary font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 border border-primary/30 uppercase">
                    FEMALE SPEC
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                    Athletic Conditioning & Sculpt
                  </h3>
                </div>
                <span className="text-[10px] text-muted-foreground hidden sm:inline-block">VO2 KINETICS: ACTIVE</span>
              </div>

              <p className="text-[11px] sm:text-xs text-muted-foreground font-sans leading-relaxed line-clamp-2">
                High-density kinetic conditioning tailored for core stability, posterior chain power, and functional lean definition.
              </p>

              {/* TELEMETRY CHIPS */}
              <div className="flex items-center gap-1.5 text-[10px] text-primary flex-wrap">
                <span className="px-2 py-0.5 rounded bg-card/80 border border-border/70 font-semibold">Core & Glutes</span>
                <span className="px-2 py-0.5 rounded bg-card/80 border border-border/70 font-semibold">Carb Cycling</span>
                <span className="px-2 py-0.5 rounded bg-card/80 border border-border/70 font-semibold">EPOC Burn</span>
              </div>

              {/* COMPACT CTA BUTTON */}
              <div className="pt-0.5">
                <Button
                  size="sm"
                  asChild
                  className="w-full h-8 sm:h-8.5 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs font-semibold shadow-xs justify-between group/btn"
                >
                  <Link href="/generate-program">
                    <span>Deploy Female Sculpt Spec</span>
                    <ArrowRightIcon className="size-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
