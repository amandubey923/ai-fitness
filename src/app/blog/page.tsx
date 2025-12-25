"use client";

import CornerElements from "@/components/CornerElements";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  DumbbellIcon,
  AppleIcon,
  BrainCircuitIcon,
  FlameIcon,
  BookOpenIcon,
} from "lucide-react";

/* -------------------- PAGE -------------------- */

const BlogPage = () => {
  return (
    <section className="relative z-10 pt-16 pb-32 grow container mx-auto px-4 space-y-16">

      {/* HERO */}
      <HeroSection />

      {/* FEATURED BLOG */}
      <FeaturedPost />

      {/* CATEGORIES */}
      <CategoriesSection />

      {/* BLOG GRID */}
      <BlogGrid />

      {/* NEWSLETTER */}
      <NewsletterSection />

      {/* FINAL CTA */}
      <FinalCTA />

    </section>
  );
};

export default BlogPage;

/* -------------------- HERO -------------------- */

const HeroSection = () => (
  <div className="relative backdrop-blur-sm border border-border rounded-xl p-10">
    <CornerElements />

    <Badge className="mb-4 font-mono">FITAI BLOG</Badge>

    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
      Knowledge that <span className="text-primary">Transforms</span> Your Body
    </h1>

    <p className="text-muted-foreground max-w-3xl leading-relaxed text-lg">
      Deep insights on fitness, nutrition, discipline, and AI-powered health.
      Built for people who value systems over motivation.
    </p>
  </div>
);

/* -------------------- FEATURED POST -------------------- */

const FeaturedPost = () => (
  <div className="relative grid md:grid-cols-2 gap-8 backdrop-blur-sm border border-border rounded-xl p-8">
    <CornerElements />

    {/* LEFT */}
    <div className="space-y-4">
      <Badge variant="secondary">FEATURED</Badge>

      <h2 className="text-3xl font-bold">
        How AI is Changing Personalized Fitness Forever
      </h2>

      <p className="text-muted-foreground leading-relaxed">
        Generic workout plans are dead. Learn how AI analyzes your goals,
        schedule, and consistency to build systems that actually work.
      </p>

      <MetaInfo />
      <Button className="font-mono">
        Read Full Article <ArrowRightIcon className="ml-2 h-4 w-4" />
      </Button>
    </div>

    {/* RIGHT */}
    <div className="rounded-lg border border-border bg-background/50 p-6 flex items-center justify-center">
      <BrainCircuitIcon className="h-24 w-24 text-primary opacity-70" />
    </div>
  </div>
);

/* -------------------- CATEGORIES -------------------- */

const CategoriesSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">
      Browse by <span className="text-primary">Category</span>
    </h2>

    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
      <CategoryCard
        icon={<DumbbellIcon className="h-6 w-6 text-primary" />}
        title="Workouts"
        description="Training principles, routines, and strength science."
      />
      <CategoryCard
        icon={<AppleIcon className="h-6 w-6 text-primary" />}
        title="Nutrition"
        description="Diet planning, calories, and sustainable eating."
      />
      <CategoryCard
        icon={<FlameIcon className="h-6 w-6 text-primary" />}
        title="Fat Loss"
        description="Metabolism, habits, and long-term transformation."
      />
      <CategoryCard
        icon={<BrainCircuitIcon className="h-6 w-6 text-primary" />}
        title="Mindset"
        description="Discipline, consistency, and mental resilience."
      />
    </div>
  </div>
);

/* -------------------- BLOG GRID -------------------- */

const BlogGrid = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">
      Latest <span className="text-primary">Articles</span>
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {BLOGS.map((blog, index) => (
        <BlogCard key={index} {...blog} />
      ))}
    </div>
  </div>
);

/* -------------------- NEWSLETTER -------------------- */

const NewsletterSection = () => (
  <div className="relative backdrop-blur-sm border border-border rounded-xl p-10 text-center">
    <CornerElements />

    <BookOpenIcon className="h-10 w-10 text-primary mx-auto mb-4" />

    <h2 className="text-2xl font-bold mb-3">
      Join the FitAI Knowledge Stream
    </h2>

    <p className="text-muted-foreground max-w-xl mx-auto mb-6">
      Weekly insights on fitness systems, nutrition strategies, and AI-powered health.
      No spam. Only value.
    </p>

    <Button size="lg" className="font-mono">
      Subscribe Now
    </Button>
  </div>
);

/* -------------------- FINAL CTA -------------------- */

const FinalCTA = () => (
  <div className="relative backdrop-blur-sm border border-border rounded-xl p-10 text-center">
    <CornerElements />

    <h2 className="text-3xl font-bold mb-4">
      Turn Knowledge into <span className="text-primary">Action</span>
    </h2>

    <p className="text-muted-foreground max-w-xl mx-auto mb-6">
      Reading is the first step. Systems create results.
      Let FitAI build your personalized fitness system.
    </p>

    <Button size="lg" className="font-mono">
      Get Your Fitness Plan
    </Button>
  </div>
);

/* -------------------- SMALL COMPONENTS -------------------- */

const MetaInfo = () => (
  <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
    <span className="flex items-center gap-1">
      <CalendarIcon className="h-3 w-3" /> Aug 2025
    </span>
    <span className="flex items-center gap-1">
      <ClockIcon className="h-3 w-3" /> 6 min read
    </span>
  </div>
);

const CategoryCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="relative backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary/50 transition">
    <CornerElements />

    <div className="flex items-center gap-3 mb-3">
      {icon}
      <h3 className="font-semibold">{title}</h3>
    </div>

    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const BlogCard = ({
  title,
  description,
  category,
}: {
  title: string;
  description: string;
  category: string;
}) => (
  <div className="relative backdrop-blur-sm border border-border rounded-lg p-6 flex flex-col justify-between hover:border-primary/40 transition">
    <CornerElements />

    <div className="space-y-3">
      <Badge variant="outline">{category}</Badge>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>

    <div className="mt-6 flex justify-between items-center text-xs font-mono text-muted-foreground">
      <span>5 min read</span>
      <ArrowRightIcon className="h-4 w-4 text-primary" />
    </div>
  </div>
);

/* -------------------- STATIC DATA -------------------- */

const BLOGS = [
  {
    title: "Why Consistency Beats Motivation Every Time",
    description:
      "Motivation fades. Systems stay. Learn how to design fitness habits that survive low-energy days.",
    category: "Mindset",
  },
  {
    title: "Beginner Strength Training: A Complete Guide",
    description:
      "Everything you need to know to start lifting safely and effectively.",
    category: "Workouts",
  },
  {
    title: "Calorie Deficit Explained (Without the Confusion)",
    description:
      "Fat loss simplified with real-world examples and practical advice.",
    category: "Fat Loss",
  },
  {
    title: "AI Diet Planning vs Traditional Meal Plans",
    description:
      "How intelligent systems outperform static PDFs and charts.",
    category: "Nutrition",
  },
  {
    title: "Building Discipline When You Don’t Feel Like Training",
    description:
      "Mental frameworks that separate amateurs from long-term winners.",
    category: "Mindset",
  },
  {
    title: "Protein Intake: How Much Do You Really Need?",
    description:
      "Evidence-based recommendations without influencer noise.",
    category: "Nutrition",
  },
];
