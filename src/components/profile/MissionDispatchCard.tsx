import React from "react";
import CornerElements from "@/components/CornerElements";
import { Button } from "@/components/ui/button";
import { Activity, Flame } from "lucide-react";

interface TodaySummary {
  todayName: string;
  isWorkoutDay: boolean;
  exerciseDay?: {
    day: string;
    routines: any[];
  };
  routines: any[];
  totalRoutines: number;
  completedToday: number;
  nextDay?: string;
  dailyCalories: number;
  mealsCount: number;
}

interface MissionDispatchCardProps {
  todaySummary: TodaySummary;
  currentStreak?: number;
  onStartWorkout: () => void;
}

export default function MissionDispatchCard({
  todaySummary,
  currentStreak = 0,
  onStartWorkout,
}: MissionDispatchCardProps) {
  const percent = todaySummary.totalRoutines
    ? Math.round((todaySummary.completedToday / todaySummary.totalRoutines) * 100)
    : 0;

  return (
    <div className="no-print relative backdrop-blur-sm border border-primary/30 bg-card/40 rounded-lg p-4 sm:p-4.5 shadow-xs">
      <CornerElements />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="size-2.5 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
            MISSION DISPATCH • {todaySummary.todayName}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* CURRENT STREAK BADGE */}
          <div className="flex items-center gap-1.5 bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded font-mono text-xs font-bold tracking-wide">
            <Flame className="size-3.5 fill-amber-400/30" />
            <span>{currentStreak} {currentStreak === 1 ? "DAY" : "DAYS"} STREAK</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CALORIE TARGET:
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-foreground bg-secondary/15 px-2 py-0.5 rounded border border-border">
              {todaySummary.dailyCalories} KCAL
            </span>
          </div>
        </div>
      </div>

      {todaySummary.isWorkoutDay ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2 space-y-1.5">
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                Today is a Workout Day:{" "}
                <span className="text-primary">
                  {todaySummary.exerciseDay?.day}
                </span>
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {todaySummary.totalRoutines} exercises targeted for today • Est. duration ~
              {Math.max(30, todaySummary.totalRoutines * 8)} mins • {todaySummary.mealsCount} structured meals.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <div className="grow max-w-xs bg-muted/60 h-2 rounded-full overflow-hidden border border-border">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="font-mono text-xs font-semibold text-primary">
                {todaySummary.completedToday}/{todaySummary.totalRoutines} Done
              </span>
            </div>
          </div>

          <div className="flex md:justify-end">
            <Button
              size="sm"
              onClick={onStartWorkout}
              className="h-9 px-4 text-xs sm:text-sm font-mono bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              <Activity className="size-3.5 mr-1.5" /> Start Workout
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-xs font-semibold tracking-wider">
                RECOVERY DAY
              </span>
              <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                Rest & Muscle Regeneration
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              No heavy lifting scheduled today. Prioritize hydration, hit your{" "}
              {todaySummary.dailyCalories} kcal target, and rest for optimal muscle recovery.
            </p>
          </div>
          {todaySummary.nextDay && (
            <div className="text-xs sm:text-sm font-mono text-muted-foreground bg-muted/30 px-3 py-1.5 rounded border border-border">
              NEXT SESSION:{" "}
              <span className="text-primary font-semibold">
                {todaySummary.nextDay}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
