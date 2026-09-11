"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ShoppingCart,
  CheckCircle2,
  Circle,
  RotateCcw,
  X,
  Apple,
  Beef,
  Wheat,
  Salad,
  PackageCheck,
  Printer,
  Copy,
  Check,
} from "lucide-react";
import CornerElements from "@/components/CornerElements";
import { Button } from "@/components/ui/button";

interface Meal {
  name: string;
  foods: string[];
}

interface GroceryListModalProps {
  isOpen: boolean;
  onClose: () => void;
  meals: Meal[];
  planName: string;
  planId: string;
}

type FoodCategory = "Protein" | "Produce" | "Carbs" | "Fats & Dairy" | "Other";

interface CategorizedItem {
  id: string;
  name: string;
  category: FoodCategory;
  sources: string[];
}

// Categorization heuristic based on common fitness diet keywords
function categorizeFood(food: string): FoodCategory {
  const f = food.toLowerCase();

  // Protein sources
  if (
    f.includes("chicken") ||
    f.includes("turkey") ||
    f.includes("salmon") ||
    f.includes("tuna") ||
    f.includes("fish") ||
    f.includes("beef") ||
    f.includes("steak") ||
    f.includes("egg") ||
    f.includes("whey") ||
    f.includes("protein") ||
    f.includes("tofu") ||
    f.includes("tempeh") ||
    f.includes("shrimp") ||
    f.includes("pork") ||
    f.includes("cottage cheese") ||
    f.includes("greek yogurt")
  ) {
    return "Protein";
  }

  // Produce / Veggies & Fruits
  if (
    f.includes("spinach") ||
    f.includes("broccoli") ||
    f.includes("kale") ||
    f.includes("asparagus") ||
    f.includes("apple") ||
    f.includes("banana") ||
    f.includes("berry") ||
    f.includes("berries") ||
    f.includes("blueberry") ||
    f.includes("strawberry") ||
    f.includes("orange") ||
    f.includes("vegetable") ||
    f.includes("salad") ||
    f.includes("cucumber") ||
    f.includes("tomato") ||
    f.includes("onion") ||
    f.includes("pepper") ||
    f.includes("avocado") ||
    f.includes("carrot") ||
    f.includes("zucchini")
  ) {
    return "Produce";
  }

  // Complex Carbs & Grains
  if (
    f.includes("oat") ||
    f.includes("rice") ||
    f.includes("quinoa") ||
    f.includes("potato") ||
    f.includes("sweet potato") ||
    f.includes("bread") ||
    f.includes("pasta") ||
    f.includes("toast") ||
    f.includes("grain") ||
    f.includes("tortilla") ||
    f.includes("bagel") ||
    f.includes("cereal")
  ) {
    return "Carbs";
  }

  // Fats, Oils, Nuts & Dairy
  if (
    f.includes("oil") ||
    f.includes("olive") ||
    f.includes("nut") ||
    f.includes("almond") ||
    f.includes("peanut") ||
    f.includes("walnut") ||
    f.includes("butter") ||
    f.includes("chia") ||
    f.includes("flax") ||
    f.includes("cheese") ||
    f.includes("milk") ||
    f.includes("seeds")
  ) {
    return "Fats & Dairy";
  }

  return "Other";
}

export default function GroceryListModal({
  isOpen,
  onClose,
  meals,
  planName,
  planId,
}: GroceryListModalProps) {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  // Load checked items from localStorage scoped to this plan
  useEffect(() => {
    if (!planId) return;
    try {
      const saved = localStorage.getItem(`fitpilot_grocery_${planId}`);
      if (saved) {
        setCheckedMap(JSON.parse(saved));
      } else {
        setCheckedMap({});
      }
    } catch {
      setCheckedMap({});
    }
  }, [planId]);

  const toggleItem = (id: string) => {
    setCheckedMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(`fitpilot_grocery_${planId}`, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save grocery state:", e);
      }
      return next;
    });
  };

  const handleReset = () => {
    setCheckedMap({});
    try {
      localStorage.removeItem(`fitpilot_grocery_${planId}`);
    } catch (e) {
      console.error("Failed to clear grocery state:", e);
    }
  };

  // Aggregate & deduplicate foods
  const { categorized, totalItems, checkedCount } = useMemo(() => {
    const itemMap = new Map<string, { name: string; sources: Set<string>; category: FoodCategory }>();

    meals.forEach((meal) => {
      meal.foods.forEach((food) => {
        const cleaned = food.trim();
        if (!cleaned) return;
        // Standardized lookup key: strip quantity/parenthesis to consolidate common items
        const normalized = cleaned
          .toLowerCase()
          .replace(/\(.*\)/g, "")
          .replace(/\d+\s*(g|oz|cups?|tbsp|tsp|scoops?|slices?|pieces?|ml)/g, "")
          .trim();

        const key = normalized || cleaned.toLowerCase();

        if (itemMap.has(key)) {
          itemMap.get(key)!.sources.add(meal.name);
        } else {
          itemMap.set(key, {
            name: cleaned,
            sources: new Set([meal.name]),
            category: categorizeFood(cleaned),
          });
        }
      });
    });

    const groups: Record<FoodCategory, CategorizedItem[]> = {
      Protein: [],
      Produce: [],
      Carbs: [],
      "Fats & Dairy": [],
      Other: [],
    };

    let total = 0;
    itemMap.forEach((val, key) => {
      total++;
      groups[val.category].push({
        id: key,
        name: val.name,
        category: val.category,
        sources: Array.from(val.sources),
      });
    });

    let checked = 0;
    itemMap.forEach((_, key) => {
      if (checkedMap[key]) checked++;
    });

    return {
      categorized: groups,
      totalItems: total,
      checkedCount: checked,
    };
  }, [meals, checkedMap]);

  const copyToClipboard = async () => {
    let text = `FITPILOT AI — GROCERY CHECKLIST\nPlan: ${planName}\n\n`;
    const categories: FoodCategory[] = ["Protein", "Produce", "Carbs", "Fats & Dairy", "Other"];

    categories.forEach((cat) => {
      const items = categorized[cat];
      if (items.length > 0) {
        text += `[ ${cat.toUpperCase()} ]\n`;
        items.forEach((item) => {
          const check = checkedMap[item.id] ? "[x]" : "[ ]";
          text += `${check} ${item.name} (${item.sources.join(", ")})\n`;
        });
        text += "\n";
      }
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.warn("Clipboard write failed");
    }
  };

  if (!isOpen) return null;

  const categoryIcons: Record<FoodCategory, React.ReactNode> = {
    Protein: <Beef className="size-4 text-rose-400" />,
    Produce: <Salad className="size-4 text-emerald-400" />,
    Carbs: <Wheat className="size-4 text-amber-400" />,
    "Fats & Dairy": <Apple className="size-4 text-sky-400" />,
    Other: <PackageCheck className="size-4 text-muted-foreground" />,
  };

  const categories: FoodCategory[] = ["Protein", "Produce", "Carbs", "Fats & Dairy", "Other"];
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border border-primary/40 bg-card/95 shadow-2xl overflow-hidden">
        <CornerElements />

        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between shrink-0 bg-background/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/30 text-primary">
              <ShoppingCart className="size-4.5" />
            </div>
            <div>
              <h3 className="font-mono text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                SMART GROCERY LIST
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                Aggregated from {meals.length} plan meals • Plan: {planName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* PROGRESS METER & ACTIONS */}
        <div className="px-4 sm:px-5 py-3 border-b border-border/70 bg-muted/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="font-mono text-xs font-semibold text-primary">
              {checkedCount}/{totalItems} items purchased ({progress}%)
            </div>
            <div className="w-24 sm:w-32 bg-muted/60 h-2 rounded-full overflow-hidden border border-border">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="h-7.5 px-2.5 text-xs font-mono border-border hover:border-primary/50 text-foreground"
              title="Copy checklist as markdown text"
            >
              {copied ? (
                <>
                  <Check className="size-3 mr-1 text-green-400" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-3 mr-1 text-primary" /> Copy List
                </>
              )}
            </Button>

            {checkedCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-7.5 px-2 text-xs font-mono text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                title="Reset all checkboxes"
              >
                <RotateCcw className="size-3 mr-1" /> Reset
              </Button>
            )}
          </div>
        </div>

        {/* CATEGORIZED ITEMS LIST (SCROLLABLE) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 grow">
          {totalItems === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-muted-foreground">
              No food items identified in current diet plan.
            </div>
          ) : (
            categories.map((cat) => {
              const items = categorized[cat];
              if (items.length === 0) return null;

              return (
                <div key={cat} className="space-y-2">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-border/50">
                    {categoryIcons[cat]}
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                      {cat} ({items.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {items.map((item) => {
                      const isDone = Boolean(checkedMap[item.id]);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-md border cursor-pointer select-none transition-all ${
                            isDone
                              ? "bg-green-500/5 border-green-500/30 opacity-70"
                              : "bg-background/40 border-border/70 hover:border-primary/50"
                          }`}
                        >
                          <button
                            type="button"
                            className="mt-0.5 shrink-0 focus:outline-none"
                          >
                            {isDone ? (
                              <CheckCircle2 className="size-4 text-green-500" />
                            ) : (
                              <Circle className="size-4 text-muted-foreground/50 hover:text-primary" />
                            )}
                          </button>

                          <div className="min-w-0 grow">
                            <span
                              className={`text-xs sm:text-sm block font-medium truncate ${
                                isDone
                                  ? "line-through text-muted-foreground"
                                  : "text-foreground"
                              }`}
                              title={item.name}
                            >
                              {item.name}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground block truncate">
                              Used in: {item.sources.join(", ")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3 sm:p-4 border-t border-border bg-background/50 flex justify-end shrink-0">
          <Button
            type="button"
            size="sm"
            onClick={onClose}
            className="h-8 px-4 text-xs font-mono font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
