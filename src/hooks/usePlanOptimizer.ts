"use client";

import { useState, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export const FITNESS_GOALS = [
  "Weight Loss",
  "Muscle Gain",
  "General Fitness",
  "Endurance",
  "Strength",
  "Flexibility",
];

export const FITNESS_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export const DIETARY_OPTIONS = [
  "None",
  "Vegetarian",
  "Vegan",
  "Lactose Intolerant",
  "Gluten-Free",
  "Keto",
  "Halal",
];

export function usePlanOptimizer(currentPlan: any, user: any) {
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

  return {
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
    fitnessGoals: FITNESS_GOALS,
    fitnessLevels: FITNESS_LEVELS,
    dietaryOptions: DIETARY_OPTIONS,
  };
}
