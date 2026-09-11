import TerminalOverlay from "@/components/TerminalOverlay";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, DumbbellIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative z-10 py-6 sm:py-10 grow">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
          {/* CORNER DECORATION */}
          <div className="absolute -top-6 left-0 w-20 sm:w-24 h-20 sm:h-24 border-l-2 border-t-2 border-primary/30 pointer-events-none" />

          {/* LEFT SIDE CONTENT */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 relative">
            {/* CYBER STATUS PILL */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono tracking-widest uppercase">
              <span className="inline-block size-1.5 rounded-full bg-primary animate-pulse" />
              <span>NEURAL TRAINING MATRIX // v2.4</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              <div>
                <span className="text-foreground">Transform</span>
              </div>
              <div>
                <span className="text-primary">Your Body</span>
              </div>
              <div className="pt-1.5">
                <span className="text-foreground">With Advanced</span>
              </div>
              <div className="pt-1.5">
                <span className="text-foreground">AI</span>
                <span className="text-primary"> Technology</span>
              </div>
            </h1>

            {/* SEPARATOR LINE */}
            <div className="h-px w-full bg-linear-to-r from-primary via-secondary to-primary opacity-50"></div>

            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed w-full max-w-xl">
              Get genuinely personalized workout routines and targeted diet plans designed specifically for your body, biomechanics, and performance goals.
            </p>

            {/* STATS */}
            <div className="flex items-center gap-6 sm:gap-10 py-2 sm:py-2.5 font-mono">
              <div className="flex flex-col">
                <div className="text-2xl sm:text-3xl text-primary font-bold font-mono tracking-tight">500+</div>
                <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">ACTIVE USERS</div>
              </div>
              <div className="h-10 sm:h-12 w-px bg-linear-to-b from-transparent via-border to-transparent"></div>
              <div className="flex flex-col">
                <div className="text-2xl sm:text-3xl text-primary font-bold font-mono tracking-tight">3min</div>
                <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">GENERATION</div>
              </div>
              <div className="h-10 sm:h-12 w-px bg-linear-to-b from-transparent via-border to-transparent"></div>
              <div className="flex flex-col">
                <div className="text-2xl sm:text-3xl text-primary font-bold font-mono tracking-tight">100%</div>
                <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">PERSONALIZED</div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button
                size="lg"
                asChild
                className="h-11 px-6 sm:px-8 text-sm sm:text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 font-mono shadow-md shadow-primary/20"
              >
                <Link href="/generate-program" className="flex items-center font-mono">
                  Build Your Program
                  <ArrowRightIcon className="ml-2 size-4 sm:size-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-11 px-5 border-border hover:border-primary/50 hover:bg-card/60 font-mono text-sm text-foreground"
              >
                <Link href="/session" className="flex items-center gap-2">
                  <DumbbellIcon className="size-4 text-primary" />
                  <span>Start Gym Session</span>
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground pt-1">
              <ShieldCheckIcon className="size-4 text-primary" />
              <span>Real-time progressive overload • Adaptive macro timing • Cloud workout sync</span>
            </div>
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="lg:col-span-5 relative">
            {/* CORNER PIECES */}
            <div className="absolute -inset-4 pointer-events-none">
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-border" />
              <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-border" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-border" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-border" />
            </div>

            {/* IMAGE CONTAINER */}
            <div className="relative aspect-[2/3] w-full max-w-sm sm:max-w-md lg:max-w-[420px] mx-auto">
              <div className="relative overflow-hidden rounded-lg bg-cyber-black size-full border border-border/50">
                <Image
                  src="/fitpilotHero.png"
                  alt="FitPilot AI Cyber Fitness Coach"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
                  className="size-full object-contain object-top"
                />

                {/* SCAN LINE */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-size-[100%_8px] animate-scanline pointer-events-none" />

                {/* DECORATIONS ON TOP THE IMAGE */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-[28%] left-1/2 -translate-x-1/2 size-36 sm:size-44 border border-primary/40 rounded-full" />

                  {/* Targeting lines */}
                  <div className="absolute top-[38%] left-0 w-1/4 h-px bg-primary/50" />
                  <div className="absolute top-[38%] right-0 w-1/4 h-px bg-primary/50" />
                  <div className="absolute top-0 left-1/2 h-1/4 w-px bg-primary/50" />
                  <div className="absolute bottom-0 left-1/2 h-1/4 w-px bg-primary/50" />
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
              </div>

              {/* TERMINAL OVERLAY */}
              <TerminalOverlay />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
