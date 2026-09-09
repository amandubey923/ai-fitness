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
    <div className="w-full pb-12 pt-4 relative">
      <div className="container mx-auto max-w-6xl px-4">
        {/* HEADER - PROGRAM GALLERY */}
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-background/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-primary font-semibold font-mono">PROGRAM_GALLERY</span>
            </div>
            <div className="text-[11px] text-muted-foreground font-mono">FEATURED_COMMUNITY_PLANS</div>
          </div>

          <div className="p-4 sm:p-5 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              <span className="text-foreground">AI-Generated </span>
              <span className="text-primary">Programs</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Real examples of personalized workout and diet architectures designed by FitPilot AI.
            </p>
          </div>
        </div>

        {/* PROGRAM CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {USER_PROGRAMS.map((program) => (
            <Card
              key={program.id}
              className="bg-card/80 backdrop-blur-sm border border-border flex flex-col justify-between hover:border-primary/40 transition-colors shadow-xs"
            >
              <CardHeader className="p-4 pb-2.5">
                <div className="flex items-center gap-3 mb-2.5">
                  <img
                    src={program.profilePic}
                    alt={program.first_name}
                    className="w-9 h-9 rounded-full object-cover border border-primary/30"
                  />
                  <div>
                    <CardTitle className="text-sm font-semibold text-foreground">{program.first_name}</CardTitle>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {program.age}y • {program.height} • {program.weight}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-mono border border-primary/20">
                    {program.fitness_goal}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary-foreground text-[10px] font-mono border border-border">
                    {program.fitness_level}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-mono">
                    {program.workout_days} days/wk
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-1.5 space-y-2.5">
                <div className="border-t border-border/70 pt-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-primary mb-1">
                    <Dumbbell className="size-3.5" />
                    <span>WORKOUT ROUTINE</span>
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {program.workout_plan.title}: {program.workout_plan.description}
                  </div>
                </div>

                <div className="border-t border-border/70 pt-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-primary mb-1">
                    <AppleIcon className="size-3.5" />
                    <span>NUTRITION TARGET</span>
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {program.diet_plan.title} ({program.diet_plan.daily_calories})
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-4 py-2.5 border-t border-border/70 bg-background/30">
                <Link href="/generate-program" className="w-full">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-8 text-xs font-mono border-primary/40 text-primary hover:text-foreground hover:bg-primary/15"
                  >
                    Generate Similar Plan
                    <ChevronRight className="ml-1 size-3.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-8 sm:mt-10 text-center">
          <Link href="/generate-program">
            <Button
              size="lg"
              className="h-10 px-7 text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 font-mono shadow-md shadow-primary/20"
            >
              Generate Your Program
              <Sparkles className="ml-1.5 size-4" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-2.5 font-mono">
            Join 500+ users with AI-customized fitness programs
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserPrograms;
