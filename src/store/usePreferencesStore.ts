import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  Units,
  CuisinePreferences,
  DietTypes,
  Allergies,
  Theme,
  PreferencesState,
} from "@/types/preferences";

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      //profile
      profilePhoto: "/assets/master/user.webp",
      setProfilePhoto: (photo) => set({ profilePhoto: photo }),

      profileName: "John Smith",
      setProfileName: (name) => set({ profileName: name }),

      profileEmail: "john.smith@gmail.com",
      setProfileEmail: (email) => set({ profileEmail: email }),

      profileUnits: "metric",
      setProfileUnits: (units: Units) => set({ profileUnits: units }),

      //AI
      AIMealGeneration: true,
      setAIMealGeneration: (mealGeneration) => set({ AIMealGeneration: mealGeneration }),

      AIIngredientsSwaps: true,
      setAIIngredientsSwaps: (ingredientsSwaps) => set({ AIIngredientsSwaps: ingredientsSwaps }),

      AINutritionInsights: true,
      setAINutritionInsights: (nutritionInsights) => set({ AINutritionInsights: nutritionInsights }),

      AICuisinePreferences: [],
      setAICuisinePreferences: (cuisinePreferences: CuisinePreferences[]) => set({ AICuisinePreferences: cuisinePreferences }),

      //nutrition goals
      nutritionCalories: 2000,
      setNutritionCalories: (calories) => set({ nutritionCalories: calories }),

      nutritionProtein: 100,
      setNutritionProtein: (protein) => set({ nutritionProtein: protein }),

      nutritionCarbs: 250,
      setNutritionCarbs: (carbs) => set({ nutritionCarbs: carbs }),

      nutritionFat: 70,
      setNutritionFat: (fat) => set({ nutritionFat: fat }),

      nutritionFibre: 28,
      setNutritionFibre: (fibre) => set({ nutritionFibre: fibre }),

      //dietary
      dietaryDietType: "none",
      setDietaryDietType: (dietType: DietTypes) => set({ dietaryDietType: dietType }),

      dietaryAllergies: [],
      setDietaryAllergies: (allergies: Allergies[]) => set({ dietaryAllergies: allergies }),

      //notifications
      notificationMealReminder: true,
      setNotificationMealReminder: (mealReminder) => set({ notificationMealReminder: mealReminder }),

      notificationShoppingList: true,
      setNotificationShoppingList: (shoppingList) => set({ notificationShoppingList: shoppingList }),

      notificationWeeklySummary: true,
      setNotificationWeeklySummary: (weeklySummary) => set({ notificationWeeklySummary: weeklySummary }),

      notificationGoalMilestones: true,
      setNotificationGoalMilestones: (goalMilestones) => set({ notificationGoalMilestones: goalMilestones }), 

      //theme
      theme: "light",
      toggleTheme: () => {
        const current = get().theme;
        set({theme: current === "light" ? "dark" : "light"});
      },
    }),
    {
      name: "preferences-storage"
    }
  )
);