/**
 * Utility functions for workout keys, dates, and progress calculations.
 */

/**
 * Get current local date string formatted as YYYY-MM-DD
 */
export function getTodayDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Parse a routineKey into day and index: "${day}_${index}"
 */
export function parseRoutineKey(routineKey: string): { day: string; index: number } {
  const [day, idxStr] = routineKey.split("_");
  const index = parseInt(idxStr, 10);
  return {
    day,
    index: isNaN(index) ? 0 : index,
  };
}

/**
 * Format a day and index into a standard routineKey: "${day}_${index}"
 */
export function formatRoutineKey(day: string, index: number): string {
  return `${day}_${index}`;
}

/**
 * Resolve exercise name from routines by key
 */
export function resolveExerciseName(
  exercises: { day: string; routines?: { name: string }[] }[] | undefined,
  routineKey: string,
  fallback = "Routine Exercise"
): string {
  if (!exercises) return fallback;
  const { day, index } = parseRoutineKey(routineKey);
  const dayObj = exercises.find((d) => d.day.toLowerCase() === day.toLowerCase());
  if (dayObj && dayObj.routines && dayObj.routines[index]) {
    return dayObj.routines[index].name;
  }
  return fallback;
}
