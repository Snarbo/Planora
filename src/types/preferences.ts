export const UNITS = [
  "metric",
  "imperial",
] as const;

export type Units = (typeof UNITS)[number];

export const CUISINE_PREFERENCES = [
  "italian",
  "asian",
  "mexican",
  "indian",
  "british",
] as const;

export type CuisinePreferences = (typeof CUISINE_PREFERENCES)[number];

export const DIET_TYPES = [
  "none",
  "vegetarian",
  "vegan",
  "keto",
  "pescatarian",
] as const;

export type DietTypes = (typeof DIET_TYPES)[number];

export const ALLERGIES = [
  "gluten",
  "dairy",
  "shellfish",
  "nuts",
  "eggs",
  "soy",
  "fish",
] as const;

export type Allergies = (typeof ALLERGIES)[number];

export const THEMES = [
  "light",
  "dark",
] as const;

export type Theme = (typeof THEMES)[number];

export type PreferencesState = {
  //profile
  profilePhoto: string;
  setProfilePhoto: (photo: string) => void;

  profileName: string;
  setProfileName: (name: string) => void;

  profileEmail: string;
  setProfileEmail: (email: string) => void;

  profileUnits: Units;
  setProfileUnits: (units: Units) => void;

  //AI
  AIMealGeneration: boolean;
  setAIMealGeneration: (mealGeneration: boolean) => void;

  AIIngredientsSwaps: boolean;
  setAIIngredientsSwaps: (ingredientsSwaps: boolean) => void;

  AINutritionInsights: boolean;
  setAINutritionInsights: (nutritionInsights: boolean) => void;

  AICuisinePreferences: CuisinePreferences[];
  setAICuisinePreferences: (cuisinePreferences: CuisinePreferences[]) => void;

  //nutrition goals
  nutritionCalories: number;
  setNutritionCalories: (calories: number) => void;

  nutritionProtein: number;
  setNutritionProtein: (protein: number) => void;

  nutritionCarbs: number;
  setNutritionCarbs: (carbs: number) => void;

  nutritionFat: number;
  setNutritionFat: (fat: number) => void;

  nutritionFibre: number;
  setNutritionFibre: (fibre: number) => void;

  //dietary needs
  dietaryDietType: DietTypes;
  setDietaryDietType: (dietType: DietTypes) => void;

  dietaryAllergies: Allergies[];
  setDietaryAllergies: (allergies: Allergies[]) => void;

  //notifications
  notificationMealReminder: boolean;
  setNotificationMealReminder: (mealReminder: boolean) => void;

  notificationShoppingList: boolean;
  setNotificationShoppingList: (shoppingList: boolean) => void;

  notificationWeeklySummary: boolean;
  setNotificationWeeklySummary: (weeklySummary: boolean) => void;

  notificationGoalMilestones: boolean;
  setNotificationGoalMilestones: (goalMilestones: boolean) => void;

  //theme
  theme: Theme;
  toggleTheme: () => void;
};