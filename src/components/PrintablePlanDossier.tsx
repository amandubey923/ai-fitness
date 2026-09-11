import React, { memo } from "react";

interface RoutineItem {
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
  description?: string;
  exercises?: string[];
}

interface ExerciseDay {
  day: string;
  routines: RoutineItem[];
}

interface MealItem {
  name: string;
  foods: string[];
}

interface PrintablePlanDossierProps {
  plan: {
    name: string;
    workoutplan: {
      schedule: string[];
      exercises: ExerciseDay[];
    };
    dietplan: {
      dailyCalories: number;
      meals: MealItem[];
    };
  };
  userName?: string | null;
}

function PrintablePlanDossierComponent({
  plan,
  userName,
}: PrintablePlanDossierProps) {
  const athleteName = userName || "Athlete";
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const splitSchedule =
    plan.workoutplan.schedule?.join(" • ") || "Weekly Split";

  return (
    <div className="print-only text-neutral-900 bg-white font-sans p-4">
      {/* DOSSIER HEADER */}
      <div className="border-b-2 border-neutral-900 pb-3 mb-5 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold uppercase tracking-wider bg-neutral-900 text-white px-2 py-0.5 rounded">
              FITPILOT AI
            </span>
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-wider font-semibold">
              TACTICAL PROGRAM DOSSIER
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 uppercase">
            {plan.name}
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Athlete:{" "}
            <span className="font-semibold text-neutral-900">
              {athleteName}
            </span>{" "}
            • Calorie Target:{" "}
            <span className="font-semibold text-neutral-900">
              {plan.dietplan.dailyCalories} kcal/day
            </span>
          </p>
        </div>
        <div className="text-right font-mono text-[11px] text-neutral-500">
          <div>DATE: {formattedDate}</div>
          <div className="font-semibold text-neutral-800 mt-0.5">
            SPLIT: {splitSchedule}
          </div>
        </div>
      </div>

      {/* 01. WORKOUT ARCHITECTURE */}
      <div className="mb-6">
        <div className="flex items-center justify-between border-b border-neutral-300 pb-1.5 mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-mono">
            01 // WEEKLY WORKOUT ROUTINES
          </h2>
          <span className="text-[11px] font-mono text-neutral-500">
            {plan.workoutplan.exercises?.length || 0} Scheduled Training Days
          </span>
        </div>

        <div className="space-y-3.5">
          {plan.workoutplan.exercises?.map((exerciseDay, dayIdx) => (
            <div
              key={dayIdx}
              className="print-avoid-break border border-neutral-300 rounded-md p-3 bg-neutral-50/70"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5 mb-2">
                <span className="font-mono font-bold text-xs text-neutral-900 uppercase">
                  SESSION: {exerciseDay.day}
                </span>
                <span className="text-[10px] font-mono text-neutral-600 font-medium">
                  {exerciseDay.routines?.length || 0} Exercises
                </span>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-300 font-mono text-neutral-500 text-[10px] uppercase">
                    <th className="py-1 w-8 text-center">[✓]</th>
                    <th className="py-1 w-6 text-neutral-400">#</th>
                    <th className="py-1">Exercise / Movement</th>
                    <th className="py-1 w-16 text-center">Sets</th>
                    <th className="py-1 w-16 text-center">Reps</th>
                    <th className="py-1 w-36">Guidance / Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {exerciseDay.routines?.map((routine, rIdx) => (
                    <tr key={rIdx} className="py-1">
                      <td className="py-1.5 text-center text-neutral-400 font-mono">
                        <span className="inline-block size-3.5 border border-neutral-400 rounded-xs"></span>
                      </td>
                      <td className="py-1.5 font-mono text-[11px] text-neutral-400">
                        {String(rIdx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-1.5 font-semibold text-neutral-900 text-xs">
                        {routine.name}
                      </td>
                      <td className="py-1.5 text-center font-mono text-neutral-800 text-xs">
                        {routine.sets ?? "-"}
                      </td>
                      <td className="py-1.5 text-center font-mono text-neutral-800 text-xs">
                        {routine.reps ?? "-"}
                      </td>
                      <td className="py-1.5 text-neutral-600 font-mono text-[10px]">
                        {routine.duration ||
                          routine.description ||
                          "Form & Control"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      {/* 02. NUTRITION ARCHITECTURE */}
      <div className="print-avoid-break mb-5">
        <div className="flex items-center justify-between border-b border-neutral-300 pb-1.5 mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-mono">
            02 // DAILY NUTRITION ARCHITECTURE
          </h2>
          <span className="text-[11px] font-mono font-bold text-neutral-900 bg-neutral-200 px-2 py-0.5 rounded">
            TARGET: {plan.dietplan.dailyCalories} KCAL / DAY
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {plan.dietplan.meals?.map((meal, mIdx) => (
            <div
              key={mIdx}
              className="print-avoid-break border border-neutral-300 rounded-md p-2.5 bg-neutral-50/70"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 pb-1 mb-1.5">
                <h3 className="font-mono font-bold text-xs text-neutral-900 uppercase">
                  {meal.name}
                </h3>
                <span className="text-[10px] font-mono text-neutral-500">
                  {meal.foods?.length || 0} Items
                </span>
              </div>
              <ul className="space-y-1 text-xs text-neutral-700">
                {meal.foods?.map((food, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-1.5">
                    <span className="text-neutral-400 font-mono text-[10px]">
                      •
                    </span>
                    <span className="leading-tight">{food}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* PRINT FOOTER */}
      <div className="border-t border-neutral-300 pt-2 flex justify-between items-center text-[10px] font-mono text-neutral-500">
        <div>FITPILOT AI • INTELLIGENT WORKOUT & NUTRITION ENGINE</div>
        <div>https://fit-pilot-ai.vercel.app</div>
      </div>
    </div>
  );
}

export default memo(PrintablePlanDossierComponent);

