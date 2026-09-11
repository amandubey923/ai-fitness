"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import CornerElements from "@/components/CornerElements";
import AIAssistant from "@/components/AIAssistant";
import {
  FileText,
  Sparkles,
  User,
  Target,
  Dumbbell,
  Utensils,
  ShieldAlert,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";

// ─── Form field options ───────────────────────────────────────────────────────

const FITNESS_GOALS = [
  "Weight Loss",
  "Muscle Gain",
  "General Fitness",
  "Endurance",
  "Strength",
  "Flexibility",
];

const FITNESS_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const GENDER_OPTIONS = [
  "Male",
  "Female",
  "Other / Prefer not to say",
];

const EQUIPMENT_OPTIONS = [
  "Full Gym (Barbells, Dumbbells, Machines)",
  "Home Dumbbells & Bench",
  "Bodyweight / Calisthenics",
  "Resistance Bands",
];

const DURATION_OPTIONS = [
  "20–30 min (Express)",
  "30–45 min (Standard)",
  "45–60 min (Optimal)",
  "60+ min (Extended)",
];

const DIETARY_OPTIONS = [
  "None",
  "Vegetarian",
  "Vegan",
  "Lactose Intolerant",
  "Gluten-Free",
  "Keto",
  "Halal",
  "Other",
];

const WORKOUT_DAYS = [1, 2, 3, 4, 5, 6, 7];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FormState {
  age: string;
  gender: string;
  height: string;
  weight: string;
  injuries: string;
  workout_days: string;
  fitness_goal: string;
  fitness_level: string;
  equipment: string;
  workout_duration: string;
  dietary_restrictions: string;
}

const INITIAL_FORM: FormState = {
  age: "",
  gender: "Male",
  height: "",
  weight: "",
  injuries: "",
  workout_days: "3",
  fitness_goal: "",
  fitness_level: "",
  equipment: "Full Gym (Barbells, Dumbbells, Machines)",
  workout_duration: "45–60 min (Optimal)",
  dietary_restrictions: "None",
};

// ─── Shared input/select class ────────────────────────────────────────────────

const fieldClass =
  "w-full h-10 bg-background/60 border border-border/80 text-foreground rounded-md px-3.5 text-sm " +
  "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 " +
  "placeholder:text-muted-foreground/60 transition-colors";

// ─── Page component ───────────────────────────────────────────────────────────

const GenerateProgramPage = () => {
  const { user } = useUser();
  const router = useRouter();

  // Mode: "ai" or "manual"
  const [mode, setMode] = useState<"ai" | "manual">("ai");

  // Single source of truth for form state (used by both modes)
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = useAction(api.generate.generateFitnessPlan);

  // ── Field change handler ─────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  // ── Partial update handler (from AI assistant) ───────────────────────────
  const handleUpdateForm = (updates: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...updates }));
    setError(null);
  };

  // ── Validation ────────────────────────────────────────────────────
  const validate = (): string | null => {
    const ageNum = parseInt(form.age, 10);
    if (!form.age || isNaN(ageNum) || ageNum < 10 || ageNum > 100) {
      return "Please enter a valid age between 10 and 100.";
    }
    if (!form.height.trim()) return "Please enter your height.";
    if (!form.weight.trim()) return "Please enter your weight.";
    const days = parseInt(form.workout_days, 10);
    if (isNaN(days) || days < 1 || days > 7) {
      return "Please select a valid number of workout days (1–7).";
    }
    if (!form.fitness_goal) return "Please select your fitness goal.";
    if (!form.fitness_level) return "Please select your fitness level.";
    if (!form.dietary_restrictions) return "Please select a dietary preference.";
    return null;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isGenerating || isSuccess) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      await generatePlan({
        age: form.age.trim(),
        gender: form.gender,
        height: form.height.trim(),
        weight: form.weight.trim(),
        injuries: form.injuries.trim() || "none",
        workout_days: parseInt(form.workout_days, 10),
        fitness_goal: form.fitness_goal,
        fitness_level: form.fitness_level,
        equipment: form.equipment,
        workout_duration: form.workout_duration,
        dietary_restrictions: form.dietary_restrictions,
      });

      setIsSuccess(true);

      // Redirect to profile after a short delay
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err: any) {
      console.error("Plan generation error:", err);
      const errMsg = err?.message || "";
      if (errMsg.includes("Not authenticated")) {
        setError("You must be signed in to generate a plan.");
      } else if (errMsg && !errMsg.includes("Server Error")) {
        const cleanMsg = errMsg.replace(/^Uncaught (?:Error: )?/, "").trim();
        setError(cleanMsg.length > 120 ? "Plan generation failed. Please try again in a moment." : cleanMsg);
      } else {
        setError("Plan generation failed. Please try again in a moment.");
      }
      setIsGenerating(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden pb-10 pt-3 sm:pt-5">
      <div className="container mx-auto px-4 h-full max-w-3xl">
        {/* Title */}
        <div className="text-center mb-3.5 sm:mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight">
            <span>Generate Your </span>
            <span className="text-primary uppercase">Fitness Program</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-1">
            Build your personalized workout & diet plan with FitPilot AI
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex justify-center mb-4 sm:mb-5">
          <div className="bg-card/90 border border-border rounded-full p-1 flex gap-2 backdrop-blur-sm shadow-md">
            <button
              type="button"
              onClick={() => setMode("ai")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-mono transition-all ${
                mode === "ai"
                  ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-mono transition-all ${
                mode === "manual"
                  ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Manual Form</span>
            </button>
          </div>
        </div>

        {/* Global Error message */}
        {error && (
          <div className="mb-4 flex items-start gap-2 px-3.5 py-2.5 rounded-md border border-destructive/40 bg-destructive/10 animate-fadeIn text-xs">
            <span className="text-xs font-mono text-primary mt-0.5">!</span>
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Success message */}
        {isSuccess && (
          <div className="mb-4 flex items-start gap-2 px-3.5 py-2.5 rounded-md border border-primary/40 bg-primary/10 animate-fadeIn text-xs">
            <span className="text-xs font-mono text-primary mt-0.5">&gt;</span>
            <p className="text-sm text-foreground">
              Your fitness program has been created! Redirecting to your profile...
            </p>
          </div>
        )}

        {/* OPTION 2: AI ASSISTANT VIEW */}
        {mode === "ai" && (
          <AIAssistant
            form={form}
            onUpdateForm={handleUpdateForm}
            onSwitchToManual={() => setMode("manual")}
            isGenerating={isGenerating}
          />
        )}

        {/* OPTION 1: MANUAL FORM VIEW */}
        {mode === "manual" && (
          <div className="space-y-4">
            {/* Step / Category Progress Header */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-card/60 border border-border/70 backdrop-blur-xs">
                <span className="text-xs font-mono font-bold text-primary">01</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-mono font-semibold text-foreground tracking-wide uppercase truncate">
                    Profile
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">Age, gender, body</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-card/60 border border-border/70 backdrop-blur-xs">
                <span className="text-xs font-mono font-bold text-primary">02</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-mono font-semibold text-foreground tracking-wide uppercase truncate">
                    Goals
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">Target & frequency</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-card/60 border border-border/70 backdrop-blur-xs">
                <span className="text-xs font-mono font-bold text-primary">03</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-mono font-semibold text-foreground tracking-wide uppercase truncate">
                    Training
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">Gear & session length</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-card/60 border border-border/70 backdrop-blur-xs">
                <span className="text-xs font-mono font-bold text-primary">04</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-mono font-semibold text-foreground tracking-wide uppercase truncate">
                    Nutrition
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">Diet & injury notes</span>
                </div>
              </div>
            </div>

            <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative shadow-xl">
              <CornerElements />

              {/* Card header bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-background/40">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-primary">
                    FITNESS_PROFILE // SPECIFICATION
                  </span>
                </div>
                <span className="text-xs font-mono font-medium tracking-wide text-muted-foreground">
                  {user ? (user.firstName ?? "USER") + ".input" : "USER.input"}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
                {/* ── SECTION A: BASIC PROFILE ── */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <div className="flex items-center justify-center w-5 h-5 rounded bg-primary/10 border border-primary/30 text-primary">
                      <User className="w-3 h-3" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[11px] font-bold text-primary tracking-wider">SECTION 01</span>
                      <span className="text-xs sm:text-sm font-semibold text-foreground font-mono uppercase tracking-wide">
                        Basic Profile
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Age */}
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                        Age <span className="text-primary">*</span>
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={form.age}
                        onChange={handleChange}
                        min={10}
                        max={100}
                        placeholder="e.g. 25"
                        className={fieldClass}
                        disabled={isGenerating || isSuccess}
                      />
                      <p className="text-[11px] text-muted-foreground/75 font-mono">
                        Used for basal metabolic rate (BMR)
                      </p>
                    </div>

                    {/* Gender */}
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                        Gender <span className="text-primary">*</span>
                      </label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className={fieldClass}
                        disabled={isGenerating || isSuccess}
                      >
                        {GENDER_OPTIONS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-muted-foreground/75 font-mono">
                        Calibrates physiological baseline equations
                      </p>
                    </div>

                    {/* Height */}
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                        Height <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        name="height"
                        value={form.height}
                        onChange={handleChange}
                        placeholder="e.g. 175 cm or 5'9&quot;"
                        className={fieldClass}
                        disabled={isGenerating || isSuccess}
                      />
                      <p className="text-[11px] text-muted-foreground/75 font-mono">
                        Metric or imperial values accepted
                      </p>
                    </div>

                    {/* Weight */}
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                        Weight <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        name="weight"
                        value={form.weight}
                        onChange={handleChange}
                        placeholder="e.g. 70 kg or 154 lbs"
                        className={fieldClass}
                        disabled={isGenerating || isSuccess}
                      />
                      <p className="text-[11px] text-muted-foreground/75 font-mono">
                        Used for calorie target and protein ratios
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── SECTION B: FITNESS GOALS ── */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <div className="flex items-center justify-center w-5 h-5 rounded bg-primary/10 border border-primary/30 text-primary">
                      <Target className="w-3 h-3" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[11px] font-bold text-primary tracking-wider">SECTION 02</span>
                      <span className="text-xs sm:text-sm font-semibold text-foreground font-mono uppercase tracking-wide">
                        Fitness Goals & Level
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Goal */}
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                        Primary Goal <span className="text-primary">*</span>
                      </label>
                      <select
                        name="fitness_goal"
                        value={form.fitness_goal}
                        onChange={handleChange}
                        className={fieldClass}
                        disabled={isGenerating || isSuccess}
                      >
                        <option value="">Select goal...</option>
                        {FITNESS_GOALS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-muted-foreground/75 font-mono">
                        Directs caloric surplus/deficit & rep ranges
                      </p>
                    </div>

                    {/* Level */}
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                        Experience Level <span className="text-primary">*</span>
                      </label>
                      <select
                        name="fitness_level"
                        value={form.fitness_level}
                        onChange={handleChange}
                        className={fieldClass}
                        disabled={isGenerating || isSuccess}
                      >
                        <option value="">Select level...</option>
                        {FITNESS_LEVELS.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-muted-foreground/75 font-mono">
                        Paces workout complexity and volume
                      </p>
                    </div>

                    {/* Days */}
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                        Workout Days / Week <span className="text-primary">*</span>
                      </label>
                      <select
                        name="workout_days"
                        value={form.workout_days}
                        onChange={handleChange}
                        className={fieldClass}
                        disabled={isGenerating || isSuccess}
                      >
                        {WORKOUT_DAYS.map((d) => (
                          <option key={d} value={d}>
                            {d} day{d !== 1 ? "s" : ""} per week
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-muted-foreground/75 font-mono">
                        AI schedules exact rest and training days
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── SECTION C: TRAINING DETAILS ── */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <div className="flex items-center justify-center w-5 h-5 rounded bg-primary/10 border border-primary/30 text-primary">
                      <Dumbbell className="w-3 h-3" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[11px] font-bold text-primary tracking-wider">SECTION 03</span>
                      <span className="text-xs sm:text-sm font-semibold text-foreground font-mono uppercase tracking-wide">
                        Training Details
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Equipment */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                          Available Equipment
                        </label>
                        <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                          CUSTOM
                        </span>
                      </div>
                      <select
                        name="equipment"
                        value={form.equipment}
                        onChange={handleChange}
                        className={fieldClass}
                        disabled={isGenerating || isSuccess}
                      >
                        {EQUIPMENT_OPTIONS.map((eq) => (
                          <option key={eq} value={eq}>
                            {eq}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-muted-foreground/75 font-mono">
                        Tailors exercises to your accessible gear
                      </p>
                    </div>

                    {/* Duration */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                          Target Session Length
                        </label>
                        <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                          PACING
                        </span>
                      </div>
                      <select
                        name="workout_duration"
                        value={form.workout_duration}
                        onChange={handleChange}
                        className={fieldClass}
                        disabled={isGenerating || isSuccess}
                      >
                        {DURATION_OPTIONS.map((dur) => (
                          <option key={dur} value={dur}>
                            {dur}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-muted-foreground/75 font-mono">
                        Sets routine density and rest intervals
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── SECTION D & E: NUTRITION & HEALTH ── */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <div className="flex items-center justify-center w-5 h-5 rounded bg-primary/10 border border-primary/30 text-primary">
                      <Utensils className="w-3 h-3" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[11px] font-bold text-primary tracking-wider">SECTION 04</span>
                      <span className="text-xs sm:text-sm font-semibold text-foreground font-mono uppercase tracking-wide">
                        Nutrition & Health Profile
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Dietary Restrictions */}
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                        Dietary Preference <span className="text-primary">*</span>
                      </label>
                      <select
                        name="dietary_restrictions"
                        value={form.dietary_restrictions}
                        onChange={handleChange}
                        className={fieldClass}
                        disabled={isGenerating || isSuccess}
                      >
                        {DIETARY_OPTIONS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-muted-foreground/75 font-mono">
                        Applied to all meals, macros, and food choices
                      </p>
                    </div>

                    {/* Injuries */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                          Injuries / Physical Limitations
                        </label>
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded border border-border/50">
                          OPTIONAL
                        </span>
                      </div>
                      <input
                        type="text"
                        name="injuries"
                        value={form.injuries}
                        onChange={handleChange}
                        placeholder="e.g. lower back pain, knee stiffness, or leave blank"
                        className={fieldClass}
                        disabled={isGenerating || isSuccess}
                      />
                      <p className="text-[11px] text-muted-foreground/75 font-mono">
                        AI automatically substitutes safe movement variations
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Generate Button (Active for both modes, operating on the same form data) */}
        <div className="w-full flex flex-col items-center justify-center mt-5 sm:mt-6">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isGenerating || isSuccess}
            className={`h-12 px-8 sm:px-10 text-sm sm:text-base font-semibold rounded-full relative shadow-lg transition-all duration-300 font-mono ${
              isSuccess
                ? "bg-green-600 hover:bg-green-700 shadow-green-600/30 text-white"
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.01]"
            }`}
          >
            {/* Pulse ping animation while generating */}
            {isGenerating && (
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/40 opacity-75" />
            )}
            <span className="flex items-center gap-2">
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Program Created! Redirecting...</span>
                </>
              ) : isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Your Program...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate My Program</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </span>
          </Button>

          {/* Subtle loading hint */}
          {isGenerating && (
            <p className="text-center text-xs sm:text-sm text-muted-foreground mt-3 animate-fadeIn font-mono">
              AI is synthesizing your personalized workout schedule & nutritional plan (~10–20 seconds)...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateProgramPage;
