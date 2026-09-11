"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import CornerElements from "@/components/CornerElements";
import { Button } from "@/components/ui/button";
import RestTimer from "@/components/RestTimer";
import SessionExerciseDeck from "@/components/session/SessionExerciseDeck";
import { useWorkoutProgress } from "@/hooks/useWorkoutProgress";
import { useExerciseSwap } from "@/hooks/useExerciseSwap";
import { formatRoutineKey } from "@/lib/progress";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Dumbbell,
  Flame,
  RotateCcw,
  Sparkles,
  Trophy,
  Loader2,
  Calendar,
} from "lucide-react";

export default function WorkoutSessionPage() {
  const { user } = useUser();
  const userId = user?.id as string;

  // 1. Fetch user's plans to locate the active plan
  const allPlans = useQuery(api.plans.getUserplans, { userId });
  const activePlan = allPlans?.find((p) => p.isActive);

  // 2. Determine today's exercise split
  const todayName = useMemo(() => {
    return new Date().toLocaleDateString("en-US", { weekday: "long" });
  }, []);

  const todayExerciseDay = useMemo(() => {
    if (!activePlan?.workoutplan?.exercises) return null;
    return activePlan.workoutplan.exercises.find(
      (ex) => ex.day.toLowerCase() === todayName.toLowerCase()
    );
  }, [activePlan, todayName]);

  const routines = useMemo(() => {
    return todayExerciseDay?.routines || [];
  }, [todayExerciseDay]);

  // 3. Connect existing workout progress hook (0ms optimistic UI + cloud sync)
  const {
    completedMap,
    streakData,
    toggleComplete,
  } = useWorkoutProgress(
    userId,
    activePlan?._id,
    activePlan?.workoutplan?.exercises
  );

  // 4. Connect existing AI exercise swap hook
  const {
    swappingKey,
    swapResults,
    customRoutines,
    handleRequestSwap,
    handleAcceptSwap,
    handleDismissSwap,
  } = useExerciseSwap(activePlan?.name);

  // 5. Session navigation state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  // Auto-set current index to first uncompleted exercise on session start
  useEffect(() => {
    if (routines.length === 0) return;
    const firstUnfinished = routines.findIndex((_, idx) => {
      const key = formatRoutineKey(todayName, idx);
      return !completedMap[key];
    });
    if (firstUnfinished !== -1) {
      setCurrentIndex(firstUnfinished);
    }
  }, [routines.length, todayName]);

  // Current routine (considering custom swaps)
  const currentRoutine = useMemo(() => {
    if (!routines[currentIndex]) return null;
    const key = formatRoutineKey(todayName, currentIndex);
    const custom = customRoutines[key];
    if (custom) {
      return {
        ...routines[currentIndex],
        name: custom.name,
        sets: custom.sets ?? routines[currentIndex].sets,
        reps: custom.reps ?? routines[currentIndex].reps,
      };
    }
    return routines[currentIndex];
  }, [routines, currentIndex, todayName, customRoutines]);

  const currentRoutineKey = formatRoutineKey(todayName, currentIndex);
  const isCurrentCompleted = !!completedMap[currentRoutineKey];

  // Count how many routines of today are done
  const completedTodayCount = useMemo(() => {
    return routines.filter((_, idx) => completedMap[formatRoutineKey(todayName, idx)]).length;
  }, [routines, completedMap, todayName]);

  const sessionPercent = routines.length
    ? Math.round((completedTodayCount / routines.length) * 100)
    : 0;

  // Handle completion + trigger rest timer + advance
  const handleCompleteAndRest = useCallback(() => {
    if (!isCurrentCompleted) {
      toggleComplete(currentRoutineKey);
      // Auto-open rest timer
      setIsTimerOpen(true);
      // Advance to next exercise if not last
      if (currentIndex < routines.length - 1) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
        }, 300);
      } else {
        // Last exercise completed -> show finish celebration
        setTimeout(() => {
          setIsSessionFinished(true);
        }, 500);
      }
    } else {
      toggleComplete(currentRoutineKey);
    }
  }, [isCurrentCompleted, toggleComplete, currentRoutineKey, currentIndex, routines.length]);

  const handleNext = useCallback(() => {
    if (currentIndex < routines.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsSessionFinished(true);
    }
  }, [currentIndex, routines.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleSkip = useCallback(() => {
    if (currentIndex < routines.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsSessionFinished(true);
    }
  }, [currentIndex, routines.length]);

  // Loading state
  if (!allPlans) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
          Initializing gym session interface...
        </p>
      </div>
    );
  }

  // No active plan state
  if (!activePlan) {
    return (
      <section className="container mx-auto px-4 py-16 max-w-lg text-center space-y-5">
        <div className="size-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
          <Dumbbell className="size-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold font-mono text-foreground">NO ACTIVE PROGRAM DETECTED</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Activate or generate a fitness plan in your profile to start an interactive gym session.
          </p>
        </div>
        <Button asChild className="h-10 px-6 font-mono text-sm bg-primary text-primary-foreground">
          <Link href="/profile">Go to Profile</Link>
        </Button>
      </section>
    );
  }

  // Rest day state (if today is not in schedule)
  if (!todayExerciseDay || routines.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16 max-w-lg text-center space-y-6">
        <div className="relative backdrop-blur-md border border-blue-500/30 bg-card/60 rounded-xl p-6 sm:p-8 shadow-xl space-y-4">
          <CornerElements />
          <div className="size-12 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
            <Calendar className="size-6" />
          </div>
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-xs font-semibold uppercase tracking-wider">
              RECOVERY PROTOCOL ACTIVE
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {todayName} is a Scheduled Rest Day
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Active plan <span className="text-primary font-mono font-semibold">{activePlan.name}</span> has no lifting sessions scheduled today. Prioritize recovery and protein intake.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Button asChild variant="outline" className="w-full sm:w-auto h-9 font-mono text-xs border-border">
              <Link href="/profile">
                <ArrowLeft className="size-3.5 mr-1" /> View Full Split in Profile
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto h-9 font-mono text-xs bg-primary text-primary-foreground">
              <Link href="/progress">View Progress Matrix</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 pt-3 sm:pt-5 pb-16 grow container mx-auto px-4 max-w-2xl">
      {/* SESSION NAVIGATION & PROGRESS HEADER */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs font-mono text-muted-foreground hover:text-foreground">
          <Link href="/profile">
            <ArrowLeft className="size-3.5 mr-1.5" /> Back
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {streakData?.currentStreak ? (
            <div className="flex items-center gap-1.5 bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono text-xs font-bold">
              <Flame className="size-3" />
              <span>{streakData.currentStreak}D</span>
            </div>
          ) : null}

          <span className="font-mono text-xs font-bold text-primary">
            {completedTodayCount}/{routines.length} DONE ({sessionPercent}%)
          </span>
        </div>
      </div>

      {/* SESSION PROGRESS BAR */}
      <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden border border-border mb-6">
        <div
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${sessionPercent}%` }}
        />
      </div>

      {/* FINISH SESSION DIALOG / SCREEN */}
      {isSessionFinished ? (
        <div className="relative backdrop-blur-md border border-primary/40 bg-card/80 rounded-xl p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <CornerElements />
          <div className="size-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary mx-auto shadow-md shadow-primary/20">
            <Trophy className="size-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-mono font-bold tracking-wider text-primary uppercase">
              SESSION DISPATCH COMPLETE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Workout Complete!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              You executed <span className="text-primary font-bold font-mono">{completedTodayCount} of {routines.length}</span> routines scheduled for {todayName}. Telemetry synced to cloud logs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 py-2 max-w-xs mx-auto">
            <div className="p-3 rounded-lg border border-border bg-background/50 font-mono">
              <div className="text-xs text-muted-foreground">COMPLETION</div>
              <div className="text-xl font-bold text-primary">{sessionPercent}%</div>
            </div>
            <div className="p-3 rounded-lg border border-border bg-background/50 font-mono">
              <div className="text-xs text-muted-foreground">STREAK</div>
              <div className="text-xl font-bold text-amber-400">
                {streakData?.currentStreak ?? 1} DAYS
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => {
                setIsSessionFinished(false);
                setCurrentIndex(0);
              }}
              variant="outline"
              className="w-full sm:w-auto h-10 font-mono text-xs border-border"
            >
              <RotateCcw className="size-3.5 mr-1.5" /> Review Exercises
            </Button>
            <Button asChild className="w-full sm:w-auto h-10 px-6 font-mono text-xs font-bold bg-primary text-primary-foreground">
              <Link href="/progress">View Analytics Dashboard</Link>
            </Button>
          </div>
        </div>
      ) : (
        /* ACTIVE EXERCISE DECK */
        currentRoutine && (
          <SessionExerciseDeck
            routine={currentRoutine}
            routineKey={currentRoutineKey}
            dayName={todayName}
            currentIndex={currentIndex}
            totalExercises={routines.length}
            isCompleted={isCurrentCompleted}
            onToggleComplete={handleCompleteAndRest}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSkip={handleSkip}
            onRequestSwap={() => handleRequestSwap(currentRoutineKey, currentRoutine.name, todayName)}
            isSwapping={swappingKey === currentRoutineKey}
            swapResult={swapResults[currentRoutineKey]}
            onAcceptSwap={() => handleAcceptSwap(currentRoutineKey)}
            onDismissSwap={() => handleDismissSwap(currentRoutineKey)}
            onOpenTimer={() => setIsTimerOpen(true)}
          />
        )
      )}

      {/* REUSABLE REST & INTERVAL TIMER */}
      {isTimerOpen && (
        <RestTimer
          initialSeconds={60}
          onClose={() => setIsTimerOpen(false)}
        />
      )}
    </section>
  );
}
