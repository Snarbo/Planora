import { create } from "zustand";
import { StoredMealPlan } from "@/hooks/useMealPlans";

type MealPlansStore = {
  plans: StoredMealPlan[];
  setPlans: (plans: StoredMealPlan[]) => void;
};

export const useMealPlansStore = create<MealPlansStore>((set) => ({
  plans: [],
  setPlans: (plans) => set({ plans }),
}));