"use client";

import React, { memo } from "react";
import CornerElements from "@/components/CornerElements";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";

export interface PlanToDelete {
  id: string;
  name: string;
  isActive: boolean;
}

interface PlanDeleteDialogProps {
  planToDelete: PlanToDelete | null;
  isDeleting: boolean;
  deleteError: string | null;
  totalPlansCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

function PlanDeleteDialogComponent({
  planToDelete,
  isDeleting,
  deleteError,
  totalPlansCount,
  onCancel,
  onConfirm,
}: PlanDeleteDialogProps) {
  if (!planToDelete) return null;

  return (
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
            architecture. All exercise completion tracking will also be purged.
          </p>
          {planToDelete.isActive && totalPlansCount > 1 && (
            <p className="text-primary pt-1 font-sans text-xs">
              • This is currently your active plan. Another saved plan will
              automatically become active.
            </p>
          )}
          {totalPlansCount === 1 && (
            <p className="text-amber-400 pt-1 font-sans text-xs">
              • This is your only plan. Deleting it will return you to the initial
              program generator.
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
            onClick={onCancel}
            className="h-9 px-4 text-xs font-mono border-border hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={isDeleting}
            onClick={onConfirm}
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
  );
}

export default memo(PlanDeleteDialogComponent);
