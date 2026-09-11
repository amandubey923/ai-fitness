"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import CornerElements from "@/components/CornerElements";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Trophy,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Activity,
  ArrowRight,
  Clock,
  Dumbbell,
  Loader2,
} from "lucide-react";

export default function ProgressDashboardPage() {
  const { user } = useUser();
  const userId = user?.id as string;

  const dashboardStats = useQuery(
    api.logs.getDashboardStats,
    userId ? { userId } : "skip"
  );

  return (
    <section className="relative z-10 pt-4 sm:pt-6 pb-16 grow container mx-auto px-4 max-w-5xl">
      {/* HEADER */}
      <div className="mb-6 pb-4 border-b border-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-primary uppercase">
              ANALYTICS & ADHERENCE MATRIX
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Progress <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {dashboardStats?.activePlanName
              ? `Active Program: ${dashboardStats.activePlanName}`
              : "Tracking workout consistency and exercise execution history"}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild size="sm" className="h-8.5 px-3.5 text-xs font-mono font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs">
            <Link href="/session" className="flex items-center gap-1.5">
              <Activity className="size-3.5" />
              <span>Start Workout</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="h-8.5 px-3 text-xs font-mono border-border text-foreground hover:border-primary/50">
            <Link href="/profile">Profile Plans</Link>
          </Button>
        </div>
      </div>

      {!dashboardStats ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="size-8 text-primary animate-spin" />
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Loading telemetry & logs...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 1. TOP METRICS STRIP */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* CURRENT STREAK */}
            <div className="relative backdrop-blur-sm border border-amber-500/30 bg-card/40 rounded-lg p-4 space-y-1">
              <CornerElements />
              <div className="flex items-center justify-between text-muted-foreground text-xs font-mono font-medium">
                <span className="uppercase tracking-wider">ACTIVE STREAK</span>
                <Flame className="size-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 tracking-tight">
                {dashboardStats.currentStreak}{" "}
                <span className="text-sm font-sans font-normal text-muted-foreground">
                  {dashboardStats.currentStreak === 1 ? "day" : "days"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Consecutive workout cadence</p>
            </div>

            {/* BEST STREAK RECORD */}
            <div className="relative backdrop-blur-sm border border-border bg-card/30 rounded-lg p-4 space-y-1">
              <CornerElements />
              <div className="flex items-center justify-between text-muted-foreground text-xs font-mono font-medium">
                <span className="uppercase tracking-wider">BEST RECORD</span>
                <Trophy className="size-4 text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
                {dashboardStats.longestStreak}{" "}
                <span className="text-sm font-sans font-normal text-muted-foreground">
                  {dashboardStats.longestStreak === 1 ? "day" : "days"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">All-time peak consistency</p>
            </div>

            {/* WEEKLY ADHERENCE */}
            <div className="relative backdrop-blur-sm border border-border bg-card/30 rounded-lg p-4 space-y-1">
              <CornerElements />
              <div className="flex items-center justify-between text-muted-foreground text-xs font-mono font-medium">
                <span className="uppercase tracking-wider">THIS WEEK</span>
                <TrendingUp className="size-4 text-green-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-primary tracking-tight">
                {dashboardStats.weeklyAdherence}%
              </div>
              <p className="text-[11px] text-muted-foreground">Scheduled routine adherence</p>
            </div>

            {/* LIFETIME EXERCISES COMPLETED */}
            <div className="relative backdrop-blur-sm border border-border bg-card/30 rounded-lg p-4 space-y-1">
              <CornerElements />
              <div className="flex items-center justify-between text-muted-foreground text-xs font-mono font-medium">
                <span className="uppercase tracking-wider">COMPLETED</span>
                <CheckCircle2 className="size-4 text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
                {dashboardStats.lifetimeCompletions}
              </div>
              <p className="text-[11px] text-muted-foreground">Total exercises finished</p>
            </div>
          </div>

          {/* 2. 30-DAY ACTIVITY HEATMAP */}
          <div className="relative backdrop-blur-sm border border-border bg-card/30 rounded-lg p-4 sm:p-5 space-y-3.5">
            <CornerElements />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <h3 className="font-mono text-sm sm:text-base font-bold text-foreground uppercase tracking-wide">
                  30-Day Activity Heatmap
                </h3>
              </div>
              {/* LEGEND */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-xs bg-primary" />
                  <span className="text-muted-foreground">Done</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-xs bg-primary/40" />
                  <span className="text-muted-foreground">Partial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-xs bg-destructive/50" />
                  <span className="text-muted-foreground">Missed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-xs bg-muted/50 border border-border" />
                  <span className="text-muted-foreground">Rest</span>
                </div>
              </div>
            </div>

            {/* HEATMAP GRID */}
            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-1">
              {dashboardStats.thirtyDayActivity.map((day, idx) => {
                let cellColor = "bg-muted/30 border-border/70 text-muted-foreground";
                if (day.status === "completed") {
                  cellColor = "bg-primary/20 border-primary text-primary font-bold shadow-xs";
                } else if (day.status === "partial") {
                  cellColor = "bg-primary/10 border-primary/40 text-primary";
                } else if (day.status === "missed") {
                  cellColor = "bg-destructive/15 border-destructive/40 text-destructive";
                }

                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center p-2 rounded-md border text-center transition-transform hover:scale-105 ${cellColor}`}
                    title={`${day.date} (${day.dayOfWeek}): ${day.status} - ${day.completedCount} routines`}
                  >
                    <span className="text-[10px] font-mono text-muted-foreground/80 leading-none">
                      {day.dayOfWeek}
                    </span>
                    <span className="text-xs font-mono font-bold mt-1 leading-none">
                      {parseInt(day.date.split("-")[2], 10)}
                    </span>
                    <div className="mt-1.5">
                      {day.status === "completed" ? (
                        <div className="size-1.5 rounded-full bg-primary" />
                      ) : day.status === "missed" ? (
                        <div className="size-1.5 rounded-full bg-destructive" />
                      ) : (
                        <div className="size-1.5 rounded-full bg-transparent" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. RECENT ACTIVITY TIMELINE */}
          <div className="relative backdrop-blur-sm border border-border bg-card/30 rounded-lg p-4 sm:p-5 space-y-3">
            <CornerElements />
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <h3 className="font-mono text-sm sm:text-base font-bold text-foreground uppercase tracking-wide">
                  Recent Telemetry & Execution Log
                </h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                LATEST {dashboardStats.recentActivity.length} ITEMS
              </span>
            </div>

            {dashboardStats.recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-xs sm:text-sm font-mono space-y-2">
                <Dumbbell className="size-6 text-muted-foreground/40 mx-auto mb-1" />
                <p>No workout telemetry recorded yet.</p>
                <p className="text-xs text-muted-foreground/70">
                  Launch workout session mode to begin registering live sets.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {dashboardStats.recentActivity.map((act) => (
                  <div
                    key={act._id}
                    className="py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-2 rounded-full bg-green-400 shrink-0" />
                      <span className="font-medium text-foreground truncate">
                        {act.exerciseName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-muted-foreground font-mono text-xs">
                      <span>{act.date}</span>
                      <span className="bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                        DONE
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
