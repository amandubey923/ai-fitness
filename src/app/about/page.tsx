"use client";

import CornerElements from "@/components/CornerElements";
import { Button } from "@/components/ui/button";
import { DumbbellIcon, AppleIcon, BrainCircuitIcon, ShieldCheckIcon } from "lucide-react";

const AboutPage = () => {
  return (
    <section className="relative z-10 pt-16 pb-32 grow container mx-auto px-4">
      {/* HERO */}
      <div className="relative backdrop-blur-sm border border-border rounded-lg p-8 mb-12">
        <CornerElements />

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          About <span className="text-primary">FitAI</span>
        </h1>

        <p className="text-muted-foreground max-w-3xl leading-relaxed">
          FitAI is an intelligent fitness platform designed to create
          personalized workout and diet plans using data, consistency,
          and discipline. Our goal is to help you build a stronger body,
          sharper mind, and a sustainable lifestyle.
        </p>
      </div>

      {/* MISSION */}
      <div className="relative backdrop-blur-sm border border-border rounded-lg p-6 mb-10">
        <CornerElements />

        <h2 className="text-xl font-bold mb-3">
          Our <span className="text-primary">Mission</span>
        </h2>

        <p className="text-muted-foreground leading-relaxed">
          We believe fitness should not be confusing or generic.
          FitAI exists to remove guesswork from training and nutrition
          by providing structured, realistic, and goal-oriented plans
          tailored to every individual.
        </p>
      </div>

      {/* HOW IT WORKS */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <FeatureCard
          icon={<BrainCircuitIcon className="h-6 w-6 text-primary" />}
          title="Smart Planning"
          description="AI-driven logic creates workout and diet plans based on your goals, schedule, and fitness level."
        />

        <FeatureCard
          icon={<DumbbellIcon className="h-6 w-6 text-primary" />}
          title="Workout Structure"
          description="Day-wise workout routines with exercises, sets, reps, and guidance for progressive improvement."
        />

        <FeatureCard
          icon={<AppleIcon className="h-6 w-6 text-primary" />}
          title="Diet Optimization"
          description="Clear meal plans with calorie targets and food suggestions that are practical and sustainable."
        />
      </div>

      {/* WHY FITAI */}
      <div className="relative backdrop-blur-sm border border-border rounded-lg p-6 mb-12">
        <CornerElements />

        <h2 className="text-xl font-bold mb-4">
          Why Choose <span className="text-primary">FitAI</span>?
        </h2>

        <ul className="space-y-3 text-muted-foreground">
          <li className="flex items-center gap-3">
            <ShieldCheckIcon className="h-4 w-4 text-primary" />
            Personalized plans — no copy-paste routines
          </li>
          <li className="flex items-center gap-3">
            <ShieldCheckIcon className="h-4 w-4 text-primary" />
            Clean, distraction-free dashboard
          </li>
          <li className="flex items-center gap-3">
            <ShieldCheckIcon className="h-4 w-4 text-primary" />
            Built for long-term consistency, not shortcuts
          </li>
          <li className="flex items-center gap-3">
            <ShieldCheckIcon className="h-4 w-4 text-primary" />
            Secure authentication and private user data
          </li>
        </ul>
      </div>

      {/* TECH STACK */}
      <div className="relative backdrop-blur-sm border border-border rounded-lg p-6 mb-12">
        <CornerElements />

        <h2 className="text-xl font-bold mb-4">
          Technology <span className="text-primary">Stack</span>
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
          <TechBadge label="Next.js" />
          <TechBadge label="React" />
          <TechBadge label="Tailwind CSS" />
          <TechBadge label="shadcn/ui" />
          <TechBadge label="Clerk Auth" />
          <TechBadge label="Convex Backend" />
          <TechBadge label="AI Planning Logic" />
          <TechBadge label="TypeScript" />
        </div>
      </div>

      {/* CTA */}
      <div className="relative backdrop-blur-sm border border-border rounded-lg p-8 text-center">
        <CornerElements />

        <h2 className="text-2xl font-bold mb-3">
          Build Your Best Version
        </h2>

        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Fitness is not about motivation — it’s about systems.
          FitAI gives you the system. You bring the consistency.
        </p>

        <Button size="lg" className="font-mono">
          Get Started
        </Button>
      </div>
    </section>
  );
};

export default AboutPage;

/* ---------- SMALL REUSABLE COMPONENTS ---------- */

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="relative backdrop-blur-sm border border-border rounded-lg p-5">
      <CornerElements />

      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const TechBadge = ({ label }: { label: string }) => {
  return (
    <div className="border border-border rounded px-3 py-2 text-center bg-background/50">
      {label}
    </div>
  );
};
