import jsPDF from "jspdf";
import type { StoredMealPlan } from "@/hooks/useMealPlans";
import type { CategoryMap } from "@/types/shoppingList";

export const toTitleCase = (str: string) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

export const getWeekLabel = (plans: StoredMealPlan[]) => {
  if (plans.length === 0) return "";
  const dates = plans.map((p) => p.date).sort();
  const start = new Date(dates[0]);
  const end = new Date(dates[dates.length - 1]);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${fmt(start)} - ${fmt(end)}`;
};

export const buildShoppingList = (plans: StoredMealPlan[]): CategoryMap => {
  const counts: Record<string, { count: number; category: string }> = {};

  plans.forEach((plan) => {
    Object.values(plan.meals).forEach((meal) => {
      if (!meal) return;
      meal.ingredients.forEach(({ name, category }) => {
        if (counts[name]) {
          counts[name].count += 1;
        } else {
          counts[name] = { count: 1, category };
        }
      });
    });
  });

  const grouped: CategoryMap = {};
  Object.entries(counts).forEach(([name, { count, category }]) => {
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push({ name, count });
  });

  const sorted: CategoryMap = {};
  Object.keys(grouped)
    .sort()
    .forEach((cat) => {
      sorted[toTitleCase(cat)] = grouped[cat].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    });

  return sorted;
};

export const groupPlansByWeek = (plans: StoredMealPlan[]) => {
  const weeks: Record<string, StoredMealPlan[]> = {};

  plans.forEach((plan) => {
    const date = new Date(plan.date);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    const weekKey = monday.toISOString().split("T")[0];

    if (!weeks[weekKey]) weeks[weekKey] = [];
    weeks[weekKey].push(plan);
  });

  return weeks;
};

export const handleExportPDF = (
  shoppingList: CategoryMap,
  label: string,
  mealCount: number
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  let y = 20;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Shopping List", margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text(`Generated from ${mealCount} meals: ${label}`, margin, y);
  doc.setTextColor(0);
  y += 10;

  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  Object.entries(shoppingList).forEach(([category, ingredients]) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(category, margin, y);
    y += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    ingredients.forEach(({ name, count }) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      const itemLabel = `${count > 1 ? `${count}x ` : ""}${toTitleCase(name)}`;
      doc.text(`• ${itemLabel}`, margin + 4, y);
      y += 6;
    });

    y += 4;
  });

  doc.save(`shopping-list-${label.replace(/\s/g, "-").toLowerCase()}.pdf`);
};

export const handleCopyList = (
  shoppingList: CategoryMap,
  label: string,
  mealCount: number
) => {
  const lines: string[] = [
    `Shopping List — ${mealCount} meals: ${label}`,
    "",
  ];

  Object.entries(shoppingList).forEach(([category, ingredients]) => {
    lines.push(category);
    ingredients.forEach(({ name, count }) => {
      lines.push(`  • ${count > 1 ? `${count}x ` : ""}${toTitleCase(name)}`);
    });
    lines.push("");
  });

  navigator.clipboard.writeText(lines.join("\n"));
};