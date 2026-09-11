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
import RestTimer from "@/components/RestTimer";
import GroceryListModal from "@/components/GroceryListModal";
import MissionDispatchCard from "@/components/profile/MissionDispatchCard";
import PlanSelector from "@/components/profile/PlanSelector";
import PlanOptimizerDrawer from "@/components/profile/PlanOptimizerDrawer";
import WorkoutDayTabs from "@/components/profile/WorkoutDayTabs";
import { SwapResult } from "@/components/profile/ExerciseCardRow";
import {
  AppleIcon,
  CalendarIcon,
  DumbbellIcon,
  CheckCircle2,
  Circle,
  SlidersHorizontal,
  Sparkles,
  AlertCircle,
  Check,
  Trash2,
  Loader2,
  Printer,
  ShoppingCart,
  Timer,
} from "lucide-react";

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
  const [isGroceryOpen, setIsGroceryOpen] = useState(false);
  const [isRestTimerOpen, setIsRestTimerOpen] = useState(false);

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
            <MissionDispatchCard
              todaySummary={todaySummary}
              onStartWorkout={() => {
                const el = document.getElementById("plan-tabs-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          )}

          {/* PLAN SELECTOR */}
          <PlanSelector
            plans={allPlans}
            selectedPlanId={selectedPlanId}
            onSelectPlan={(id) => setSelectedPlanId(id)}
            onRequestDelete={(plan) => setPlanToDelete(plan)}
          />

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
                    onClick={() => setIsRestTimerOpen(!isRestTimerOpen)}
                    className="h-8 px-2.5 text-xs sm:text-sm font-mono font-medium border-border hover:border-primary/50 text-foreground transition-colors"
                    title="Open Rest & Interval Timer"
                  >
                    <Timer className="size-3.5 mr-1 text-primary" />
                    Timer
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsGroceryOpen(true)}
                    className="h-8 px-2.5 text-xs sm:text-sm font-mono font-medium border-border hover:border-primary/50 text-foreground transition-colors"
                    title="View Smart Grocery List"
                  >
                    <ShoppingCart className="size-3.5 mr-1 text-primary" />
                    Grocery List
                  </Button>

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
              <PlanOptimizerDrawer
                isOpen={isModifyOpen}
                onClose={() => setIsModifyOpen(false)}
                modifyGoal={modifyGoal}
                setModifyGoal={setModifyGoal}
                modifyDays={modifyDays}
                setModifyDays={setModifyDays}
                modifyLevel={modifyLevel}
                setModifyLevel={setModifyLevel}
                modifyDiet={modifyDiet}
                setModifyDiet={setModifyDiet}
                modifyInjuries={modifyInjuries}
                setModifyInjuries={setModifyInjuries}
                applyPreset={applyPreset}
                handleRegeneratePlan={handleRegeneratePlan}
                isRegenerating={isRegenerating}
                modifyError={modifyError}
                modifySuccess={modifySuccess}
                fitnessGoals={FITNESS_GOALS}
                fitnessLevels={FITNESS_LEVELS}
                dietaryOptions={DIETARY_OPTIONS}
              />

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
                  <WorkoutDayTabs
                    schedule={currentPlan.workoutplan.schedule}
                    exercises={currentPlan.workoutplan.exercises}
                    completedMap={completedMap}
                    customRoutines={customRoutines}
                    swappingKey={swappingKey}
                    swapResults={swapResults}
                    defaultOpenDay={todaySummary?.exerciseDay?.day}
                    totalCompletedCount={totalCompletedCount}
                    totalRoutinesInPlan={totalRoutinesInPlan}
                    progressPercent={progressPercent}
                    onToggleComplete={toggleComplete}
                    onResetDayCompletion={resetDayCompletion}
                    onRequestSwap={handleRequestSwap}
                    onAcceptSwap={handleAcceptSwap}
                    onDismissSwap={handleDismissSwap}
                    onStartRestTimer={() => setIsRestTimerOpen(true)}
                  />
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
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsGroceryOpen(true)}
                        className="h-8 px-3 text-xs font-mono border-primary/40 text-primary hover:bg-primary/10"
                      >
                        <ShoppingCart className="size-3.5 mr-1.5" />
                        Grocery Checklist
                      </Button>
                      <div className="font-mono text-xl sm:text-2xl font-bold text-primary tracking-tight">
                        {currentPlan.dietplan.dailyCalories} KCAL
                      </div>
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

      {/* SMART GROCERY LIST MODAL */}
      {currentPlan && (
        <GroceryListModal
          isOpen={isGroceryOpen}
          onClose={() => setIsGroceryOpen(false)}
          meals={currentPlan.dietplan?.meals || []}
          planName={currentPlan.name}
          planId={currentPlan._id}
        />
      )}

      {/* REST & INTERVAL TIMER (FLOATING HUD) */}
      {isRestTimerOpen && (
        <RestTimer
          initialSeconds={60}
          onClose={() => setIsRestTimerOpen(false)}
        />
      )}
    </section>
  );
}
