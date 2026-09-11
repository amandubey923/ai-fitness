import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createplan = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    workoutplan: v.object({
      schedule: v.array(v.string()),
      exercises: v.array(
        v.object({
          day: v.string(),
          routines: v.array(
            v.object({
              name: v.string(),
              sets: v.optional(v.number()),
              reps: v.optional(v.number()),
            })
          ),
        })
      ),
    }),
    dietplan: v.object({
      dailyCalories: v.number(),
      meals: v.array(
        v.object({
          name: v.string(),
          foods: v.array(v.string()),
        })
      ),
    }),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const activeplans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    for (const plan of activeplans) {
      await ctx.db.patch(plan._id, { isActive: false });
    }

    const planId = await ctx.db.insert("plans", args);

    return planId;
  },
});

export const getUserplans = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const plans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return plans;
  },
});

export const deletePlan = mutation({
  args: {
    planId: v.id("plans"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Plan not found");
    }

    // Ownership verification
    if (plan.userId !== args.userId) {
      throw new Error("Unauthorized to delete this plan");
    }

    const wasActive = plan.isActive;

    // Delete the plan document
    await ctx.db.delete(args.planId);

    // If the deleted plan was active, automatically promote the newest remaining plan
    if (wasActive) {
      const remainingPlans = await ctx.db
        .query("plans")
        .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
        .order("desc")
        .collect();

      if (remainingPlans.length > 0) {
        await ctx.db.patch(remainingPlans[0]._id, { isActive: true });
      }
    }

    return { success: true };
  },
});

export const setActivePlan = mutation({
  args: {
    planId: v.id("plans"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const targetPlan = await ctx.db.get(args.planId);
    if (!targetPlan) {
      throw new Error("Plan not found");
    }

    // Ownership verification
    if (targetPlan.userId !== args.userId) {
      throw new Error("Unauthorized: you do not own this plan");
    }

    // Deactivate all existing active plans for this user
    const currentActivePlans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    for (const plan of currentActivePlans) {
      if (plan._id !== args.planId) {
        await ctx.db.patch(plan._id, { isActive: false });
      }
    }

    // Set target plan as active
    await ctx.db.patch(args.planId, { isActive: true });

    return { success: true };
  },
});