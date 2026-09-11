"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ProfileHeader from "@/components/ProfileHeader";
import NoFitnessPlan from "@/components/NoFitnessPlan";
import CornerElements from "@/components/CornerElements";
import PrintablePlanDossier from "@/components/PrintablePlanDossier";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AppleIcon,
  CalendarIcon,
  DumbbellIcon,
  CheckCircle2,
  Circle,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Flame,
  Clock,
  Activity,
  AlertCircle,
  X,
  RotateCcw,
  Check,
  ChevronRight,
  ShieldCheck,
  Trash2,
  Loader2,
  Printer,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SwapResult {
  name: string;
  sets: number;
  reps: number;
  reason: string;
}

const FITNESS_GOALS = [
  "Weight Loss",
  "Muscle Gain",
  "General Fitness",
  "Endurance",
  "Strength",
  "Flexibility",
];

const FITNESS_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const DIETARY_OPTIONS = [
  "None",
  "Vegetarian",
  "Vegan",
  "Lactose Intolerant",
  "Gluten-Free",
  "Keto",
  "Halal",
];

export default function ProfilePage() {
  const { user } = useUser();
  const userId = user?.id as string;

  const allPlans = useQuery(api.plans.getUserplans, { userId });
  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);

  const deletePlanMutation = useMutation(api.plans.deletePlan);
  const setActivePlanMutation = useMutation(api.plans.setActivePlan);

  const [planToDelete, setPlanToDelete] = useState<{
    id: string;
    name: string;
    isActive: boolean;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isActivatingId, setIsActivatingId] = useState<string | null>(null);

  const activePlan = allPlans?.find((plan) => plan.isActive);
  const currentPlan = selectedPlanId
    ? allPlans?.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  const handleConfirmDelete = async () => {
    if (!planToDelete || !userId) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deletePlanMutation({
        planId: planToDelete.id as any,
        userId,
      });

      try {
        localStorage.removeItem(`fitpilot_completed_${planToDelete.id}`);
      } catch (e) {
        console.error("Failed to clean up localStorage:", e);
      }

      if (selectedPlanId === planToDelete.id) {
        setSelectedPlanId(null);
      }

      setPlanToDelete(null);
    } catch (err: any) {
      console.error("Plan deletion failed:", err);
      setDeleteError(
        err?.message || "Failed to delete plan. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetActive = async (planId: string) => {
    if (!userId) return;
    setIsActivatingId(planId);
    try {
      await setActivePlanMutation({
        planId: planId as any,
        userId,
      });
      setSelectedPlanId(planId);
    } catch (err: any) {
      console.error("Failed to set active plan:", err);
    } finally {
      setIsActivatingId(null);
    }
  };

  // ── FEATURE B: Workout Completion Tracking (localStorage) ─────────────────
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!currentPlan?._id) return;
    try {
      const saved = localStorage.getItem(`fitpilot_completed_${currentPlan._id}`);
      if (saved) {
        setCompletedMap(JSON.parse(saved));
      } else {
        setCompletedMap({});
      }
    } catch {
      setCompletedMap({});
    }
  }, [currentPlan?._id]);

  const toggleComplete = (routineKey: string) => {
    if (!currentPlan?._id) return;
    setCompletedMap((prev) => {
      const next = { ...prev, [routineKey]: !prev[routineKey] };
      try {
        localStorage.setItem(
          `fitpilot_completed_${currentPlan._id}`,
          JSON.stringify(next)
        );
      } catch (e) {
        console.error("Failed to save completion state", e);
      }
      return next;
    });
  };

  const resetDayCompletion = (dayName: string) => {
    if (!currentPlan?._id) return;
    setCompletedMap((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith(`${dayName}_`)) {
          delete next[k];
        }
      });
      try {
        localStorage.setItem(
          `fitpilot_completed_${currentPlan._id}`,
          JSON.stringify(next)
        );
      } catch (e) {
        console.error("Failed to reset day completion", e);
      }
      return next;
    });
  };

  // ── FEATURE C: Exercise Swap (AI Suggestion via Groq) ──────────────────────
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
          goal: currentPlan?.name || "General Fitness",
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

    // Dismiss suggestion
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

  // ── FEATURE D: Modify / Regenerate Plan ───────────────────────────────────
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [modifyGoal, setModifyGoal] = useState<string>("General Fitness");
  const [modifyDays, setModifyDays] = useState<number>(3);
  const [modifyLevel, setModifyLevel] = useState<string>("Intermediate");
  const [modifyDiet, setModifyDiet] = useState<string>("None");
  const [modifyInjuries, setModifyInjuries] = useState<string>("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [modifyError, setModifyError] = useState<string | null>(null);
  const [modifySuccess, setModifySuccess] = useState<string | null>(null);

  const generatePlanAction = useAction(api.generate.generateFitnessPlan);

  // Sync initial modify values when current plan loads
  useEffect(() => {
    if (!currentPlan) return;
    const planDays = currentPlan.workoutplan.schedule?.length || 3;
    setModifyDays(planDays);

    const goalMatch = FITNESS_GOALS.find((g) =>
      currentPlan.name.toLowerCase().includes(g.toLowerCase())
    );
    if (goalMatch) setModifyGoal(goalMatch);
  }, [currentPlan?._id]);

  const applyPreset = (preset: "easier" | "harder" | "veg" | "days4") => {
    if (preset === "easier") {
      setModifyLevel("Beginner");
      setModifyInjuries("Joint-friendly, lower intensity movements");
    } else if (preset === "harder") {
      setModifyLevel("Advanced");
      setModifyInjuries("Progressive overload, high intensity");
    } else if (preset === "veg") {
      setModifyDiet("Vegetarian");
    } else if (preset === "days4") {
      setModifyDays(4);
    }
  };

  const handleRegeneratePlan = async () => {
    if (!user) return;
    setIsRegenerating(true);
    setModifyError(null);
    setModifySuccess(null);

    try {
      await generatePlanAction({
        age: "25",
        height: "175 cm",
        weight: "70 kg",
        injuries: modifyInjuries.trim() || "none",
        workout_days: modifyDays,
        fitness_goal: modifyGoal,
        fitness_level: modifyLevel,
        dietary_restrictions: modifyDiet,
      });

      setModifySuccess("New plan generated and activated successfully!");
      setTimeout(() => {
        setIsModifyOpen(false);
        setModifySuccess(null);
      }, 1500);
    } catch (err: any) {
      console.error("Plan regeneration failed:", err);
      setModifyError(
        err?.message || "Plan regeneration failed. Please try again."
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  // ── FEATURE A: Today / Dashboard Summary Calculation ──────────────────────
  const todaySummary = useMemo(() => {
    if (!currentPlan) return null;
    const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

    const schedule = currentPlan.workoutplan.schedule || [];
    const isWorkoutDay = schedule.some(
      (d) => d.toLowerCase() === todayName.toLowerCase()
    );

    const exerciseDay = currentPlan.workoutplan.exercises?.find(
      (ex) => ex.day.toLowerCase() === todayName.toLowerCase()
    );

    const routines = exerciseDay?.routines || [];
    const totalRoutines = routines.length;

    let completedToday = 0;
    routines.forEach((_, idx) => {
      if (completedMap[`${todayName}_${idx}`]) {
        completedToday++;
      }
    });

    const nextDay =
      schedule.find(
        (d) => d.toLowerCase() !== todayName.toLowerCase()
      ) || schedule[0];

    return {
      todayName,
      isWorkoutDay,
      exerciseDay,
      routines,
      totalRoutines,
      completedToday,
      nextDay,
      dailyCalories: currentPlan.dietplan.dailyCalories,
      mealsCount: currentPlan.dietplan.meals?.length || 0,
    };
  }, [currentPlan, completedMap]);

  // Overall workout completion percentage
  const totalRoutinesInPlan = useMemo(() => {
    if (!currentPlan) return 0;
    return (
      currentPlan.workoutplan.exercises?.reduce(
        (sum, day) => sum + (day.routines?.length || 0),
        0
      ) || 0
    );
  }, [currentPlan]);

  const totalCompletedCount = useMemo(() => {
    return Object.values(completedMap).filter(Boolean).length;
  }, [completedMap]);

  const progressPercent = totalRoutinesInPlan
    ? Math.round((totalCompletedCount / totalRoutinesInPlan) * 100)
    : 0;

  return (
    <section className="relative z-10 pt-3 sm:pt-5 pb-16 grow container mx-auto px-4 max-w-6xl">
      <div className="no-print">
        <ProfileHeader user={user} />
      </div>

      {allPlans && allPlans.length > 0 ? (
        <div className="space-y-6">
          {/* FEATURE A: TODAY DASHBOARD SUMMARY */}
          {todaySummary && (
            <div className="no-print relative backdrop-blur-sm border border-primary/30 bg-card/40 rounded-lg p-4 sm:p-4.5 shadow-xs">
              <CornerElements />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="size-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
                    MISSION DISPATCH • {todaySummary.todayName}
                  </span>
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
                      {todaySummary.totalRoutines} exercises targeted for today •
                      Est. duration ~{Math.max(30, todaySummary.totalRoutines * 8)}{" "}
                      mins • {todaySummary.mealsCount} structured meals.
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <div className="grow max-w-xs bg-muted/60 h-2 rounded-full overflow-hidden border border-border">
                        <div
                          className="bg-primary h-full transition-all duration-300"
                          style={{
                            width: `${
                              todaySummary.totalRoutines
                                ? (todaySummary.completedToday /
                                    todaySummary.totalRoutines) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs font-semibold text-primary">
                        {todaySummary.completedToday}/{todaySummary.totalRoutines}{" "}
                        Done
                      </span>
                    </div>
                  </div>

                  <div className="flex md:justify-end">
                    <Button
                      size="sm"
                      onClick={() => {
                        const el = document.getElementById("plan-tabs-section");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
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
                      No heavy lifting scheduled today. Prioritize hydration, hit
                      your {todaySummary.dailyCalories} kcal target, and rest for
                      optimal muscle recovery.
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
          )}

          {/* PLAN SELECTOR */}
          <div className="no-print relative backdrop-blur-sm border border-border bg-card/30 rounded-lg p-4 sm:p-4.5">
            <CornerElements />
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                <span className="text-primary">Your</span>{" "}
                <span className="text-foreground">Fitness Plans</span>
              </h2>
              <div className="font-mono text-xs font-semibold text-muted-foreground">
                TOTAL: {allPlans.length}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {allPlans.map((plan) => {
                const isSelected =
                  selectedPlanId === plan._id ||
                  (!selectedPlanId && plan.isActive);
                return (
                  <div
                    key={plan._id}
                    className={`inline-flex items-center rounded-md border transition-all ${
                      isSelected
                        ? "bg-primary/20 text-primary border-primary font-semibold shadow-xs"
                        : "bg-transparent border-border hover:border-primary/50 text-foreground"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedPlanId(plan._id)}
                      className="h-8.5 px-3 text-xs sm:text-sm font-mono flex items-center gap-1.5 focus:outline-hidden"
                    >
                      <span>{plan.name}</span>
                      {plan.isActive && (
                        <span className="bg-green-500/20 text-green-400 text-xs px-1.5 py-0.2 rounded font-mono font-semibold">
                          ACTIVE
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlanToDelete({
                          id: plan._id,
                          name: plan.name,
                          isActive: !!plan.isActive,
                        });
                      }}
                      title={`Delete "${plan.name}"`}
                      className="h-8.5 pr-2.5 pl-0.5 text-muted-foreground/60 hover:text-destructive transition-colors flex items-center justify-center focus:outline-hidden"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PLAN DETAILS */}
          {currentPlan && (
            <div
              id="plan-tabs-section"
              className="relative backdrop-blur-sm border border-border bg-card/30 rounded-lg p-4 sm:p-5 print:border-none print:bg-white print:p-0 print:backdrop-blur-none print:shadow-none"
            >
              <div className="no-print">
                <CornerElements />
              </div>

              {/* Plan Header with FEATURE D Modify Button */}
              <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-border/60">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="size-2 rounded-full bg-primary animate-pulse" />
                  <h3 className="text-lg sm:text-xl font-bold font-mono tracking-tight">
                    PLAN: <span className="text-primary">{currentPlan.name}</span>
                  </h3>
                  {currentPlan.isActive ? (
                    <span className="ml-1 bg-green-500/15 text-green-400 border border-green-500/30 text-xs px-2 py-0.5 rounded font-mono font-semibold flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> ACTIVE
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isActivatingId === currentPlan._id}
                      onClick={() => handleSetActive(currentPlan._id)}
                      className="h-6.5 px-2 text-xs font-mono border-primary/40 text-primary hover:bg-primary/10 ml-1"
                    >
                      {isActivatingId === currentPlan._id ? (
                        <Loader2 className="size-3 mr-1 animate-spin" />
                      ) : (
                        <Check className="size-3 mr-1" />
                      )}
                      Set as Active
                    </Button>
                  )}
                </div>

                <div className="no-print flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="h-8 px-2.5 text-xs sm:text-sm font-mono font-medium border-border hover:border-primary/50 text-foreground transition-colors"
                    title="Print or Save Plan as PDF"
                  >
                    <Printer className="size-3.5 mr-1 text-primary" />
                    Print / PDF
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModifyOpen(!isModifyOpen)}
                    className="h-8 px-3 text-xs sm:text-sm font-mono font-medium border-primary/40 text-primary hover:bg-primary/10 transition-colors"
                  >
                    <SlidersHorizontal className="size-3.5 mr-1.5" />
                    {isModifyOpen ? "Close Modify" : "Modify Plan"}
                  </Button>

                  <Link href="/generate-program">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2.5 text-xs sm:text-sm font-mono text-muted-foreground hover:text-foreground"
                    >
                      <Sparkles className="size-3 mr-1 text-primary" />
                      New Plan
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPlanToDelete({
                        id: currentPlan._id,
                        name: currentPlan.name,
                        isActive: !!currentPlan.isActive,
                      })
                    }
                    className="h-8 px-2.5 text-xs sm:text-sm font-mono border-destructive/30 text-destructive/80 hover:text-destructive hover:border-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete current plan"
                  >
                    <Trash2 className="size-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* FEATURE D: CONTROLLED MODIFY / REGENERATE DRAWER */}
              {isModifyOpen && (
                <div className="no-print mb-6 p-4 rounded-lg border border-primary/40 bg-background/80 backdrop-blur-md space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" />
                      <span className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
                        FitPilot Controlled Plan Optimizer
                      </span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      AI Powered
                    </span>
                  </div>

                  {/* Preset quick buttons */}
                  <div>
                    <span className="block text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      QUICK PRESETS:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset("easier")}
                        className="h-7 text-xs font-mono font-medium border-border hover:border-primary/60"
                      >
                        ⚡ Make Easier
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset("harder")}
                        className="h-7 text-xs font-mono font-medium border-border hover:border-primary/60"
                      >
                        💥 Step Up (Harder)
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset("veg")}
                        className="h-7 text-xs font-mono font-medium border-border hover:border-primary/60"
                      >
                        🥗 Vegetarian Protein
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset("days4")}
                        className="h-7 text-xs font-mono font-medium border-border hover:border-primary/60"
                      >
                        📅 4 Days Split
                      </Button>
                    </div>
                  </div>

                  {/* Form controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        FITNESS GOAL
                      </label>
                      <select
                        value={modifyGoal}
                        onChange={(e) => setModifyGoal(e.target.value)}
                        className="w-full h-8.5 text-xs sm:text-sm bg-background border border-border rounded px-2 text-foreground focus:outline-none focus:border-primary"
                      >
                        {FITNESS_GOALS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        WORKOUT DAYS / WK
                      </label>
                      <select
                        value={modifyDays}
                        onChange={(e) => setModifyDays(Number(e.target.value))}
                        className="w-full h-8.5 text-xs sm:text-sm bg-background border border-border rounded px-2 text-foreground focus:outline-none focus:border-primary"
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                          <option key={d} value={d}>
                            {d} {d === 1 ? "Day" : "Days"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        INTENSITY LEVEL
                      </label>
                      <select
                        value={modifyLevel}
                        onChange={(e) => setModifyLevel(e.target.value)}
                        className="w-full h-8.5 text-xs sm:text-sm bg-background border border-border rounded px-2 text-foreground focus:outline-none focus:border-primary"
                      >
                        {FITNESS_LEVELS.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        DIETARY PREFERENCE
                      </label>
                      <select
                        value={modifyDiet}
                        onChange={(e) => setModifyDiet(e.target.value)}
                        className="w-full h-8.5 text-xs sm:text-sm bg-background border border-border rounded px-2 text-foreground focus:outline-none focus:border-primary"
                      >
                        {DIETARY_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      INJURY & FOCUS ADJUSTMENTS (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={modifyInjuries}
                      onChange={(e) => setModifyInjuries(e.target.value)}
                      placeholder="e.g. Lower back friendly, prefer dumbbells, more core..."
                      className="w-full h-8.5 text-xs sm:text-sm bg-background border border-border rounded px-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  {modifyError && (
                    <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 p-2.5 rounded">
                      <AlertCircle className="size-4 shrink-0" />
                      <span>{modifyError}</span>
                    </div>
                  )}

                  {modifySuccess && (
                    <div className="flex items-center gap-2 text-xs text-green-500 bg-green-500/10 border border-green-500/20 p-2.5 rounded font-mono">
                      <Check className="size-4 shrink-0" />
                      <span>{modifySuccess}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsModifyOpen(false)}
                      className="h-8 text-xs font-mono"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      disabled={isRegenerating}
                      onClick={handleRegeneratePlan}
                      className="h-8 px-4 text-xs font-mono bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    >
                      {isRegenerating ? (
                        <>
                          <RefreshCw className="size-3.5 mr-1.5 animate-spin" />
                          Regenerating Plan...
                        </>
                      ) : (
                        <>
                          <Sparkles className="size-3.5 mr-1.5" />
                          Regenerate with AI
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* TABS: WORKOUT & DIET */}
              <Tabs defaultValue="workout" className="w-full no-print">
                <TabsList className="mb-4 w-full grid grid-cols-2 bg-background/50 border border-border h-9.5 p-1 rounded-md">
                  <TabsTrigger
                    value="workout"
                    className="h-8 font-mono text-xs sm:text-sm data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <DumbbellIcon className="mr-2 size-4" />
                    Workout Plan
                  </TabsTrigger>

                  <TabsTrigger
                    value="diet"
                    className="h-8 font-mono text-xs sm:text-sm data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <AppleIcon className="mr-2 size-4" />
                    Diet Plan
                  </TabsTrigger>
                </TabsList>

                {/* WORKOUT TAB */}
                <TabsContent value="workout" className="space-y-4 focus-visible:outline-none">
                  {/* Schedule strip + Progress meter */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-border bg-background/40">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="size-4 text-primary shrink-0" />
                      <span className="font-mono text-xs sm:text-sm text-muted-foreground">
                        SCHEDULE:{" "}
                        <span className="text-foreground font-semibold">
                          {currentPlan.workoutplan.schedule.join(", ")}
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

                  {/* Days Accordion */}
                  <Accordion
                    type="multiple"
                    defaultValue={
                      todaySummary?.exerciseDay?.day
                        ? [todaySummary.exerciseDay.day]
                        : [currentPlan.workoutplan.exercises[0]?.day || ""]
                    }
                    className="space-y-3"
                  >
                    {currentPlan.workoutplan.exercises.map(
                      (exerciseDay, dayIdx) => {
                        // Count completed routines for this day
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
                                    {dayCompleted}/{exerciseDay.routines.length}{" "}
                                    DONE
                                  </span>
                                </div>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className="pb-4 px-4">
                              <div className="flex justify-end mb-2">
                                {dayCompleted > 0 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      resetDayCompletion(exerciseDay.day)
                                    }
                                    className="text-xs font-mono text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                                  >
                                    <RotateCcw className="size-3" />
                                    Reset Day Checks
                                  </button>
                                )}
                              </div>

                              <div className="space-y-2.5">
                                {exerciseDay.routines.map(
                                  (routine, routineIndex) => {
                                    const routineKey = `${exerciseDay.day}_${routineIndex}`;
                                    const isDone = Boolean(
                                      completedMap[routineKey]
                                    );
                                    const custom = customRoutines[routineKey];
                                    const activeName =
                                      custom?.name || routine.name;
                                    const activeSets =
                                      custom?.sets ?? routine.sets;
                                    const activeReps =
                                      custom?.reps ?? routine.reps;

                                    const isSwapping =
                                      swappingKey === routineKey;
                                    const suggestion = swapResults[routineKey];

                                    return (
                                      <div
                                        key={routineIndex}
                                        className={`border rounded-md p-3 transition-all ${
                                          isDone
                                            ? "border-green-500/30 bg-green-500/5 opacity-80"
                                            : "border-border bg-background/40 hover:border-border/80"
                                        }`}
                                      >
                                        <div className="flex items-start justify-between gap-2">
                                          {/* FEATURE B: Checkbox + Name */}
                                          <div className="flex items-start gap-2.5 grow">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                toggleComplete(routineKey)
                                              }
                                              className="mt-0.5 shrink-0 focus:outline-none"
                                              title={
                                                isDone
                                                  ? "Mark incomplete"
                                                  : "Mark complete"
                                              }
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

                                          {/* Sets / Reps & FEATURE C Swap Button */}
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

                                            {/* FEATURE C: SWAP BUTTON */}
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              disabled={isSwapping}
                                              onClick={() =>
                                                handleRequestSwap(
                                                  routineKey,
                                                  activeName,
                                                  exerciseDay.day
                                                )
                                              }
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

                                        {/* FEATURE C: INLINE SWAP SUGGESTION */}
                                        {suggestion && (
                                          <div className="mt-3 p-3 rounded border border-primary/40 bg-primary/5 space-y-2 animate-in fade-in duration-150">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-mono text-primary font-bold tracking-wide">
                                                <Sparkles className="size-3.5" />
                                                SUGGESTED ALTERNATIVE:
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleDismissSwap(routineKey)
                                                }
                                                className="text-muted-foreground hover:text-foreground"
                                              >
                                                <X className="size-3.5" />
                                              </button>
                                            </div>

                                            <div className="text-sm font-bold text-foreground">
                                              {suggestion.name}{" "}
                                              <span className="font-mono text-muted-foreground text-xs">
                                                ({suggestion.sets} sets ×{" "}
                                                {suggestion.reps} reps)
                                              </span>
                                            </div>

                                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                              {suggestion.reason}
                                            </p>

                                            <div className="flex items-center gap-2 pt-1">
                                              <Button
                                                type="button"
                                                size="sm"
                                                onClick={() =>
                                                  handleAcceptSwap(routineKey)
                                                }
                                                className="h-6 px-2.5 text-xs font-mono bg-primary text-primary-foreground font-semibold"
                                              >
                                                <Check className="size-3 mr-1" />
                                                Accept Swap
                                              </Button>
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                  handleDismissSwap(routineKey)
                                                }
                                                className="h-6 px-2 text-xs font-mono text-muted-foreground"
                                              >
                                                Dismiss
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      }
                    )}
                  </Accordion>
                </TabsContent>

                {/* DIET TAB */}
                <TabsContent value="diet" className="space-y-4 focus-visible:outline-none">
                  <div className="flex justify-between items-center p-3.5 rounded-lg border border-border bg-background/40">
                    <div>
                      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                        DAILY NUTRITION TARGET
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        Personalized for your fitness objective
                      </span>
                    </div>
                    <div className="font-mono text-xl sm:text-2xl font-bold text-primary tracking-tight">
                      {currentPlan.dietplan.dailyCalories} KCAL
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {currentPlan.dietplan.meals.map((meal, index) => (
                      <div
                        key={index}
                        className="border border-border bg-card/20 rounded-lg overflow-hidden p-4 space-y-2.5"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-border/60">
                          <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-primary" />
                            <h4 className="font-mono text-base font-bold text-primary tracking-tight">
                              {meal.name}
                            </h4>
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">
                            {meal.foods.length} items
                          </span>
                        </div>

                        <ul className="space-y-1.5">
                          {meal.foods.map((food, foodIndex) => (
                            <li
                              key={foodIndex}
                              className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground"
                            >
                              <span className="text-xs text-primary font-mono font-semibold mt-0.5">
                                {String(foodIndex + 1).padStart(2, "0")}
                              </span>
                              <span className="text-foreground/95 leading-normal">{food}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* PRINT-ONLY COMPLETE WORKOUT & NUTRITION DOSSIER */}
              <PrintablePlanDossier
                plan={currentPlan}
                userName={user?.fullName || user?.firstName}
              />
            </div>
          )}
        </div>
      ) : (
        <NoFitnessPlan />
      )}

      {/* PLAN DELETION CONFIRMATION MODAL */}
      {planToDelete && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-xl border border-destructive/40 bg-card/95 p-5 sm:p-6 shadow-2xl space-y-4">
            <CornerElements />

            <div className="flex items-start gap-3">
              <div className="size-10 rounded-lg bg-destructive/15 border border-destructive/30 flex items-center justify-center text-destructive shrink-0">
                <AlertCircle className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                  CONFIRM DELETION
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Are you sure you want to permanently delete{" "}
                  <span className="text-primary font-semibold font-mono">
                    "{planToDelete.name}"
                  </span>
                  ?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-xs font-mono space-y-1.5">
              <p className="font-semibold text-destructive flex items-center gap-1.5">
                ⚠️ PERMANENT PURGE PROTOCOL
              </p>
              <p className="text-muted-foreground leading-normal">
                This will remove the workout routines, schedule, and diet
                architecture. All local exercise completion tracking will also
                be purged.
              </p>
              {planToDelete.isActive && allPlans && allPlans.length > 1 && (
                <p className="text-primary pt-1 font-sans text-xs">
                  • This is currently your active plan. Another saved plan will
                  automatically become active.
                </p>
              )}
              {allPlans && allPlans.length === 1 && (
                <p className="text-amber-400 pt-1 font-sans text-xs">
                  • This is your only plan. Deleting it will return you to the
                  initial program generator.
                </p>
              )}
            </div>

            {deleteError && (
              <div className="p-2.5 rounded bg-destructive/20 border border-destructive text-destructive text-xs font-mono">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting}
                onClick={() => {
                  setPlanToDelete(null);
                  setDeleteError(null);
                }}
                className="h-9 px-4 text-xs font-mono border-border hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="h-9 px-4 text-xs font-mono font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="size-3.5 mr-1.5 animate-spin" /> Purging...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-3.5 mr-1.5" /> Confirm Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
