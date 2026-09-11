import { Button } from "@/components/ui/button";
import { ArrowRightIcon, DumbbellIcon, FlameIcon, GaugeIcon, ShieldCheckIcon, ActivityIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BiomechanicalActionSection() {
  return (
    <section className="relative z-10 py-16 sm:py-24 border-t border-border/40 bg-background/50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono tracking-widest uppercase">
            <span className="inline-block size-2 rounded-full bg-primary animate-pulse" />
            <span>REAL-TIME BIOMECHANICAL INTELLIGENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            <span>Real Training. </span>
            <span className="text-primary">Optimized in Real Time.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            FitPilot bridges autonomous artificial intelligence with heavy iron. From joint vector pathing to velocity-based overload, every rep is quantified and adapted for peak adaptation.
          </p>
        </div>

        {/* CINEMATIC WORKOUT ACTION SHOWCASE CONTAINER */}
        <div className="relative rounded-2xl border border-border/80 bg-cyber-black/90 overflow-hidden shadow-2xl shadow-primary/5 group">
          {/* CORNER TECH ACCENTS */}
          <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-primary/60 z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-primary/60 z-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-primary/60 z-20 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-primary/60 z-20 pointer-events-none" />

          {/* 16:9 ACTION IMAGE */}
          <div className="relative aspect-16/9 sm:aspect-21/9 min-h-[320px] sm:min-h-[460px] lg:min-h-[540px] w-full overflow-hidden bg-cyber-black">
            <Image
              src="/workout-action-ai.jpg"
              alt="FitPilot AI Real-Time Workout Movement Analysis and Biomechanical Tracking"
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* SCANLINE OVERLAY */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-size-[100%_8px] opacity-30 pointer-events-none" />
            <div className="absolute inset-0 bg-linear-to-t from-cyber-black via-cyber-black/30 to-transparent" />

            {/* FLOATING HUD TELEMETRY CARDS (DESKTOP) */}
            <div className="absolute top-5 left-5 z-10 hidden sm:flex flex-col gap-2">
              <div className="px-3 py-1.5 rounded bg-black/80 border border-primary/40 font-mono text-xs text-primary backdrop-blur-md flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                <span>VISION AI: BAR PATH TRACKING ACTIVE</span>
              </div>
              <div className="px-3 py-1.5 rounded bg-black/80 border border-border/80 font-mono text-xs text-muted-foreground backdrop-blur-md">
                <span>CONCENTRIC VELOCITY: 0.48 m/s</span>
              </div>
            </div>

            <div className="absolute top-5 right-5 z-10 hidden sm:flex flex-col items-end gap-2">
              <div className="px-3 py-1.5 rounded bg-black/80 border border-primary/40 font-mono text-xs text-primary backdrop-blur-md flex items-center gap-2">
                <FlameIcon className="size-3.5 text-primary" />
                <span>FORCE: 3,150 N (PEAK DRIVE)</span>
              </div>
              <div className="px-3 py-1.5 rounded bg-black/80 border border-border/80 font-mono text-xs text-muted-foreground backdrop-blur-md">
                <span>RECOVERY WINDOW: 90s SYNCED</span>
              </div>
            </div>

            {/* LOWER SUMMARY STRIP */}
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-linear-to-t from-cyber-black via-cyber-black/80 to-transparent">
              <div>
                <div className="text-xs font-mono text-primary font-bold uppercase tracking-widest mb-1">
                  AUTONOMOUS MISSION DISPATCH
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">
                  Kinetic Vector & Dynamic Progressive Overload
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  size="lg"
                  asChild
                  className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-sm font-semibold shadow-md shadow-primary/20 w-full sm:w-auto"
                >
                  <Link href="/session" className="flex items-center gap-2">
                    <DumbbellIcon className="size-4" />
                    <span>Launch Gym Session</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* 3-COLUMN PILLARS */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60 bg-card/60 font-mono">
            <div className="p-6 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <GaugeIcon className="size-4" />
                <span>01 // VELOCITY OVERLOAD</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tracks bar speed drop-offs set-by-set to identify muscular failure before technique breakdown occurs.
              </p>
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <ShieldCheckIcon className="size-4" />
                <span>02 // JOINT VECTOR PATHING</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Biomechanical angle tracking matches exercise choice directly to your limb lengths and mobility constraints.
              </p>
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <ActivityIcon className="size-4" />
                <span>03 // AUTONOMIC RECOVERY</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Interactive rest interval calibration and cloud workout logging synchronize your heart rate with targeted rest intervals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
