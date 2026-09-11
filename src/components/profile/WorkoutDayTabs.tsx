import React from "react";
import { CalendarIcon, CheckCircle2, Circle, RotateCcw, Flame, Trophy, TrendingUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ExerciseCardRow, {
  RoutineItem,
  SwapResult,
} from "./ExerciseCardRow";

interface ExerciseDay {
  day: string;
  routines: RoutineItem[];
}

interface WorkoutDayTabsProps {
  schedule: string[];
  exercises: ExerciseDay[];
  completedMap: Record<string, boolean>;
  customRoutines: Record<string, { name: string; sets?: number; reps?: number }>;
  swappingKey: string | null;
  swapResults: Record<string, SwapResult>;
  defaultOpenDay?: string;
  totalCompletedCount: number;
  totalRoutinesInPlan: number;
  progressPercent: number;
  currentStreak?: number;
  longestStreak?: number;
  weeklyAdherence?: number;
  totalCompletions?: number;
  onToggleComplete: (key: string) => void;
  onResetDayCompletion: (day: string) => void;
  onRequestSwap: (key: string, name: string, day: string) => void;
  onAcceptSwap: (key: string) => void;
  onDismissSwap: (key: string) => void;
  onStartRestTimer?: () => void;
}

export default function WorkoutDayTabs({
  schedule,
  exercises,
  completedMap,
  customRoutines,
  swappingKey,
  swapResults,
  defaultOpenDay,
  totalCompletedCount,
  totalRoutinesInPlan,
  progressPercent,
  currentStreak = 0,
  longestStreak = 0,
  weeklyAdherence = 0,
  totalCompletions = 0,
  onToggleComplete,
  onResetDayCompletion,
  onRequestSwap,
  onAcceptSwap,
  onDismissSwap,
  onStartRestTimer,
}: WorkoutDayTabsProps) {
  return (
    <div className="space-y-4 focus-visible:outline-none">
      {/* Schedule strip + Progress meter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-border bg-background/40">
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4 text-primary shrink-0" />
          <span className="font-mono text-xs sm:text-sm text-muted-foreground">
            SCHEDULE:{" "}
            <span className="text-foreground font-semibold">
              {schedule.join(", ")}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm text-muted-foreground">
              PROGRESS:
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-primary">
              {totalCompletedCount}/{totalRoutinesInPlan} ({progressPercent}%)
            </span>
          </div>
          <div className="w-24 bg-muted/60 h-2 rounded-full overflow-hidden border border-border">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* COMPACT PROGRESS STATS STRIP */}
      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg border border-border/80 bg-card/25 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2.5 py-1 rounded bg-background/40 border border-border/40">
          <span className="text-muted-foreground uppercase text-[10px] sm:text-xs flex items-center gap-1">
            <Flame className="size-3 text-amber-400" /> STREAK
          </span>
          <span className="text-foreground font-bold text-xs sm:text-sm text-amber-400">
            {currentStreak} {currentStreak === 1 ? "Day" : "Days"}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2.5 py-1 rounded bg-background/40 border border-border/40">
          <span className="text-muted-foreground uppercase text-[10px] sm:text-xs flex items-center gap-1">
            <TrendingUp className="size-3 text-primary" /> THIS WEEK
          </span>
          <span className="text-foreground font-bold text-xs sm:text-sm text-primary">
            {weeklyAdherence}%
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2.5 py-1 rounded bg-background/40 border border-border/40">
          <span className="text-muted-foreground uppercase text-[10px] sm:text-xs flex items-center gap-1">
            <Trophy className="size-3 text-emerald-400" /> COMPLETED
          </span>
          <span className="text-foreground font-bold text-xs sm:text-sm text-emerald-400">
            {totalCompletions || totalCompletedCount} Total
          </span>
        </div>
      </div>

      {/* Days Accordion */}
      <Accordion
        type="multiple"
        defaultValue={
          defaultOpenDay
            ? [defaultOpenDay]
            : [exercises[0]?.day || ""]
        }
        className="space-y-3"
      >
        {exercises.map((exerciseDay, dayIdx) => {
          let dayCompleted = 0;
          exerciseDay.routines.forEach((_, rIdx) => {
            if (completedMap[`${exerciseDay.day}_${rIdx}`]) {
              dayCompleted++;
            }
          });
          const isDayAllDone =
            exerciseDay.routines.length > 0 &&
            dayCompleted === exerciseDay.routines.length;

          return (
            <AccordionItem
              key={dayIdx}
              value={exerciseDay.day}
              className="border border-border rounded-lg overflow-hidden bg-card/20"
            >
              <AccordionTrigger className="px-3.5 py-2.5 hover:no-underline hover:bg-primary/5 font-mono">
                <div className="flex justify-between w-full items-center pr-2">
                  <div className="flex items-center gap-2.5">
                    {isDayAllDone ? (
                      <CheckCircle2 className="size-4 text-green-500" />
                    ) : (
                      <Circle className="size-4 text-muted-foreground/60" />
                    )}
                    <span className="text-primary font-bold text-sm sm:text-base tracking-tight">
                      {exerciseDay.day}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-muted/50 text-muted-foreground border border-border">
                      {dayCompleted}/{exerciseDay.routines.length} DONE
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-4 px-4">
                <div className="flex justify-end mb-2">
                  {dayCompleted > 0 && (
                    <button
                      type="button"
                      onClick={() => onResetDayCompletion(exerciseDay.day)}
                      className="text-xs font-mono text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="size-3" />
                      Reset Day Checks
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {exerciseDay.routines.map((routine, routineIndex) => {
                    const routineKey = `${exerciseDay.day}_${routineIndex}`;
                    const isDone = Boolean(completedMap[routineKey]);
                    const custom = customRoutines[routineKey];
                    const activeName = custom?.name || routine.name;
                    const activeSets = custom?.sets ?? routine.sets;
                    const activeReps = custom?.reps ?? routine.reps;

                    return (
                      <ExerciseCardRow
                        key={routineKey}
                        routine={routine}
                        routineKey={routineKey}
                        isDone={isDone}
                        activeName={activeName}
                        activeSets={activeSets}
                        activeReps={activeReps}
                        isSwapping={swappingKey === routineKey}
                        suggestion={swapResults[routineKey]}
                        onToggleComplete={onToggleComplete}
                        onRequestSwap={(key, name) =>
                          onRequestSwap(key, name, exerciseDay.day)
                        }
                        onAcceptSwap={onAcceptSwap}
                        onDismissSwap={onDismissSwap}
                        onStartRestTimer={onStartRestTimer}
                      />
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
