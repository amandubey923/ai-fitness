"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import CornerElements from "@/components/CornerElements";

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

interface FormState {
  age: string;
  height: string;
  weight: string;
  injuries: string;
  workout_days: string;
  fitness_goal: string;
  fitness_level: string;
  dietary_restrictions: string;
}

const INITIAL_FORM: FormState = {
  age: "",
  height: "",
  weight: "",
  injuries: "",
  workout_days: "3",
  fitness_goal: "",
  fitness_level: "",
  dietary_restrictions: "None",
};

// ─── Shared input/select class ────────────────────────────────────────────────

const fieldClass =
  "w-full bg-background/50 border border-border text-foreground rounded-md px-3 py-2 text-sm " +
  "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 " +
  "placeholder:text-muted-foreground transition-colors";

// ─── Page component ───────────────────────────────────────────────────────────

const GenerateProgramPage = () => {
  const { user } = useUser();
  const router = useRouter();

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

  // ── Validation ────────────────────────────────────────────────────────────
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        height: form.height.trim(),
        weight: form.weight.trim(),
        injuries: form.injuries.trim() || "none",
        workout_days: parseInt(form.workout_days, 10),
        fitness_goal: form.fitness_goal,
        fitness_level: form.fitness_level,
        dietary_restrictions: form.dietary_restrictions,
      });

      setIsSuccess(true);

      // Redirect to profile after a short delay
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err: any) {
      console.error("Plan generation error:", err);
      setError(
        err?.message?.includes("Not authenticated")
          ? "You must be signed in to generate a plan."
          : "Plan generation failed. Please try again in a moment."
      );
      setIsGenerating(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden pb-6 pt-24">
      <div className="container mx-auto px-4 h-full max-w-3xl">

        {/* Title — preserved from original */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-mono">
            <span>Generate Your </span>
            <span className="text-primary uppercase">Fitness Program</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Fill in your details and our AI will create your personalized plan
          </p>
        </div>

        {/* Form Card */}
        <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative mb-6">
          <CornerElements />

          {/* Card header bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background/40">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-primary">FITNESS_PROFILE</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {user ? (user.firstName ?? "USER") + ".input" : "USER.input"}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* Row 1: Age + Height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wide">
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
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wide">
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
              </div>
            </div>

            {/* Row 2: Weight + Workout Days */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wide">
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
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wide">
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
                      {d} day{d !== 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Fitness Goal + Fitness Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wide">
                  Fitness Goal <span className="text-primary">*</span>
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
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wide">
                  Fitness Level <span className="text-primary">*</span>
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
              </div>
            </div>

            {/* Row 4: Dietary Restrictions */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wide">
                Dietary Restrictions <span className="text-primary">*</span>
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
            </div>

            {/* Row 5: Injuries */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wide">
                Injuries / Physical Limitations{" "}
                <span className="text-muted-foreground/60 normal-case">(optional)</span>
              </label>
              <input
                type="text"
                name="injuries"
                value={form.injuries}
                onChange={handleChange}
                placeholder='e.g. knee pain, lower back issues — or leave blank for "none"'
                className={fieldClass}
                disabled={isGenerating || isSuccess}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-md border border-destructive/40 bg-destructive/10 animate-fadeIn">
                <span className="text-xs font-mono text-primary mt-0.5">!</span>
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Success message */}
            {isSuccess && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-md border border-primary/40 bg-primary/10 animate-fadeIn">
                <span className="text-xs font-mono text-primary mt-0.5">&gt;</span>
                <p className="text-sm text-foreground">
                  Your fitness program has been created! Redirecting to your profile...
                </p>
              </div>
            )}
          </form>
        </Card>

        {/* Generate Button */}
        <div className="w-full flex justify-center">
          <Button
            type="submit"
            form="fitness-form"
            onClick={handleSubmit}
            disabled={isGenerating || isSuccess}
            className={`w-48 text-base rounded-3xl relative ${
              isSuccess
                ? "bg-green-600 hover:bg-green-700"
                : "bg-primary hover:bg-primary/90"
            } text-primary-foreground font-mono`}
          >
            {/* Ping animation while generating */}
            {isGenerating && (
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75" />
            )}
            <span>
              {isSuccess
                ? "View Profile"
                : isGenerating
                  ? "Generating..."
                  : "Generate Plan"}
            </span>
          </Button>
        </div>

        {/* Subtle hint */}
        {isGenerating && (
          <p className="text-center text-xs text-muted-foreground mt-4 animate-fadeIn font-mono">
            AI is building your personalized plan — this takes about 10–20 seconds...
          </p>
        )}
      </div>
    </div>
  );
};

export default GenerateProgramPage;