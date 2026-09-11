import { Button } from "@/components/ui/button";
import { ArrowRightIcon, SparklesIcon, TerminalIcon } from "lucide-react";
import Link from "next/link";

export default function HomeCtaSection() {
  return (
    <section className="relative z-10 py-16 sm:py-24 border-t border-border/40 bg-linear-to-b from-card/30 via-background to-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="relative rounded-2xl border border-primary/40 bg-cyber-black/90 p-8 sm:p-12 md:p-16 text-center space-y-6 overflow-hidden shadow-2xl shadow-primary/10">
          {/* CORNER TECH PIECES */}
          <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-primary pointer-events-none" />
          <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-primary pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-primary pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-primary pointer-events-none" />

          {/* AMBIENT GLOW */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-mono uppercase tracking-widest relative z-10">
            <TerminalIcon className="size-3.5" />
            <span>SYSTEM READY FOR DEPLOYMENT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight relative z-10">
            <span>Ready to Command Your </span>
            <span className="text-primary">Physique Transformation?</span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed relative z-10">
            No cookie-cutter routines. Spend 3 minutes defining your physiology, schedule, and equipment — FitPilot synthesizes your personalized training and nutrition architecture instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-10">
            <Button
              size="lg"
              asChild
              className="h-12 px-8 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 font-mono shadow-lg shadow-primary/25 w-full sm:w-auto"
            >
              <Link href="/generate-program" className="flex items-center">
                <span>Synthesize Your Program</span>
                <ArrowRightIcon className="ml-2 size-5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-12 px-6 border-border hover:border-primary/50 hover:bg-card/70 font-mono text-base text-foreground w-full sm:w-auto"
            >
              <Link href="/progress" className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />
                <span>View Analytics Dashboard</span>
              </Link>
            </Button>
          </div>

          <div className="text-xs font-mono text-muted-foreground pt-4 relative z-10 flex flex-wrap items-center justify-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary" />
              Instant Groq AI Synthesis
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary" />
              Print & PDF Dossier Export
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary" />
              Cloud Progress & Streaks
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
