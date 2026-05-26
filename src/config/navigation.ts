import {
  IconPlan,
  IconHistory,
  IconSearch,
  IconShoppingList,
  IconNutrition,
  IconSettings,
} from "@/components/Icons";

import type { NavGroup } from "@/types/navigation";

export const navGroups: NavGroup[] = [
  {
    title: "Plan",
    items: [
      { href: "/plan", label: "Plan", expandedLabel: "Weekly Plan", icon: IconPlan },
      { href: "/history", label: "History", expandedLabel: "Meal History", icon: IconHistory },
    ],
  },
  {
    title: "Discover",
    items: [
      { href: "/recipes", label: "Recipes", expandedLabel: "Recipes", icon: IconSearch },
      { href: "/shopping-list", label: "Shopping", expandedLabel: "Shopping List", icon: IconShoppingList },
      { href: "/nutrition", label: "Nutrition", expandedLabel: "Nutrition", icon: IconNutrition },
    ],
  },
  {
    title: "Settings",
    items: [
      { href: "/preferences", label: "Settings", expandedLabel: "Preferences", icon: IconSettings },
    ],
  },
];