import TerminalOverlay from "@/components/TerminalOverlay";
import { Button } from "@/components/ui/button";
import UserPrograms from "@/components/UserPrograms";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      <section className="relative z-10 py-12 sm:py-16 grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            {/* CORNER DECORATION */}
            <div className="absolute -top-6 left-0 w-28 sm:w-36 h-28 sm:h-36 border-l-2 border-t-2 border-primary/30 pointer-events-none" />

            {/* LEFT SIDE CONTENT */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 relative">
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

              <p className="text-base sm:text-lg text-muted-foreground w-full max-w-xl">
                Get genuinely personalized workout routines and targeted diet plans designed specifically for your body and goals.
              </p>

              {/* STATS */}
              <div className="flex items-center gap-6 sm:gap-10 py-3 sm:py-4 font-mono">
                <div className="flex flex-col">
                  <div className="text-xl sm:text-2xl text-primary font-bold">500+</div>
                  <div className="text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground">ACTIVE USERS</div>
                </div>
                <div className="h-10 sm:h-12 w-px bg-linear-to-b from-transparent via-border to-transparent"></div>
                <div className="flex flex-col">
                  <div className="text-xl sm:text-2xl text-primary font-bold">3min</div>
                  <div className="text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground">GENERATION</div>
                </div>
                <div className="h-10 sm:h-12 w-px bg-linear-to-b from-transparent via-border to-transparent"></div>
                <div className="flex flex-col">
                  <div className="text-xl sm:text-2xl text-primary font-bold">100%</div>
                  <div className="text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground">PERSONALIZED</div>
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  size="lg"
                  asChild
                  className="h-11 px-6 sm:px-8 text-sm sm:text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 font-mono shadow-md shadow-primary/20"
                >
                  <Link href={"/generate-program"} className="flex items-center font-mono">
                    Build Your Program
                    <ArrowRightIcon className="ml-2 size-4 sm:size-5" />
                  </Link>
                </Button>
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
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="relative overflow-hidden rounded-lg bg-cyber-black">
                  <img
                    src="/hero-ai3.png"
                    alt="AI Fitness Coach"
                    className="size-full object-cover object-center"
                  />

                  {/* SCAN LINE */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-size-[100%_8px] animate-scanline pointer-events-none" />

                  {/* DECORATIONS ON TOP THE IMAGE */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-primary/40 rounded-full" />

                    {/* Targeting lines */}
                    <div className="absolute top-1/2 left-0 w-1/4 h-px bg-primary/50" />
                    <div className="absolute top-1/2 right-0 w-1/4 h-px bg-primary/50" />
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

      <UserPrograms />
    </div>
  );
};

export default HomePage;
