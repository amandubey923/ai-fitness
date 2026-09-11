import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  plans: defineTable({
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
              duration: v.optional(v.string()),
              description: v.optional(v.string()),
              exercises: v.optional(v.array(v.string())),
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
  })
    .index("by_user_id", ["userId"])
    .index("by_active", ["isActive"]),

  workout_logs: defineTable({
    userId: v.string(),
    planId: v.id("plans"),
    date: v.string(), // "YYYY-MM-DD"
    routineKey: v.string(), // "${day}_${routineIndex}"
    exerciseName: v.string(),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user_and_plan", ["userId", "planId"])
    .index("by_user_plan_date", ["userId", "planId", "date"])
    .index("by_user_date", ["userId", "date"]),
});