"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { getTodayDateStr, resolveExerciseName } from "@/lib/progress";

interface ExerciseDay {
  day: string;
  routines?: { name: string }[];
}

export function useWorkoutProgress(
  userId: string | undefined,
  planId: string | undefined,
  exercises: ExerciseDay[] | undefined
) {
  const batchSyncLogsMutation = useMutation(api.logs.batchSyncLogs);

  const planLogs = useQuery(
    api.logs.getPlanLogs,
    planId && userId
      ? { userId, planId: planId as Id<"plans"> }
      : "skip"
  );

  const streakData = useQuery(
    api.logs.getUserStreaks,
    planId && userId
      ? { userId, planId: planId as Id<"plans"> }
      : "skip"
  );

  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const syncQueueRef = useRef<Map<string, { routineKey: string; exerciseName: string; completed: boolean }>>(new Map());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active planId ref for safe flushing across fast switches
  const currentPlanIdRef = useRef<string | undefined>(planId);
  currentPlanIdRef.current = planId;

  // Flush debounced queue to Convex
  const flushSyncQueue = () => {
    const activePlanId = currentPlanIdRef.current;
    if (!activePlanId || !userId) return;
    const queue = syncQueueRef.current;
    if (queue.size === 0) return;

    const updates = Array.from(queue.values());
    queue.clear();

    batchSyncLogsMutation({
      userId,
      planId: activePlanId as Id<"plans">,
      date: getTodayDateStr(),
      updates,
    }).catch((err) => {
      console.error("Background sync to Convex failed:", err);
    });
  };

  // 1. Initial load from localStorage for zero-latency UI + flush pending if plan changed
  useEffect(() => {
    if (!planId) return;

    // Flush any pending queue before switching plan context
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      flushSyncQueue();
    }

    try {
      const saved = localStorage.getItem(`fitpilot_completed_${planId}`);
      if (saved) {
        setCompletedMap(JSON.parse(saved));
      } else {
        setCompletedMap({});
      }
    } catch {
      setCompletedMap({});
    }
  }, [planId]);

  // 2. Merge cloud logs when fetched
  useEffect(() => {
    if (!planLogs || !planId) return;
    const todayDate = getTodayDateStr();
    setCompletedMap((prev) => {
      const merged = { ...prev };
      let changed = false;
      for (const log of planLogs) {
        if (log.date === todayDate) {
          if (merged[log.routineKey] !== log.completed) {
            merged[log.routineKey] = log.completed;
            changed = true;
          }
        }
      }
      if (changed) {
        try {
          localStorage.setItem(`fitpilot_completed_${planId}`, JSON.stringify(merged));
        } catch (e) {
          console.error("Failed to update localStorage with cloud logs", e);
        }
        return merged;
      }
      return prev;
    });
  }, [planLogs, planId]);

  // 3. One-time localStorage to Convex migration
  useEffect(() => {
    if (!planId || !userId) return;
    const migrationKey = `fitpilot_migrated_${planId}`;
    const isMigrated = localStorage.getItem(migrationKey);
    if (isMigrated) return;

    try {
      const saved = localStorage.getItem(`fitpilot_completed_${planId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const updates: { routineKey: string; exerciseName: string; completed: boolean }[] = [];

        Object.entries(parsed).forEach(([key, val]) => {
          if (val) {
            const exerciseName = resolveExerciseName(exercises, key);
            updates.push({
              routineKey: key,
              exerciseName,
              completed: true,
            });
          }
        });

        if (updates.length > 0) {
          batchSyncLogsMutation({
            userId,
            planId: planId as Id<"plans">,
            date: getTodayDateStr(),
            updates,
          }).then(() => {
            localStorage.setItem(migrationKey, "true");
          }).catch((err) => {
            console.error("Migration to cloud failed:", err);
          });
        } else {
          localStorage.setItem(migrationKey, "true");
        }
      }
    } catch (e) {
      console.error("Failed during localStorage migration:", e);
    }
  }, [planId, userId, batchSyncLogsMutation, exercises]);

  // Clean up debounce timer on unmount and flush pending items
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        flushSyncQueue();
      }
    };
  }, []);

  const toggleComplete = (routineKey: string) => {
    if (!planId) return;
    const exerciseName = resolveExerciseName(exercises, routineKey);

    setCompletedMap((prev) => {
      const nextVal = !prev[routineKey];
      const next = { ...prev, [routineKey]: nextVal };
      try {
        localStorage.setItem(`fitpilot_completed_${planId}`, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save completion state", e);
      }

      // Buffer into sync queue
      syncQueueRef.current.set(routineKey, {
        routineKey,
        exerciseName,
        completed: nextVal,
      });

      // Debounce sync by 400ms
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(flushSyncQueue, 400);

      return next;
    });
  };

  const resetDayCompletion = (dayName: string) => {
    if (!planId) return;
    setCompletedMap((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith(`${dayName}_`)) {
          delete next[k];
          const exerciseName = resolveExerciseName(exercises, k);
          syncQueueRef.current.set(k, {
            routineKey: k,
            exerciseName,
            completed: false,
          });
        }
      });
      try {
        localStorage.setItem(`fitpilot_completed_${planId}`, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to reset day completion", e);
      }

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(flushSyncQueue, 400);

      return next;
    });
  };

  return {
    completedMap,
    streakData,
    planLogs,
    toggleComplete,
    resetDayCompletion,
  };
}
