import { create } from "zustand";
import type { Insight } from "@/types/insights";

interface InsightsStore {
  insights: Insight[];
  setInsights: (insights: Insight[]) => void;
}

export const useInsightsStore = create<InsightsStore>((set) => ({
  insights: [],
  setInsights: (insights) => set({ insights }),
}));