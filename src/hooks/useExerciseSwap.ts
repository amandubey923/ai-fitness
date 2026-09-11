"use client";

import { useState } from "react";
import { SwapResult } from "@/components/profile/ExerciseCardRow";

export function useExerciseSwap(planName: string | undefined) {
  const [swappingKey, setSwappingKey] = useState<string | null>(null);
  const [swapResults, setSwapResults] = useState<Record<string, SwapResult>>({});
  const [swapError, setSwapError] = useState<string | null>(null);
  const [customRoutines, setCustomRoutines] = useState<
    Record<string, { name: string; sets?: number; reps?: number }>
  >({});

  const handleRequestSwap = async (
    routineKey: string,
    exerciseName: string,
    day: string
  ) => {
    setSwappingKey(routineKey);
    setSwapError(null);

    try {
      const res = await fetch("/api/groq/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exercise: exerciseName,
          day,
          goal: planName || "General Fitness",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get swap recommendation");
      }

      const data: SwapResult = await res.json();
      setSwapResults((prev) => ({ ...prev, [routineKey]: data }));
    } catch (err: any) {
      setSwapError(err?.message || "Failed to swap exercise. Please try again.");
    } finally {
      setSwappingKey(null);
    }
  };

  const handleAcceptSwap = (routineKey: string) => {
    const suggestion = swapResults[routineKey];
    if (!suggestion) return;

    setCustomRoutines((prev) => ({
      ...prev,
      [routineKey]: {
        name: suggestion.name,
        sets: suggestion.sets,
        reps: suggestion.reps,
      },
    }));

    setSwapResults((prev) => {
      const next = { ...prev };
      delete next[routineKey];
      return next;
    });
  };

  const handleDismissSwap = (routineKey: string) => {
    setSwapResults((prev) => {
      const next = { ...prev };
      delete next[routineKey];
      return next;
    });
  };

  return {
    swappingKey,
    swapResults,
    swapError,
    customRoutines,
    handleRequestSwap,
    handleAcceptSwap,
    handleDismissSwap,
  };
}
