"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "@/components/ProfileHeader";
import NoFitnessPlan from "@/components/NoFitnessPlan";
import CornerElements from "@/components/CornerElements";
import PrintablePlanDossier from "@/components/PrintablePlanDossier";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RestTimer from "@/components/RestTimer";
import GroceryListModal from "@/components/GroceryListModal";
import MissionDispatchCard from "@/components/profile/MissionDispatchCard";
import PlanSelector from "@/components/profile/PlanSelector";
import PlanOptimizerDrawer from "@/components/profile/PlanOptimizerDrawer";
import WorkoutDayTabs from "@/components/profile/WorkoutDayTabs";
import DietSection from "@/components/profile/DietSection";
import PlanHeaderActions from "@/components/profile/PlanHeaderActions";
import PlanDeleteDialog from "@/components/profile/PlanDeleteDialog";
import { usePlanManagement } from "@/hooks/usePlanManagement";
import { useWorkoutProgress } from "@/hooks/useWorkoutProgress";
import { useExerciseSwap } from "@/hooks/useExerciseSwap";
import { usePlanOptimizer } from "@/hooks/usePlanOptimizer";
import { AppleIcon, DumbbellIcon } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();
  const userId = user?.id as string;

  // 1. Plan Management Hook
  const allPlans = useQuery(api.plans.getUserplans, { userId });
  const {
    selectedPlanId,
    setSelectedPlanId,
    currentPlan,
    planToDelete,
    setPlanToDelete,
    isDeleting,
    deleteError,
    isActivatingId,
    handleSetActive,
    handleConfirmDelete,
    handleCancelDelete,
  } = usePlanManagement(userId, allPlans);

  // 2. Modals state
  const [isGroceryOpen, setIsGroceryOpen] = useState(false);
  const [isRestTimerOpen, setIsRestTimerOpen] = useState(false);

  // 3. Workout Progress & Cloud Sync Hook
  const {
    completedMap,
    streakData,
    toggleComplete,
    resetDayCompletion,
  } = useWorkoutProgress(
    userId,
    currentPlan?._id,
    currentPlan?.workoutplan?.exercises
  );

  // 4. AI Exercise Swap Hook
  const {
    swappingKey,
    swapResults,
    customRoutines,
    handleRequestSwap,
    handleAcceptSwap,
    handleDismissSwap,
  } = useExerciseSwap(currentPlan?.name);

  // 5. Plan Optimizer Drawer Hook
  const {
    isModifyOpen,
    setIsModifyOpen,
    modifyGoal,
    setModifyGoal,
    modifyDays,
    setModifyDays,
    modifyLevel,
    setModifyLevel,
    modifyDiet,
    setModifyDiet,
    modifyInjuries,
    setModifyInjuries,
    applyPreset,
    handleRegeneratePlan,
    isRegenerating,
    modifyError,
    modifySuccess,
    fitnessGoals,
    fitnessLevels,
    dietaryOptions,
  } = usePlanOptimizer(currentPlan, user);

  // Stabilized callbacks
  const handleToggleModify = useCallback(() => {
    setIsModifyOpen((prev) => !prev);
  }, [setIsModifyOpen]);

  const handleToggleRestTimer = useCallback(() => {
    setIsRestTimerOpen((prev) => !prev);
  }, []);

  const handleOpenGrocery = useCallback(() => {
    setIsGroceryOpen(true);
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const router = useRouter();

  const handleStartWorkout = useCallback(() => {
    router.push("/session");
  }, [router]);

  // Today / Dashboard Summary Calculation
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
          {/* TODAY MISSION DISPATCH */}
          {todaySummary && (
            <MissionDispatchCard
              todaySummary={todaySummary}
              currentStreak={streakData?.currentStreak ?? 0}
              onStartWorkout={handleStartWorkout}
            />
          )}

          {/* PLAN SELECTOR (MEMOIZED) */}
          <PlanSelector
            plans={allPlans}
            selectedPlanId={selectedPlanId}
            onSelectPlan={setSelectedPlanId}
            onRequestDelete={setPlanToDelete}
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

              {/* PLAN HEADER ACTIONS BAR */}
              <PlanHeaderActions
                planId={currentPlan._id}
                planName={currentPlan.name}
                isActive={!!currentPlan.isActive}
                isActivating={isActivatingId === currentPlan._id}
                isModifyOpen={isModifyOpen}
                onSetActive={handleSetActive}
                onToggleRestTimer={handleToggleRestTimer}
                onOpenGrocery={handleOpenGrocery}
                onPrint={handlePrint}
                onToggleModify={handleToggleModify}
                onRequestDelete={setPlanToDelete}
              />

              {/* CONTROLLED MODIFY / REGENERATE DRAWER (MEMOIZED) */}
              <PlanOptimizerDrawer
                isOpen={isModifyOpen}
                onClose={handleToggleModify}
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
                fitnessGoals={fitnessGoals}
                fitnessLevels={fitnessLevels}
                dietaryOptions={dietaryOptions}
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
                    currentStreak={streakData?.currentStreak ?? 0}
                    longestStreak={streakData?.longestStreak ?? 0}
                    weeklyAdherence={streakData?.weeklyAdherence ?? 0}
                    totalCompletions={streakData?.totalCompletions ?? 0}
                    onToggleComplete={toggleComplete}
                    onResetDayCompletion={resetDayCompletion}
                    onRequestSwap={handleRequestSwap}
                    onAcceptSwap={handleAcceptSwap}
                    onDismissSwap={handleDismissSwap}
                    onStartRestTimer={handleToggleRestTimer}
                  />
                </TabsContent>

                {/* DIET TAB */}
                <TabsContent value="diet" className="space-y-4 focus-visible:outline-none">
                  <DietSection
                    dietplan={currentPlan.dietplan}
                    onOpenGrocery={handleOpenGrocery}
                  />
                </TabsContent>
              </Tabs>

              {/* PRINT-ONLY COMPLETE WORKOUT & NUTRITION DOSSIER (MEMOIZED) */}
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
      <PlanDeleteDialog
        planToDelete={planToDelete}
        isDeleting={isDeleting}
        deleteError={deleteError}
        totalPlansCount={allPlans?.length || 0}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

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
          onClose={handleToggleRestTimer}
        />
      )}
    </section>
  );
}
