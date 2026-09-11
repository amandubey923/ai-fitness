import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Toggle single exercise log (upsert semantics to prevent duplicates).
 */
export const toggleExerciseLog = mutation({
  args: {
    userId: v.string(),
    planId: v.id("plans"),
    date: v.string(), // "YYYY-MM-DD"
    routineKey: v.string(), // "${day}_${routineIndex}"
    exerciseName: v.string(),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Validate plan exists and belongs to user
    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.userId !== args.userId) {
      throw new Error("Unauthorized or plan not found");
    }

    // Lookup existing entry with index
    const existing = await ctx.db
      .query("workout_logs")
      .withIndex("by_user_plan_date", (q) =>
        q
          .eq("userId", args.userId)
          .eq("planId", args.planId)
          .eq("date", args.date)
      )
      .filter((q) => q.eq(q.field("routineKey"), args.routineKey))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        completed: args.completed,
        completedAt: args.completed ? Date.now() : undefined,
        exerciseName: args.exerciseName,
      });
      return existing._id;
    } else {
      const id = await ctx.db.insert("workout_logs", {
        userId: args.userId,
        planId: args.planId,
        date: args.date,
        routineKey: args.routineKey,
        exerciseName: args.exerciseName,
        completed: args.completed,
        completedAt: args.completed ? Date.now() : undefined,
      });
      return id;
    }
  },
});

/**
 * Batch sync logs (for debounced queue flushing or one-time localStorage import).
 */
export const batchSyncLogs = mutation({
  args: {
    userId: v.string(),
    planId: v.id("plans"),
    date: v.string(),
    updates: v.array(
      v.object({
        routineKey: v.string(),
        exerciseName: v.string(),
        completed: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.userId !== args.userId) {
      throw new Error("Unauthorized or plan not found");
    }

    // Fetch all logs for this user/plan/date once
    const existingLogs = await ctx.db
      .query("workout_logs")
      .withIndex("by_user_plan_date", (q) =>
        q
          .eq("userId", args.userId)
          .eq("planId", args.planId)
          .eq("date", args.date)
      )
      .collect();

    const logMap = new Map(existingLogs.map((l) => [l.routineKey, l]));

    for (const update of args.updates) {
      const existing = logMap.get(update.routineKey);
      if (existing) {
        if (existing.completed !== update.completed) {
          await ctx.db.patch(existing._id, {
            completed: update.completed,
            completedAt: update.completed ? Date.now() : undefined,
            exerciseName: update.exerciseName,
          });
        }
      } else {
        await ctx.db.insert("workout_logs", {
          userId: args.userId,
          planId: args.planId,
          date: args.date,
          routineKey: update.routineKey,
          exerciseName: update.exerciseName,
          completed: update.completed,
          completedAt: update.completed ? Date.now() : undefined,
        });
      }
    }

    return { success: true, count: args.updates.length };
  },
});

/**
 * Get all logs for a plan (reactive real-time subscription).
 */
export const getPlanLogs = query({
  args: {
    userId: v.string(),
    planId: v.id("plans"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workout_logs")
      .withIndex("by_user_and_plan", (q) =>
        q.eq("userId", args.userId).eq("planId", args.planId)
      )
      .collect();
  },
});

/**
 * Calculate user streaks & adherence deterministically.
 */
export const getUserStreaks = query({
  args: {
    userId: v.string(),
    planId: v.id("plans"),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.userId !== args.userId) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        weeklyAdherence: 0,
        totalCompletions: 0,
      };
    }

    const logs = await ctx.db
      .query("workout_logs")
      .withIndex("by_user_and_plan", (q) =>
        q.eq("userId", args.userId).eq("planId", args.planId)
      )
      .collect();

    const totalCompletions = logs.filter((l) => l.completed).length;

    // Group completed routines by date
    const dateCompletions: Record<string, number> = {};
    for (const log of logs) {
      if (log.completed) {
        dateCompletions[log.date] = (dateCompletions[log.date] || 0) + 1;
      }
    }

    // Schedule weekdays in lowercase (e.g. ["monday", "wednesday", "friday"])
    const schedule = (plan.workoutplan.schedule || []).map((s) => s.toLowerCase());

    // Map scheduled days to routine counts
    const routinesPerDay: Record<string, number> = {};
    for (const exercise of plan.workoutplan.exercises || []) {
      routinesPerDay[exercise.day.toLowerCase()] = exercise.routines?.length || 0;
    }

    // Determine if a specific date (YYYY-MM-DD) qualifies as completed (>=80% or >=1 if short)
    const isDateCompleted = (dateStr: string) => {
      const parts = dateStr.split("-").map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      const weekday = d.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const targetCount = routinesPerDay[weekday] || 0;
      const doneCount = dateCompletions[dateStr] || 0;

      if (targetCount === 0) {
        return doneCount > 0;
      }
      return doneCount >= Math.ceil(targetCount * 0.8);
    };

    // Current Streak Calculation
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    let currentStreak = 0;
    let checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check up to 90 days in the past
    for (let i = 0; i < 90; i++) {
      const year = checkDate.getFullYear();
      const month = String(checkDate.getMonth() + 1).padStart(2, "0");
      const day = String(checkDate.getDate()).padStart(2, "0");
      const dStr = `${year}-${month}-${day}`;
      const weekday = checkDate.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const isScheduled = schedule.includes(weekday);

      const completed = isDateCompleted(dStr);

      if (completed) {
        currentStreak++;
      } else if (isScheduled) {
        // If today is scheduled and not yet completed, we don't break streak yet, just continue check yesterday
        if (i === 0 && dStr === todayStr) {
          // Hasn't completed today's workout yet, check previous day
        } else {
          // Missed scheduled workout day: streak ends
          break;
        }
      } else {
        // Scheduled rest day: streak preserved, keep walking back
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Longest Streak Calculation from distinct completion dates
    const distinctDates = Object.keys(dateCompletions)
      .filter((d) => isDateCompleted(d))
      .sort();

    let longestStreak = currentStreak;
    let tempStreak = 0;
    let prevTime: number | null = null;

    for (const dStr of distinctDates) {
      const parts = dStr.split("-").map(Number);
      const time = new Date(parts[0], parts[1] - 1, parts[2]).getTime();
      const oneDayMs = 24 * 60 * 60 * 1000;

      if (prevTime === null) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((time - prevTime) / oneDayMs);
        if (diffDays <= 3) {
          // Allow up to 2 rest days between sessions
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      prevTime = time;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    }

    // Weekly Adherence % (Current calendar week Monday -> Sunday)
    const currentDayOfWeek = now.getDay(); // 0 = Sunday
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);

    let scheduledDaysInWeek = 0;
    let completedDaysInWeek = 0;

    for (let d = 0; d < 7; d++) {
      const cur = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + d);
      const curWeekday = cur.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, "0");
      const dt = String(cur.getDate()).padStart(2, "0");
      const cStr = `${y}-${m}-${dt}`;

      if (schedule.includes(curWeekday)) {
        scheduledDaysInWeek++;
        if (isDateCompleted(cStr)) {
          completedDaysInWeek++;
        }
      }
    }

    const weeklyAdherence = scheduledDaysInWeek > 0
      ? Math.round((completedDaysInWeek / scheduledDaysInWeek) * 100)
      : 0;

    return {
      currentStreak,
      longestStreak,
      weeklyAdherence,
      totalCompletions,
    };
  },
});

/**
 * Get comprehensive dashboard stats for user:
 * - lifetime completions
 * - current and longest streak
 * - weekly adherence
 * - 30-day activity map
 * - recent 10 completed activities
 */
export const getDashboardStats = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Fetch active plan for this user
    const activePlan = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    // 2. Query bounded recent logs for user (most recent 200 logs by user date)
    const recentLogs = await ctx.db
      .query("workout_logs")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(200);

    // Lifetime completions across all plans
    const allUserLogs = await ctx.db
      .query("workout_logs")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
      .collect();

    const lifetimeCompletions = allUserLogs.filter((l) => l.completed).length;

    // Date completion map for all user logs
    const dateCompletions: Record<string, number> = {};
    for (const log of allUserLogs) {
      if (log.completed) {
        dateCompletions[log.date] = (dateCompletions[log.date] || 0) + 1;
      }
    }

    // Schedule info from active plan
    const schedule = (activePlan?.workoutplan.schedule || []).map((s) => s.toLowerCase());
    const routinesPerDay: Record<string, number> = {};
    if (activePlan?.workoutplan.exercises) {
      for (const ex of activePlan.workoutplan.exercises) {
        routinesPerDay[ex.day.toLowerCase()] = ex.routines?.length || 0;
      }
    }

    const isDateCompleted = (dateStr: string) => {
      const parts = dateStr.split("-").map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      const weekday = d.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const targetCount = routinesPerDay[weekday] || 0;
      const doneCount = dateCompletions[dateStr] || 0;

      if (targetCount === 0) {
        return doneCount > 0;
      }
      return doneCount >= Math.ceil(targetCount * 0.8);
    };

    // Calculate current streak
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    let currentStreak = 0;
    let checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (let i = 0; i < 90; i++) {
      const year = checkDate.getFullYear();
      const month = String(checkDate.getMonth() + 1).padStart(2, "0");
      const day = String(checkDate.getDate()).padStart(2, "0");
      const dStr = `${year}-${month}-${day}`;
      const weekday = checkDate.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const isScheduled = schedule.includes(weekday);

      const completed = isDateCompleted(dStr);

      if (completed) {
        currentStreak++;
      } else if (isScheduled) {
        if (i === 0 && dStr === todayStr) {
          // Hasn't completed today's workout yet, continue back
        } else {
          break;
        }
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Longest streak
    const distinctDates = Object.keys(dateCompletions)
      .filter((d) => isDateCompleted(d))
      .sort();

    let longestStreak = currentStreak;
    let tempStreak = 0;
    let prevTime: number | null = null;

    for (const dStr of distinctDates) {
      const parts = dStr.split("-").map(Number);
      const time = new Date(parts[0], parts[1] - 1, parts[2]).getTime();
      const oneDayMs = 24 * 60 * 60 * 1000;

      if (prevTime === null) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((time - prevTime) / oneDayMs);
        if (diffDays <= 3) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      prevTime = time;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    }

    // Weekly adherence
    const currentDayOfWeek = now.getDay();
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);

    let scheduledDaysInWeek = 0;
    let completedDaysInWeek = 0;

    for (let d = 0; d < 7; d++) {
      const cur = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + d);
      const curWeekday = cur.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, "0");
      const dt = String(cur.getDate()).padStart(2, "0");
      const cStr = `${y}-${m}-${dt}`;

      if (schedule.includes(curWeekday)) {
        scheduledDaysInWeek++;
        if (isDateCompleted(cStr)) {
          completedDaysInWeek++;
        }
      }
    }

    const weeklyAdherence = scheduledDaysInWeek > 0
      ? Math.round((completedDaysInWeek / scheduledDaysInWeek) * 100)
      : 0;

    // 30-Day Activity Heatmap array (from 29 days ago to today)
    const thirtyDayActivity: {
      date: string;
      dayOfWeek: string;
      completedCount: number;
      isScheduled: boolean;
      status: "completed" | "partial" | "rest" | "missed";
    }[] = [];

    const start30 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);

    for (let i = 0; i < 30; i++) {
      const d = new Date(start30.getFullYear(), start30.getMonth(), start30.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dt = String(d.getDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${dt}`;
      const weekday = d.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const isScheduled = schedule.includes(weekday);
      const count = dateCompletions[dateStr] || 0;
      const targetCount = routinesPerDay[weekday] || 0;

      let status: "completed" | "partial" | "rest" | "missed" = "rest";
      if (count > 0) {
        if (targetCount === 0 || count >= Math.ceil(targetCount * 0.8)) {
          status = "completed";
        } else {
          status = "partial";
        }
      } else if (isScheduled) {
        if (dateStr === todayStr) {
          status = "rest"; // today hasn't happened / in progress
        } else {
          status = "missed";
        }
      }

      thirtyDayActivity.push({
        date: dateStr,
        dayOfWeek: weekday.slice(0, 3).toUpperCase(),
        completedCount: count,
        isScheduled,
        status,
      });
    }

    // Recent completed activity list (up to 10 latest completed logs)
    const recentActivity = recentLogs
      .filter((l) => l.completed)
      .slice(0, 10)
      .map((l) => ({
        _id: l._id,
        exerciseName: l.exerciseName,
        date: l.date,
        completedAt: l.completedAt,
      }));

    return {
      lifetimeCompletions,
      currentStreak,
      longestStreak,
      weeklyAdherence,
      thirtyDayActivity,
      recentActivity,
      activePlanName: activePlan?.name || null,
    };
  },
});
