import React from "react";
import CornerElements from "@/components/CornerElements";
import { Trash2 } from "lucide-react";

interface PlanItem {
  _id: string;
  name: string;
  isActive?: boolean;
}

interface PlanSelectorProps {
  plans: PlanItem[];
  selectedPlanId: string | null;
  onSelectPlan: (id: string) => void;
  onRequestDelete: (plan: { id: string; name: string; isActive: boolean }) => void;
}

export default function PlanSelector({
  plans,
  selectedPlanId,
  onSelectPlan,
  onRequestDelete,
}: PlanSelectorProps) {
  return (
    <div className="no-print relative backdrop-blur-sm border border-border bg-card/30 rounded-lg p-4 sm:p-4.5">
      <CornerElements />
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight">
          <span className="text-primary">Your</span>{" "}
          <span className="text-foreground">Fitness Plans</span>
        </h2>
        <div className="font-mono text-xs font-semibold text-muted-foreground">
          TOTAL: {plans.length}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {plans.map((plan) => {
          const isSelected =
            selectedPlanId === plan._id || (!selectedPlanId && plan.isActive);
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
                onClick={() => onSelectPlan(plan._id)}
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
                  onRequestDelete({
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
  );
}
