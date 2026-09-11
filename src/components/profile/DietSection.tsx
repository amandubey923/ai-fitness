"use client";

import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export interface MealItem {
  name: string;
  foods: string[];
}

export interface DietPlanData {
  dailyCalories: number;
  meals: MealItem[];
}

interface DietSectionProps {
  dietplan: DietPlanData;
  onOpenGrocery: () => void;
}

function DietSectionComponent({ dietplan, onOpenGrocery }: DietSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-3.5 rounded-lg border border-border bg-background/40">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            DAILY NUTRITION TARGET
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground">
            Personalized for your fitness objective
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenGrocery}
            className="h-8 px-3 text-xs font-mono border-primary/40 text-primary hover:bg-primary/10"
          >
            <ShoppingCart className="size-3.5 mr-1.5" />
            Grocery Checklist
          </Button>
          <div className="font-mono text-xl sm:text-2xl font-bold text-primary tracking-tight">
            {dietplan.dailyCalories} KCAL
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {dietplan.meals.map((meal, index) => (
          <div
            key={index}
            className="border border-border bg-card/20 rounded-lg overflow-hidden p-4 space-y-2.5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                <h4 className="font-mono text-base font-bold text-primary tracking-tight">
                  {meal.name}
                </h4>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {meal.foods.length} items
              </span>
            </div>

            <ul className="space-y-1.5">
              {meal.foods.map((food, foodIndex) => (
                <li
                  key={foodIndex}
                  className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground"
                >
                  <span className="text-xs text-primary font-mono font-semibold mt-0.5">
                    {String(foodIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="text-foreground/95 leading-normal">{food}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(DietSectionComponent);
