"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Check,
  CheckCircle2,
  Loader2,
  Printer,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Timer,
  Trash2,
} from "lucide-react";

interface PlanHeaderActionsProps {
  planId: string;
  planName: string;
  isActive: boolean;
  isActivating: boolean;
  isModifyOpen: boolean;
  onSetActive: (planId: string) => void;
  onToggleRestTimer: () => void;
  onOpenGrocery: () => void;
  onPrint: () => void;
  onToggleModify: () => void;
  onRequestDelete: (plan: { id: string; name: string; isActive: boolean }) => void;
}

function PlanHeaderActionsComponent({
  planId,
  planName,
  isActive,
  isActivating,
  isModifyOpen,
  onSetActive,
  onToggleRestTimer,
  onOpenGrocery,
  onPrint,
  onToggleModify,
  onRequestDelete,
}: PlanHeaderActionsProps) {
  return (
    <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-border/60">
      <div className="flex flex-wrap items-center gap-2">
        <div className="size-2 rounded-full bg-primary animate-pulse" />
        <h3 className="text-lg sm:text-xl font-bold font-mono tracking-tight">
          PLAN: <span className="text-primary">{planName}</span>
        </h3>
        {isActive ? (
          <span className="ml-1 bg-green-500/15 text-green-400 border border-green-500/30 text-xs px-2 py-0.5 rounded font-mono font-semibold flex items-center gap-1">
            <CheckCircle2 className="size-3" /> ACTIVE
          </span>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled={isActivating}
            onClick={() => onSetActive(planId)}
            className="h-6.5 px-2 text-xs font-mono border-primary/40 text-primary hover:bg-primary/10 ml-1"
          >
            {isActivating ? (
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
          onClick={onToggleRestTimer}
          className="h-8 px-2.5 text-xs sm:text-sm font-mono font-medium border-border hover:border-primary/50 text-foreground transition-colors"
          title="Open Rest & Interval Timer"
        >
          <Timer className="size-3.5 mr-1 text-primary" />
          Timer
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenGrocery}
          className="h-8 px-2.5 text-xs sm:text-sm font-mono font-medium border-border hover:border-primary/50 text-foreground transition-colors"
          title="View Smart Grocery List"
        >
          <ShoppingCart className="size-3.5 mr-1 text-primary" />
          Grocery List
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onPrint}
          className="h-8 px-2.5 text-xs sm:text-sm font-mono font-medium border-border hover:border-primary/50 text-foreground transition-colors"
          title="Print or Save Plan as PDF"
        >
          <Printer className="size-3.5 mr-1 text-primary" />
          Print / PDF
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onToggleModify}
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
            onRequestDelete({
              id: planId,
              name: planName,
              isActive,
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
  );
}

export default memo(PlanHeaderActionsComponent);
