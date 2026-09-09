"use client";

import { useState } from "react";
import Link from "next/link";
import CornerElements from "@/components/CornerElements";
import FitPilotLogo from "@/components/FitPilotLogo";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Sparkles,
  ArrowRight,
  Search,
  BookOpen,
  SlidersHorizontal,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "start" | "generate" | "features" | "troubleshoot";
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    id: "q1",
    category: "start",
    q: "How do I create an account and access FitPilot AI?",
    a: "Click 'Sign In' or 'Sign Up' in the navigation bar. Authentication is securely handled by Clerk. Once signed in, you can generate plans and view your personal dashboard on the Profile page.",
  },
  {
    id: "q2",
    category: "generate",
    q: "What is the difference between the AI Assistant and Manual Form?",
    a: "Both modes produce the exact same personalized plan. The AI Assistant lets you converse via voice or text, automatically extracting your parameters into the form. The Manual Form lets you input and fine-tune your age, height, weight, goal, and workout days directly.",
  },
  {
    id: "q3",
    category: "generate",
    q: "Can I review and edit extracted parameters before generating?",
    a: "Yes. When chatting with the AI Assistant, you can click 'Review Form' at any point to inspect, edit, or adjust any value in the manual form before clicking 'Generate Plan'.",
  },
  {
    id: "q4",
    category: "features",
    q: "How does Workout Completion tracking work?",
    a: "On your Profile page under the Workout tab, each exercise has a checkmark circle. Tapping it toggles completion with a line-through styling and updates your daily and overall plan progress bars. Progress is saved locally on your device.",
  },
  {
    id: "q5",
    category: "features",
    q: "How do I swap an exercise if I don't have equipment or have an ache?",
    a: "Click the 'Swap' button next to any exercise. FitPilot AI will query our personal training model to suggest an alternative targeting the exact same muscle group with appropriate sets and reps. Click 'Accept Swap' to update your plan view immediately.",
  },
  {
    id: "q6",
    category: "features",
    q: "How do I modify or regenerate an existing plan?",
    a: "On the Profile page, click 'Modify Plan' in the header. You can pick quick presets like 'Make Easier', 'Step Up (Harder)', 'Vegetarian Protein', or '4 Days Split', or adjust the parameters manually and click 'Regenerate with AI'.",
  },
  {
    id: "q7",
    category: "troubleshoot",
    q: "What should I do if plan generation says 'Failed. Please try again'?",
    a: "Plan generation requires an active internet connection and valid profile fields. Ensure your age is between 10 and 100, height and weight are entered, and all required options are selected. If AI traffic is temporarily high, waiting 5–10 seconds and clicking 'Generate Plan' again will succeed.",
  },
  {
    id: "q8",
    category: "troubleshoot",
    q: "Where are my previous plans stored?",
    a: "All previously generated plans are preserved in your Convex account. On your Profile page, the 'Your Fitness Plans' selector displays all your plans so you can switch between them anytime.",
  },
];

export default function HelpPage() {
  const [filter, setFilter] = useState<"all" | "start" | "generate" | "features" | "troubleshoot">("all");
  const [search, setSearch] = useState("");

  const filteredFaqs = FAQS.filter((f) => {
    const matchesFilter = filter === "all" || f.category === filter;
    const matchesSearch =
      search.trim() === "" ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10 max-w-4xl space-y-6">
      {/* HEADER */}
      <div className="relative backdrop-blur-sm border border-border bg-card/60 rounded-xl p-5 sm:p-7">
        <CornerElements />

        <div className="flex items-center gap-2 mb-2.5">
          <div className="p-1.5 rounded bg-primary/10 border border-primary/30">
            <FitPilotLogo size={18} />
          </div>
          <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
            KNOWLEDGE BASE // FAQ & SUPPORT
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2 font-mono">
          Help & <span className="text-primary">Support Center</span>
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Everything you need to navigate FitPilot AI: from generating your first workout and diet architecture to tracking daily completion, swapping exercises, and troubleshooting.
        </p>

        {/* SEARCH BAR */}
        <div className="mt-4 relative max-w-md">
          <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides and FAQs..."
            className="w-full h-8.5 pl-8 pr-3 text-xs bg-background/70 border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono transition-colors"
          />
        </div>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { key: "all", label: "All Topics" },
          { key: "start", label: "Getting Started" },
          { key: "generate", label: "Plan Generation" },
          { key: "features", label: "Interactive Features" },
          { key: "troubleshoot", label: "Troubleshooting" },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilter(t.key as any)}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${
              filter === t.key
                ? "bg-primary/20 text-primary border-primary font-semibold"
                : "bg-card/40 border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* FAQS ACCORDION */}
      <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-xl p-5">
        <CornerElements />

        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/70">
          <span className="font-mono text-xs font-bold text-foreground uppercase">
            DOCUMENTATION ARCHIVE ({filteredFaqs.length})
          </span>
          <span className="text-[11px] font-mono text-muted-foreground">CLICK TO EXPAND</span>
        </div>

        {filteredFaqs.length > 0 ? (
          <Accordion type="multiple" className="space-y-2.5">
            {filteredFaqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-border/70 rounded-md bg-background/30 px-3.5 overflow-hidden"
              >
                <AccordionTrigger className="py-2.5 hover:no-underline font-mono text-xs sm:text-sm text-left font-semibold text-foreground hover:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-3 text-xs text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="py-8 text-center text-xs font-mono text-muted-foreground">
            No guides found matching your query. Try another keyword or browse all topics.
          </div>
        )}
      </div>

      {/* QUICK ASSISTANCE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-border bg-card/40 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-xs font-mono font-bold text-foreground">Need Direct Technical Help?</h4>
            <p className="text-[11px] text-muted-foreground">Reach our support team via dispatch form.</p>
          </div>
          <Link href="/contact">
            <Button size="sm" variant="outline" className="h-7.5 px-3 text-xs font-mono border-primary/40 text-primary hover:bg-primary/10">
              Contact Team
            </Button>
          </Link>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card/40 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-xs font-mono font-bold text-foreground">Ready to Build a Program?</h4>
            <p className="text-[11px] text-muted-foreground">Start generation with AI or manual form.</p>
          </div>
          <Link href="/generate-program">
            <Button size="sm" className="h-7.5 px-3 text-xs font-mono bg-primary text-primary-foreground hover:bg-primary/90">
              Generate Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
