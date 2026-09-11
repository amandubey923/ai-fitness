"use client";

import React, { memo } from "react";
import CornerElements from "@/components/CornerElements";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Timer,
  Flame,
  Info,
} from "lucide-react";
import { SwapResult } from "@/components/profile/ExerciseCardRow";

export interface SessionRoutine {
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
  description?: string;
  exercises?: string[];
}

interface SessionExerciseDeckProps {
  routine: SessionRoutine;
  routineKey: string;
  dayName: string;
  currentIndex: number;
  totalExercises: number;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onRequestSwap: () => void;
  isSwapping: boolean;
  swapResult?: SwapResult;
  onAcceptSwap: () => void;
  onDismissSwap: () => void;
  onOpenTimer: () => void;
}

function SessionExerciseDeckComponent({
  routine,
  routineKey,
  dayName,
  currentIndex,
  totalExercises,
  isCompleted,
  onToggleComplete,
  onNext,
  onPrevious,
  onSkip,
  onRequestSwap,
  isSwapping,
  swapResult,
  onAcceptSwap,
  onDismissSwap,
  onOpenTimer,
}: SessionExerciseDeckProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalExercises - 1;

  return (
    <div className="relative backdrop-blur-md border border-primary/40 bg-card/60 rounded-xl p-5 sm:p-7 shadow-xl space-y-6">
      <CornerElements />

      {/* TOP META BAR */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
            {dayName} • EXERCISE {currentIndex + 1} OF {totalExercises}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenTimer}
          className="h-7 px-2.5 text-xs font-mono border-border hover:border-primary text-foreground"
        >
          <Timer className="size-3.5 mr-1 text-primary" />
          Timer
        </Button>
      </div>

      {/* MAIN EXERCISE NAME & SETS/REPS DISPLAY */}
      <div className="space-y-3">
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
          {routine.name}
        </h2>

        {/* TARGET SPECIFICATIONS */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          {routine.sets && (
            <div className="px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/30 font-mono text-sm sm:text-base font-bold text-primary">
              {routine.sets} SETS
            </div>
          )}
          {routine.reps && (
            <div className="px-3 py-1.5 rounded-lg bg-secondary/20 border border-border font-mono text-sm sm:text-base font-bold text-secondary-foreground">
              {routine.reps} REPS
            </div>
          )}
          {routine.duration && (
            <div className="px-3 py-1.5 rounded-lg bg-muted/40 border border-border font-mono text-sm sm:text-base text-foreground">
              {routine.duration}
            </div>
          )}
        </div>

        {routine.description && (
          <p className="text-sm text-muted-foreground leading-relaxed pt-1">
            {routine.description}
          </p>
        )}
      </div>

      {/* AI EXERCISE SWAP SUGGESTION PROMPT IF OPEN */}
      {swapResult && (
        <div className="p-3.5 rounded-lg border border-primary/40 bg-primary/10 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> AI Recommended Alternative
            </span>
            <button
              onClick={onDismissSwap}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <p className="text-foreground font-semibold text-sm">{swapResult.name}</p>
          <p className="text-muted-foreground">{swapResult.reason}</p>
          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              onClick={onAcceptSwap}
              className="h-7 px-3 text-xs bg-primary text-primary-foreground font-semibold"
            >
              Accept Alternative
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismissSwap}
              className="h-7 px-2 text-xs text-muted-foreground"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* ACTION CONTROLS - MOBILE FIRST LARGE TOUCH TARGETS */}
      <div className="space-y-3 pt-2">
        {/* BIG PRIMARY COMPLETE BUTTON */}
        <Button
          onClick={onToggleComplete}
          size="lg"
          className={`w-full h-14 text-base sm:text-lg font-mono font-bold tracking-wide transition-all shadow-md ${
            isCompleted
              ? "bg-green-600/90 hover:bg-green-600 text-white border border-green-400/50"
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25"
          }`}
        >
          {isCompleted ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-5" /> COMPLETED (CLICK TO UNDO)
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Circle className="size-5" /> COMPLETE EXERCISE & REST
            </span>
          )}
        </Button>

        {/* SECONDARY NAVIGATION CONTROLS */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            disabled={isFirst}
            onClick={onPrevious}
            className="h-11 font-mono text-xs sm:text-sm border-border hover:border-primary/50 text-foreground"
          >
            <ChevronLeft className="size-4 mr-1" /> Prev
          </Button>

          <Button
            variant="outline"
            onClick={onRequestSwap}
            disabled={isSwapping}
            className="h-11 font-mono text-xs sm:text-sm border-primary/30 text-primary hover:bg-primary/10"
          >
            <Sparkles className="size-3.5 mr-1" />
            {isSwapping ? "..." : "Swap"}
          </Button>

          <Button
            variant="outline"
            onClick={onSkip}
            className="h-11 font-mono text-xs sm:text-sm border-border hover:border-primary/50 text-foreground"
          >
            {isLast ? "Review" : "Skip"}
            <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(SessionExerciseDeckComponent);
