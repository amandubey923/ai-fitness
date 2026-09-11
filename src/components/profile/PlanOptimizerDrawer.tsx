import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertCircle, Check, RefreshCw } from "lucide-react";

interface PlanOptimizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  modifyGoal: string;
  setModifyGoal: (v: string) => void;
  modifyDays: number;
  setModifyDays: (v: number) => void;
  modifyLevel: string;
  setModifyLevel: (v: string) => void;
  modifyDiet: string;
  setModifyDiet: (v: string) => void;
  modifyInjuries: string;
  setModifyInjuries: (v: string) => void;
  applyPreset: (preset: "easier" | "harder" | "veg" | "days4") => void;
  handleRegeneratePlan: () => void;
  isRegenerating: boolean;
  modifyError: string | null;
  modifySuccess: string | null;
  fitnessGoals: string[];
  fitnessLevels: string[];
  dietaryOptions: string[];
}

function PlanOptimizerDrawerComponent({
  isOpen,
  onClose,
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
}: PlanOptimizerDrawerProps) {
  if (!isOpen) return null;

  return (
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
            {fitnessGoals.map((g) => (
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
            FITNESS LEVEL
          </label>
          <select
            value={modifyLevel}
            onChange={(e) => setModifyLevel(e.target.value)}
            className="w-full h-8.5 text-xs sm:text-sm bg-background border border-border rounded px-2 text-foreground focus:outline-none focus:border-primary"
          >
            {fitnessLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            DIET RESTRICTION
          </label>
          <select
            value={modifyDiet}
            onChange={(e) => setModifyDiet(e.target.value)}
            className="w-full h-8.5 text-xs sm:text-sm bg-background border border-border rounded px-2 text-foreground focus:outline-none focus:border-primary"
          >
            {dietaryOptions.map((diet) => (
              <option key={diet} value={diet}>
                {diet}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          CUSTOM INJURY OR WORKOUT PREFERENCES
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
          onClick={onClose}
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
  );
}

export default memo(PlanOptimizerDrawerComponent);
