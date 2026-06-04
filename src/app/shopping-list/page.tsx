"use client";

import { useState, useEffect, useMemo } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useMealPlans } from "@/hooks/useMealPlans";
import type { CategoryMap } from "@/types/shoppingList";
import TestToast from "@/components/TestToast/TestToast"; //temp

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

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [labelOverrides, setLabelOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    const checked = localStorage.getItem("shopping-list-checked");
    const labels = localStorage.getItem("shopping-list-label-overrides");

    if (checked) setCheckedItems(JSON.parse(checked));
    if (labels) setLabelOverrides(JSON.parse(labels));
  }, []);

  const [activeSwapItem, setActiveSwapItem] = useState<string | null>(null);
  const [substitutions, setSubstitutions] = useState<string[]>([]);
  const [swapLoading, setSwapLoading] = useState(false);

  const { AIIngredientsSwaps, setAIIngredientsSwaps, dietaryDietType, dietaryAllergies } = usePreferencesStore();
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

  const handleSwap = async (ingredientName: string) => {
    if (activeSwapItem === ingredientName) {
      setActiveSwapItem(null);
      setSubstitutions([]);
      return;
    }

    setActiveSwapItem(ingredientName);
    setSubstitutions([]);
    setSwapLoading(true);

    try {
      const res = await fetch("/api/generate-ingredient-substitutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredient: ingredientName,
          dietType: dietaryDietType ?? "",
          allergies: dietaryAllergies ?? [],
        }),
      });

      const data = await res.json();
      setSubstitutions(data.substitutions ?? []);
    } catch (err) {
      console.error("Swap error:", err);
      setSubstitutions([]);
    } finally {
      setSwapLoading(false);
    }
  };

  const handleSubstitutionSelect = (sub: string) => {
    if (!activeSwapItem) return;
    setLabelOverrides((prev) => {
      const updated = { ...prev, [activeSwapItem]: sub };
      localStorage.setItem("shopping-list-label-overrides", JSON.stringify(updated));
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
                  const isActive = activeSwapItem === name;
                  const displayName = labelOverrides[name] ?? name;
                  return (
                    <div className="list__item checkbox-label" key={itemKey}>
                      <input
                        id={itemKey}
                        type="checkbox"
                        checked={!!checkedItems[itemKey]}
                        onChange={() => toggleItem(itemKey)}
                      />
                      <label htmlFor={itemKey}>
                        {count > 1 ? `${count}x ` : ""}{toTitleCase(displayName)}
                      </label>
                      {AIIngredientsSwaps && (
                        <button
                          className={`button button--tertiary ${isActive ? " button--active" : ""}`}
                          onClick={() => handleSwap(name)}
                        >
                          swap
                        </button>
                      )}
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
              <TestToast /> 
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
            {activeSwapItem && (
            <div className="sidebar__content sidebar__content--item-swaps">
              <p className="sidebar__content-header">Swap: {toTitleCase(labelOverrides[activeSwapItem] ?? activeSwapItem)}</p>
              <div className="sidebar__items">
                {swapLoading ? (
                  <p className="sidebar__loading">Finding substitutions...</p>
                ) : substitutions.length > 0 ? (
                  substitutions.map((sub) => (
                    <div
                      className="sidebar__item"
                      key={sub}
                      onClick={() => handleSubstitutionSelect(sub)}
                    >
                      <IconArrowRight color="tertiary" />
                      <p>{toTitleCase(sub)}</p>
                    </div>
                  ))
                ) : (
                  <p className="sidebar__empty">No substitutions found.</p>
                )}
              </div>
            </div>
            )}
          </aside>
        }
      </div>
    </div>
  );
}