import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, RefreshCw, Sparkles, X, Check, Timer } from "lucide-react";

export interface SwapResult {
  name: string;
  sets: number;
  reps: number;
  reason: string;
}

export interface RoutineItem {
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
  description?: string;
  exercises?: string[];
}

interface ExerciseCardRowProps {
  routine: RoutineItem;
  routineKey: string;
  isDone: boolean;
  activeName: string;
  activeSets?: number;
  activeReps?: number;
  isSwapping: boolean;
  suggestion?: SwapResult;
  onToggleComplete: (key: string) => void;
  onRequestSwap: (key: string, name: string) => void;
  onAcceptSwap: (key: string) => void;
  onDismissSwap: (key: string) => void;
  onStartRestTimer?: () => void;
}

export default React.memo(function ExerciseCardRow({
  routine,
  routineKey,
  isDone,
  activeName,
  activeSets,
  activeReps,
  isSwapping,
  suggestion,
  onToggleComplete,
  onRequestSwap,
  onAcceptSwap,
  onDismissSwap,
  onStartRestTimer,
}: ExerciseCardRowProps) {
  return (
    <div
      className={`border rounded-md p-3 transition-all ${
        isDone
          ? "border-green-500/30 bg-green-500/5 opacity-80"
          : "border-border bg-background/40 hover:border-border/80"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        {/* Checkbox + Name + Description */}
        <div className="flex items-start gap-2.5 grow">
          <button
            type="button"
            onClick={() => onToggleComplete(routineKey)}
            className="mt-0.5 shrink-0 focus:outline-none"
            title={isDone ? "Mark incomplete" : "Mark complete"}
          >
            {isDone ? (
              <CheckCircle2 className="size-4.5 text-green-500 hover:text-green-400 transition-colors" />
            ) : (
              <Circle className="size-4.5 text-muted-foreground/50 hover:text-primary transition-colors" />
            )}
          </button>

          <div>
            <h4
              className={`text-sm sm:text-base font-semibold transition-all ${
                isDone
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {activeName}
            </h4>
            {routine.description && (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-0.5">
                {routine.description}
              </p>
            )}
          </div>
        </div>

        {/* Sets / Reps / Timer & Swap Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {activeSets !== undefined && (
            <span className="px-2 py-0.5 rounded bg-primary/15 text-primary text-xs font-mono font-semibold tracking-wider border border-primary/20">
              {activeSets} SETS
            </span>
          )}
          {activeReps !== undefined && (
            <span className="px-2 py-0.5 rounded bg-secondary/20 text-secondary text-xs font-mono font-semibold tracking-wider border border-secondary/20">
              {activeReps} REPS
            </span>
          )}

          {/* Quick Rest Timer Trigger */}
          {onStartRestTimer && (
            <button
              type="button"
              onClick={onStartRestTimer}
              className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              title="Start rest timer"
            >
              <Timer className="size-3.5" />
            </button>
          )}

          {/* Swap Exercise Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isSwapping}
            onClick={() => onRequestSwap(routineKey, activeName)}
            className="h-7 px-2 text-xs font-mono font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            title="Ask AI for an alternative exercise"
          >
            {isSwapping ? (
              <RefreshCw className="size-3 animate-spin text-primary" />
            ) : (
              <>
                <RefreshCw className="size-3 mr-1" />
                Swap
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Inline AI Swap Suggestion */}
      {suggestion && (
        <div className="mt-3 p-3 rounded border border-primary/40 bg-primary/5 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-mono text-primary font-bold tracking-wide">
              <Sparkles className="size-3.5" />
              SUGGESTED ALTERNATIVE:
            </div>
            <button
              type="button"
              onClick={() => onDismissSwap(routineKey)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="text-sm font-bold text-foreground">
            {suggestion.name}{" "}
            <span className="font-mono text-muted-foreground text-xs">
              ({suggestion.sets} sets × {suggestion.reps} reps)
            </span>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {suggestion.reason}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              onClick={() => onAcceptSwap(routineKey)}
              className="h-6 px-2.5 text-xs font-mono bg-primary text-primary-foreground font-semibold"
            >
              <Check className="size-3 mr-1" />
              Accept Swap
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onDismissSwap(routineKey)}
              className="h-6 px-2 text-xs font-mono text-muted-foreground"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});
