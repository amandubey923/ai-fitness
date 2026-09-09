"use client";

import { useState } from "react";
import Link from "next/link";
import CornerElements from "@/components/CornerElements";
import FitPilotLogo from "@/components/FitPilotLogo";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  ClockIcon,
  ArrowRight,
  Dumbbell,
  AppleIcon,
  Flame,
  BrainCircuit,
  BookOpen,
  X,
  Sparkles,
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: "Workouts" | "Nutrition" | "AI & Tech" | "Habits";
  readTime: string;
  date: string;
  summary: string;
  takeaway: string;
  content: string[];
}

const ARTICLES: Article[] = [
  {
    id: "progressive-overload",
    title: "Progressive Overload: The Mathematical Basis of Muscle Growth",
    category: "Workouts",
    readTime: "4 min read",
    date: "Sep 2026",
    summary: "Why lifting the same weight indefinitely halts adaptation, and how structured sets, reps, and tempo drive hypertrophy.",
    takeaway: "Add either 1 rep or small weight increments each week while maintaining strict technical execution.",
    content: [
      "Muscle hypertrophy is not an emotional response to effort; it is a biological adaptation to mechanical tension. When muscle fibers experience tension exceeding previous baselines, cellular signaling cascades trigger protein synthesis to reinforce fiber cross-sectional area.",
      "In FitPilot AI workout plans, every exercise prescribes target sets and repetition brackets. To apply progressive overload effectively, focus first on completing the maximum prescribed reps with clean form before increasing the load.",
      "Tracking completed sessions on your dashboard gives you an objective baseline rather than relying on gym memory.",
    ],
  },
  {
    id: "calorie-architecture",
    title: "Calorie Architecture: Calculating TDEE, Deficit & Surplus Accurately",
    category: "Nutrition",
    readTime: "5 min read",
    date: "Sep 2026",
    summary: "The science behind Total Daily Energy Expenditure and why extreme calorie restrictions trigger metabolic slowdown.",
    takeaway: "A sustainable 300–400 kcal deficit preserves lean tissue while steadily mobilizing adipose tissue.",
    content: [
      "Your Total Daily Energy Expenditure (TDEE) consists of Basal Metabolic Rate (BMR), the Thermic Effect of Food (TEF), and Non-Exercise Activity Thermogenesis (NEAT) plus intentional exercise.",
      "FitPilot AI estimates your baseline expenditure using the Mifflin-St Jeor formula calibrated for age, height, and weight. For fat loss, an aggressive 1,000 calorie deficit often induces lethargy and muscle loss; a measured 350-450 deficit produces steady, sustainable results.",
      "Protein targets of 1.6 to 2.2 grams per kilogram of body weight protect muscle mass while in a negative energy balance.",
    ],
  },
  {
    id: "ai-workout-generation",
    title: "How FitPilot Generates Personalized Splits vs Static PDF Templates",
    category: "AI & Tech",
    readTime: "4 min read",
    date: "Aug 2026",
    summary: "A technical look at how AI synthesizes user limitations, workout frequencies, and goal profiles into coherent training schedules.",
    takeaway: "Algorithmic generation respects individual joints and schedules where static templates fail.",
    content: [
      "Traditional fitness routines are distributed as static PDF tables designed for an imaginary average person with 0 joint issues, 5 days of availability, and standard barbell equipment.",
      "FitPilot AI conditions generation on strict architectural constraints: matching the exact day count requested, omitting contraindicated movements for specified injuries (e.g. replacing heavy barbell squats with leg presses for knee discomfort), and structuring meal schedules around dietary restrictions.",
      "The result is a system tailored for your reality rather than a generic fitness model.",
    ],
  },
  {
    id: "injury-management",
    title: "Managing Joint Stress: Exercise Selection Around Knee & Shoulder Limitations",
    category: "Workouts",
    readTime: "4 min read",
    date: "Aug 2026",
    summary: "Smart exercise substitutions that train the targeted muscle group without inflaming vulnerable connective tissue.",
    takeaway: "Use the inline Exercise Swap feature whenever a movement causes joint impingement.",
    content: [
      "Connective tissue regenerates slower than muscular tissue due to lower vascular supply. Training through acute joint pain often turns mild inflammation into chronic tendonitis.",
      "When training chest with shoulder sensitivity, moving from a fixed barbell bench to dumbbells with a neutral grip reduces internal rotation. For knee issues, box squats or Romanian deadlifts shift load to the posterior chain.",
      "On FitPilot AI, the Exercise Swap button provides on-demand alternatives targeting the same primary muscle group without requiring manual program restructuring.",
    ],
  },
  {
    id: "plant-based-protein",
    title: "Vegetarian Protein Synthesis: Reaching High Protein Targets Without Meat",
    category: "Nutrition",
    readTime: "3 min read",
    date: "Aug 2026",
    summary: "Combining legumes, soy isolates, and dairy/plant sources to achieve complete amino acid profiles.",
    takeaway: "Pair diverse plant protein sources across the day to ensure optimal leucine and essential amino acid availability.",
    content: [
      "A common misconception is that building muscle on a vegetarian or plant-forward diet is inefficient. While individual plant foods may have lower concentrations of leucine, consuming varied protein sources easily meets optimal threshold requirements.",
      "Tofu, tempeh, lentils, Greek yogurt, paneer, and plant protein isolates provide high-density protein without excessive saturated fats.",
      "FitPilot AI includes a dedicated 'Vegetarian Protein' preset in the Plan Optimizer to automatically restructure meal plans around plant-forward fuel.",
    ],
  },
  {
    id: "systems-over-motivation",
    title: "Systems Over Motivation: Building Fitness Habits That Survive Low Energy",
    category: "Habits",
    readTime: "3 min read",
    date: "Jul 2026",
    summary: "Why motivation is an unreliable catalyst, and how friction reduction and daily mission tracking ensure adherence.",
    takeaway: "Small, repeatable commitments executed consistently beat sporadic heroic workouts.",
    content: [
      "Motivation is a fleeting neurochemical state; discipline is a cognitive habit. The most successful trainees are not those with the highest willpower, but those who design systems with the lowest friction.",
      "Having a predetermined schedule visible on your dashboard eliminates decision fatigue. You know exactly what day it is, how many routines are scheduled, and what to eat.",
      "Marking off completed sets provides immediate dopamine reinforcement, closing the psychological feedback loop.",
    ],
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categories = ["All", "Workouts", "Nutrition", "AI & Tech", "Habits"];

  const filteredArticles = activeCategory === "All"
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10 max-w-5xl space-y-6">
      {/* HERO */}
      <div className="relative backdrop-blur-sm border border-border bg-card/60 rounded-xl p-5 sm:p-7">
        <CornerElements />

        <div className="flex items-center gap-2 mb-2.5">
          <div className="p-1.5 rounded bg-primary/10 border border-primary/30">
            <FitPilotLogo size={18} />
          </div>
          <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
            KNOWLEDGE BASE // PRINCIPLES & RESEARCH
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2 font-mono">
          FitPilot <span className="text-primary">Knowledge Stream</span>
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Evidence-based articles on training mechanics, nutritional calculations, habit systems, and AI fitness architectures.
        </p>
      </div>

      {/* CATEGORY SELECTOR */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActiveCategory(c)}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${
              activeCategory === c
                ? "bg-primary/20 text-primary border-primary font-semibold"
                : "bg-card/40 border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ARTICLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-xs"
          >
            <CornerElements />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs font-semibold border border-primary/20">
                  {article.category}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {article.readTime}
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2 tracking-tight">
                {article.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {article.summary}
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-border/70 flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">
                {article.date}
              </span>
              <button
                type="button"
                onClick={() => setSelectedArticle(article)}
                className="text-xs sm:text-sm font-mono text-primary hover:underline flex items-center gap-1 font-medium"
              >
                Read Article <ArrowRight className="size-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* COMPACT MODAL FOR READING FULL ARTICLE */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-card border border-primary/40 rounded-xl p-5 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <CornerElements />

            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-primary/15 text-primary text-xs font-mono font-semibold">
                  {selectedArticle.category}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {selectedArticle.readTime} • {selectedArticle.date}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-mono text-foreground leading-tight">
              {selectedArticle.title}
            </h2>

            {/* Core Takeaway Banner */}
            <div className="p-3 rounded bg-primary/10 border border-primary/30 text-sm text-foreground">
              <strong className="text-primary font-mono block mb-0.5">KEY TAKEAWAY:</strong>
              {selectedArticle.takeaway}
            </div>

            <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <Link href="/generate-program">
                <Button size="sm" className="h-8 px-4 text-xs sm:text-sm font-mono bg-primary text-primary-foreground font-semibold">
                  <Sparkles className="size-3 mr-1.5" /> Generate Personalized Plan
                </Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedArticle(null)}
                className="h-8 text-xs font-mono"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
