"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";

export interface PlanItem {
  _id: string;
  name: string;
  isActive?: boolean;
}

export interface PlanToDelete {
  id: string;
  name: string;
  isActive: boolean;
}

export function usePlanManagement(
  userId: string | undefined,
  allPlans: Doc<"plans">[] | undefined
) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [planToDelete, setPlanToDelete] = useState<PlanToDelete | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isActivatingId, setIsActivatingId] = useState<string | null>(null);

  const deletePlanMutation = useMutation(api.plans.deletePlan);
  const setActivePlanMutation = useMutation(api.plans.setActivePlan);

  const activePlan = allPlans?.find((plan) => plan.isActive);
  const currentPlan = selectedPlanId
    ? allPlans?.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  const handleSetActive = async (planId: string) => {
    if (!userId) return;
    setIsActivatingId(planId);
    try {
      await setActivePlanMutation({
        planId: planId as Id<"plans">,
        userId,
      });
      setSelectedPlanId(planId);
    } catch (err: any) {
      console.error("Failed to set active plan:", err);
    } finally {
      setIsActivatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete || !userId) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deletePlanMutation({
        planId: planToDelete.id as Id<"plans">,
        userId,
      });

      try {
        localStorage.removeItem(`fitpilot_completed_${planToDelete.id}`);
        localStorage.removeItem(`fitpilot_migrated_${planToDelete.id}`);
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

  const handleCancelDelete = () => {
    setPlanToDelete(null);
    setDeleteError(null);
  };

  return {
    selectedPlanId,
    setSelectedPlanId,
    currentPlan,
    activePlan,
    planToDelete,
    setPlanToDelete,
    isDeleting,
    deleteError,
    isActivatingId,
    handleSetActive,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
