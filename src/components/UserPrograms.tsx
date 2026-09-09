import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronRight,
  Dumbbell,
  Sparkles,
  AppleIcon,
} from "lucide-react";
import { USER_PROGRAMS } from "@/constants";

const UserPrograms = () => {
  return (
    <div className="w-full pb-16 pt-8 relative">
      <div className="container mx-auto max-w-6xl px-4">
        {/* HEADER- PROGRAM GALLERY */}
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg overflow-hidden mb-10">
          {/* HEADER BAR */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background/70">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
              <span className="text-sm text-primary font-medium font-mono">PROGRAM_GALLERY</span>
            </div>
            <div className="text-xs text-muted-foreground font-mono">FEATURED_PLANS</div>
          </div>

          {/* HEADER CONTENT */}
          <div className="p-6 sm:p-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-foreground">AI-Generated </span>
              <span className="text-primary">Programs</span>
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-6">
              Explore personalized fitness plans created with FitPilot AI
            </p>

            {/* STATS */}
            <div className="flex items-center justify-center gap-6 sm:gap-12 md:gap-16 font-mono flex-wrap sm:flex-nowrap">
              <div className="flex flex-col items-center">
                <p className="text-2xl sm:text-3xl text-primary font-bold">500+</p>
                <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mt-1">
                  PROGRAMS
                </p>
              </div>
              <div className="hidden sm:block w-px h-10 sm:h-12 bg-border"></div>
              <div className="flex flex-col items-center">
                <p className="text-2xl sm:text-3xl text-primary font-bold">3min</p>
                <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mt-1">
                  CREATION TIME
                </p>
              </div>
              <div className="hidden sm:block w-px h-10 sm:h-12 bg-border"></div>
              <div className="flex flex-col items-center">
                <p className="text-2xl sm:text-3xl text-primary font-bold">100%</p>
                <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mt-1">
                  PERSONALIZED
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PROGRAM CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {USER_PROGRAMS.map((program) => (
            <Card
              key={program.id}
              className="bg-card/90 backdrop-blur-sm border border-border flex flex-col justify-between hover:border-primary/50 transition-colors"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={program.profilePic}
                    alt={program.first_name}
                    className="w-10 h-10 rounded-full object-cover border border-primary/30"
                  />
                  <div>
                    <CardTitle className="text-base font-semibold">{program.first_name}</CardTitle>
                    <p className="text-xs text-muted-foreground font-mono">
                      {program.age}y • {program.height} • {program.weight}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[11px] font-mono border border-primary/20">
                    {program.fitness_goal}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary-foreground text-[11px] font-mono border border-border">
                    {program.fitness_level}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[11px] font-mono">
                    {program.workout_days} days/wk
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-2 space-y-3">
                <div className="border-t border-border pt-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-primary mb-1">
                    <Dumbbell className="h-3.5 w-3.5" />
                    <span>WORKOUT ROUTINE</span>
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {program.workout_plan.title}: {program.workout_plan.description}
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-primary mb-1">
                    <AppleIcon className="h-3.5 w-3.5" />
                    <span>NUTRITION TARGET</span>
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {program.diet_plan.title} ({program.diet_plan.daily_calories})
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-5 py-3 border-t border-border">
                <Link href="/generate-program" className="w-full">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs font-mono border-primary/40 text-primary hover:text-white hover:bg-primary/20"
                  >
                    Generate Similar Plan
                    <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-12 text-center">
          <Link href="/generate-program">
            <Button
              size="lg"
              className="h-11 px-8 text-sm sm:text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 font-mono shadow-md shadow-primary/20"
            >
              Generate Your Program
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-3 font-mono">
            Join 500+ users with AI-customized fitness programs
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserPrograms;
