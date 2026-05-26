"use client";

import { useState, useMemo } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useMealPlans } from "@/hooks/useMealPlans";
import type { CategoryMap } from "@/types/shoppingList";

import {
  toTitleCase,
  getWeekLabel,
  buildShoppingList,
  groupPlansByWeek,
  handleExportPDF,
  handleCopyList,
} from "@/lib/shoppingList";
import { TopBar } from "@/components/TopBar/TopBar";

import {
  IconClose,
  IconStars,
  IconArrowRight
} from "@/components/Icons";

import "./shopping-list.scss";

export default function ShoppingList() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedWeek, setCopiedWeek] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    const stored = localStorage.getItem("shopping-list-checked");
    return stored ? JSON.parse(stored) : {};
  });
  const { AIIngredientsSwaps, setAIIngredientsSwaps } = usePreferencesStore();
  const { plans, loading } = useMealPlans();

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setAIIngredientsSwaps(false);
  };

  const toggleItem = (key: string) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("shopping-list-checked", JSON.stringify(updated));
      return updated;
    });
  };

  const onCopy = (shoppingList: CategoryMap, label: string, mealCount: number, weekKey: string) => {
    handleCopyList(shoppingList, label, mealCount);
    setCopiedWeek(weekKey);
    setTimeout(() => setCopiedWeek(null), 2000);
  };

  const weeklyPlans = useMemo(() => groupPlansByWeek(plans), [plans]);

  const renderContent = () => {
    if (loading) {
      return <p className="loading">Loading...</p>;
    }

    if (Object.keys(weeklyPlans).length === 0) {
      return <p className="no-results">No meals planned yet. Add meals to your plan to generate a shopping list.</p>;
    }

    return Object.entries(weeklyPlans).sort().map(([weekKey, weekPlans]) => {
      const shoppingList = buildShoppingList(weekPlans);
      const mealCount = weekPlans.reduce(
        (acc, p) => acc + Object.values(p.meals).filter(Boolean).length, 0
      );
      const label = getWeekLabel(weekPlans);

      return (
        <div className="week" key={weekKey}>
          <div className="shopping-list__controls">
            <div className="shopping-list__generate-date">
              <p>Generated from {mealCount} meals: {label}</p>
              <hr />
            </div>
            <div className="buttons">
              <button
                className="button button--secondary"
                onClick={() => handleExportPDF(shoppingList, label, mealCount)}
              >
                Export PDF
              </button>
              <button
                className="button button--secondary"
                onClick={() => onCopy(shoppingList, label, mealCount, weekKey)}
              >
                {copiedWeek === weekKey ? "Copied!" : "Copy List"}
              </button>
            </div>
          </div>

          {Object.entries(shoppingList).map(([category, ingredients]) => (
            <div className="list__wrapper" key={category}>
              <h3 className="list__heading">{category}</h3>
              <div className="list checkbox-list">
                {ingredients.map(({ name, count }) => {
                  const itemKey = `${weekKey}-${name}`;
                  return (
                    <div className="list__item checkbox-label" key={itemKey}>
                      <input
                        id={itemKey}
                        type="checkbox"
                        checked={!!checkedItems[itemKey]}
                        onChange={() => toggleItem(itemKey)}
                      />
                      <label htmlFor={itemKey}>
                        {count > 1 ? `${count}x ` : ""}{toTitleCase(name)}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div className="standard-content shopping-list">
      <TopBar />
      <div className="shopping-list__wrapper">
        <div className="standard-content__wrapper">
          <div className="standard-content__layout">
            <div className="standard-content__view scrollable">
              {renderContent()}
            </div>
          </div>
        </div>

        {AIIngredientsSwaps && isSidebarOpen &&
          <aside className="sidebar">
            <button className="sidebar__close" onClick={handleCloseSidebar}>
              <IconClose color="ivory" />
            </button>
            <h3 className="sidebar__heading"><IconStars color="tertiary" /> AI Substitutions</h3>
            <p className="sidebar__subheading">Tap any item for ingredient swaps.</p>
            <div className="sidebar__content sidebar__content--item-swaps">
              <p className="sidebar__content-header">Swap: salmon filets</p>
              <div className="sidebar__items">
                <div className="sidebar__item">
                  <IconArrowRight color="tertiary" />
                  <p>Sea bass</p>
                </div>
                <div className="sidebar__item">
                  <IconArrowRight color="tertiary" />
                  <p>Cod fillet</p>
                </div>
                <div className="sidebar__item">
                  <IconArrowRight color="tertiary" />
                  <p>Tofu (vegan)</p>
                </div>
              </div>
            </div>
          </aside>
        }
      </div>
    </div>
  );
}