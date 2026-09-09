"use client";

import Link from "next/link";
import CornerElements from "@/components/CornerElements";
import FitPilotLogo from "@/components/FitPilotLogo";
import { Button } from "@/components/ui/button";
import {
  DumbbellIcon,
  AppleIcon,
  BrainCircuitIcon,
  ShieldCheckIcon,
  ArrowRight,
  CheckCircle2,
  FileText,
  Mic,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-10 max-w-5xl space-y-7">
      {/* HERO BRIEFING */}
      <div className="relative backdrop-blur-sm border border-border bg-card/60 rounded-xl p-5 sm:p-7">
        <CornerElements />

        <div className="flex items-center gap-2 mb-2.5">
          <div className="p-1.5 rounded bg-primary/10 border border-primary/30">
            <FitPilotLogo size={18} />
          </div>
          <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
            MISSION BRIEFING // ARCHITECTURE
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2.5 font-mono">
          About <span className="text-primary">FitPilot AI</span>
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
          FitPilot AI is a fitness technology application built to eliminate the confusion and generic nature of static fitness routines. 
          By combining user-specific biometrics, schedule constraints, dietary preferences, and injury profiles, FitPilot AI generates 
          structured, progressive workout and nutrition plans tailored to each individual.
        </p>
      </div>

      {/* DUAL GENERATION SYSTEM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 sm:p-5">
          <CornerElements />
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-1.5 rounded bg-primary/10 border border-primary/25 text-primary">
              <Mic className="size-4" />
            </div>
            <h3 className="font-mono text-sm font-bold text-foreground">
              Conversational AI Assistant
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Speak or type naturally. The integrated assistant understands details like age, weight, training frequency, injuries, 
            and fitness objectives, automatically structuring them into validated profile parameters.
          </p>
        </div>

        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 sm:p-5">
          <CornerElements />
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-1.5 rounded bg-secondary/15 border border-border text-foreground">
              <FileText className="size-4" />
            </div>
            <h3 className="font-mono text-sm font-bold text-foreground">
              Precision Manual Form
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Prefer direct input? The streamlined grid form provides rapid, granular control over workout days, 
            dietary choices, and limitation notes with immediate client-side validation.
          </p>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="relative backdrop-blur-sm border border-border bg-card/30 rounded-lg p-5">
        <CornerElements />

        <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-border/70">
          <h2 className="text-sm sm:text-base font-bold font-mono text-foreground">
            HOW FITPILOT <span className="text-primary">OPERATES</span>
          </h2>
          <span className="text-[11px] font-mono text-muted-foreground">3-STAGE PIPELINE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="space-y-1.5 p-3 rounded border border-border/60 bg-background/40">
            <span className="font-mono text-[11px] text-primary font-bold">STAGE 01 // INPUT</span>
            <h4 className="text-xs sm:text-sm font-semibold text-foreground">Profile Calibration</h4>
            <p className="text-xs text-muted-foreground">
              Age, weight, height, limitations, and targets are checked against safety ranges to avoid unsuitable exercises.
            </p>
          </div>

          <div className="space-y-1.5 p-3 rounded border border-border/60 bg-background/40">
            <span className="font-mono text-[11px] text-primary font-bold">STAGE 02 // GENERATION</span>
            <h4 className="text-xs sm:text-sm font-semibold text-foreground">AI Plan Synthesis</h4>
            <p className="text-xs text-muted-foreground">
              Gemini & Groq AI models construct day-wise routines with sets, reps, and dietary targets with calibrated calories.
            </p>
          </div>

          <div className="space-y-1.5 p-3 rounded border border-border/60 bg-background/40">
            <span className="font-mono text-[11px] text-primary font-bold">STAGE 03 // ACTION</span>
            <h4 className="text-xs sm:text-sm font-semibold text-foreground">Track, Swap & Adapt</h4>
            <p className="text-xs text-muted-foreground">
              View daily missions, check off completed routines, swap exercises on demand, and optimize parameters anytime.
            </p>
          </div>
        </div>
      </div>

      {/* TECH FOUNDATION & PRINCIPLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 sm:p-5">
          <CornerElements />
          <h3 className="font-mono text-xs font-bold text-foreground mb-2.5 flex items-center gap-1.5">
            <ShieldCheckIcon className="size-4 text-primary" />
            CORE PRINCIPLES
          </h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
              <span><strong>Tailored Logic:</strong> Plans are generated to your specific limitations, not copied from templates.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
              <span><strong>Practical Nutrition:</strong> Meal plans designed with accessible foods and calculated daily calories.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
              <span><strong>Account Privacy:</strong> Plans are indexed strictly to your authenticated Clerk identity.</span>
            </li>
          </ul>
        </div>

        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 sm:p-5">
          <CornerElements />
          <h3 className="font-mono text-xs font-bold text-foreground mb-2.5 flex items-center gap-1.5">
            <BrainCircuitIcon className="size-4 text-primary" />
            TECHNOLOGY STACK
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
            <span className="p-2 rounded bg-background/60 border border-border text-center">Next.js 16</span>
            <span className="p-2 rounded bg-background/60 border border-border text-center">Convex Cloud</span>
            <span className="p-2 rounded bg-background/60 border border-border text-center">Clerk Auth</span>
            <span className="p-2 rounded bg-background/60 border border-border text-center">Google Gemini</span>
            <span className="p-2 rounded bg-background/60 border border-border text-center">Groq Llama 3.3</span>
            <span className="p-2 rounded bg-background/60 border border-border text-center">Tailwind CSS</span>
          </div>
        </div>
      </div>

      {/* COMPACT CTA */}
      <div className="relative backdrop-blur-sm border border-primary/40 bg-card/60 rounded-lg p-5 text-center space-y-2.5">
        <CornerElements />
        <h2 className="text-lg sm:text-xl font-bold font-mono text-foreground">
          Ready to Generate Your Personalized Program?
        </h2>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Experience tailored workout routines and diet architectures created specifically for your profile.
        </p>
        <div className="pt-1">
          <Link href="/generate-program">
            <Button size="sm" className="h-8.5 px-5 font-mono text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs">
              Generate Plan <ArrowRight className="size-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
