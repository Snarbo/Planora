"use client";

import { useRef } from "react";
import { useShallow } from "zustand/react/shallow"
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { usePreferencesField } from "@/hooks/usePreferences";
import {useImageUpload} from "@/hooks/useImageUpload";
import { TopBar } from "@/components/TopBar/TopBar";
import { Toggle } from "@/components/Toggle/Toggle";

import {
  UNITS,
  Units,
  CUISINE_PREFERENCES,
  CuisinePreferences,
  DIET_TYPES,
  DietTypes,
  ALLERGIES,
  Allergies,
} from "@/types/preferences";

import "./preferences.scss";

export default function Preferences() {
  const profilePhotoFileInputRef = useRef<HTMLInputElement>(null);
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const { uploadImage, uploadLoading, uploadError } = useImageUpload({ size: 45 });

  // profile
  const { profilePhoto, setProfilePhoto, profileName, setProfileName, profileEmail } = usePreferencesStore(
    useShallow((s) => ({
      profilePhoto: s.profilePhoto,
      setProfilePhoto: s.setProfilePhoto,
      profileName: s.profileName,
      setProfileName: s.setProfileName,
      profileEmail: s.profileEmail,
    }))
  );

  const email = usePreferencesField<string>({
    value: profileEmail,
    setter: usePreferencesStore((s) => s.setProfileEmail),
    validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errorMessage: "Please enter a valid email",
  });

  const profileUnits = usePreferencesField<Units>({
    value: usePreferencesStore((s) => s.profileUnits),
    setter: usePreferencesStore((s) => s.setProfileUnits),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    try {
      const compressedImage = await uploadImage(file);

      if (compressedImage) {
        setProfilePhoto(compressedImage);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  // AI
  const { AIMealGeneration, setAIMealGeneration, AIIngredientsSwaps, setAIIngredientsSwaps, AINutritionInsights, setAINutritionInsights } = usePreferencesStore(
    useShallow((s) => ({
      AIMealGeneration: s.AIMealGeneration,
      setAIMealGeneration: s.setAIMealGeneration,
      AIIngredientsSwaps: s.AIIngredientsSwaps,
      setAIIngredientsSwaps: s.setAIIngredientsSwaps,
      AINutritionInsights: s.AINutritionInsights,
      setAINutritionInsights: s.setAINutritionInsights,
    }))
  );

  const AICuisinePreferences = usePreferencesField<CuisinePreferences[]>({
    value: usePreferencesStore((s) => s.AICuisinePreferences),
    setter: usePreferencesStore((s) => s.setAICuisinePreferences),
  });

  // nutrition goals
  const { nutritionCalories, setNutritionCalories, nutritionProtein, setNutritionProtein, nutritionCarbs, setNutritionCarbs, nutritionFat, setNutritionFat, nutritionFibre, setNutritionFibre } = usePreferencesStore(
    useShallow((s) => ({
      nutritionCalories: s.nutritionCalories,
      setNutritionCalories: s.setNutritionCalories,
      nutritionProtein: s.nutritionProtein,
      setNutritionProtein: s.setNutritionProtein,
      nutritionCarbs: s.nutritionCarbs,
      setNutritionCarbs: s.setNutritionCarbs,
      nutritionFat: s.nutritionFat,
      setNutritionFat: s.setNutritionFat,
      nutritionFibre: s.nutritionFibre,
      setNutritionFibre: s.setNutritionFibre,
    }))
  );

  // dietary needs
  const dietaryDietType = usePreferencesField<DietTypes>({
    value: usePreferencesStore((s) => s.dietaryDietType),
    setter: usePreferencesStore((s) => s.setDietaryDietType),
  });

  const dietaryAllergies = usePreferencesField<Allergies[]>({
    value: usePreferencesStore((s) => s.dietaryAllergies),
    setter: usePreferencesStore((s) => s.setDietaryAllergies),
  });

  // notifications
  const { notificationMealReminder, setNotificationMealReminder, notificationShoppingList, setNotificationShoppingList, notificationWeeklySummary, setNotificationWeeklySummary, notificationGoalMilestones, setNotificationGoalMilestones } = usePreferencesStore(
    useShallow((s) => ({
      notificationMealReminder: s.notificationMealReminder,
      setNotificationMealReminder: s.setNotificationMealReminder,
      notificationShoppingList: s.notificationShoppingList,
      setNotificationShoppingList: s.setNotificationShoppingList,
      notificationWeeklySummary: s.notificationWeeklySummary,
      setNotificationWeeklySummary: s.setNotificationWeeklySummary,
      notificationGoalMilestones: s.notificationGoalMilestones,
      setNotificationGoalMilestones: s.setNotificationGoalMilestones,
    }))
  );

  return (
    <div className="standard-content preferences">
      <TopBar />
      <div className="standard-content__wrapper">
        <div className="content__groups">
          <div className="content__group">
            <h3 className="content__title">Profile</h3>
            <div className="preferences__row preferences__row--profile">
              <div className="profile">
                <img className="profile__image" src={profilePhoto} alt={profileName} />
                <div className="profile__content">
                  <p className="profile__name">{profileName}</p>
                  <p className="profile__email">{profileEmail}</p>               
                </div>
              </div>
              <div className="content__edit">
                <input
                  ref={profilePhotoFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <button className="button button--tertiary" onClick={() => profilePhotoFileInputRef.current?.click()} disabled={uploadLoading}>Edit photo</button>
              </div>     
            </div>
            {uploadError && <p className="error">{uploadError}</p>}     
            <div className="preferences__row preferences__row--name">
              <p className="preferences__row-title">Name</p>
              <div className="content__edit">
                <input className="input__text" type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
              </div>
            </div>
            <div className="preferences__row preferences__row--email">
              <p className="preferences__row-title">Email address</p>
              <div className="content__edit">
                <input className="input__text" type="email" value={email.value} onChange={(e) => email.setValue(e.target.value)} />
                {email.error && (
                  <p className="error">{email.error}</p>
                )}
              </div>
            </div>
            <div className="preferences__row preferences__row--units">
              <div>
                <p className="preferences__row-title">Units</p>
                <p className="preferences__row-content">Weight and measurement system</p>
              </div>
              <div className="preferences__buttons">
                {UNITS.map((type: Units) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => profileUnits.selectValue(type)}
                    className={`button button--tertiary button--${profileUnits.isSelected(type) ? "active" : ""}`}>
                    {capitalize(type)}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="content__group">
            <h3 className="content__title">AI settings</h3>
            <div className="preferences__row preferences__row--meal-generation">
              <div>
                <p className="preferences__row-title">Meal generation</p>
                <p className="preferences__row-content">AI generates your weekly plan</p>
              </div>        
              <div className="content__edit">
                <Toggle
                  enabled={AIMealGeneration}
                  onToggle={() =>
                    setAIMealGeneration(!AIMealGeneration)
                  }
                />
              </div>
            </div>
            <div className="preferences__row preferences__row--ingredients-swaps">
              <div>
                <p className="preferences__row-title">Ingredient swaps</p>
                <p className="preferences__row-content">Suggest allergy-safe substitutions</p>
              </div>        
              <div className="content__edit">
                <Toggle
                  enabled={AIIngredientsSwaps}
                  onToggle={() =>
                    setAIIngredientsSwaps(!AIIngredientsSwaps)
                  }
                />
              </div>
            </div>
            <div className="preferences__row preferences__row--nutrition-insights">
              <div>
                <p className="preferences__row-title">Nutrition insights</p>
                <p className="preferences__row-content">Weekly AI nutrition analysis</p>
              </div>        
              <div className="content__edit">
                <Toggle
                  enabled={AINutritionInsights}
                  onToggle={() =>
                    setAINutritionInsights(!AINutritionInsights)
                  }
                />
              </div>
            </div>
            <div className="preferences__row preferences__row--no-flex preferences__row--cuisine-preferences">
              <p className="preferences__row-title">Cuisine preferences</p>
              <p className="preferences__row-content">Favour when generating plans</p>
              <div className="preferences__buttons">
                {CUISINE_PREFERENCES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => AICuisinePreferences.toggleValue(type)}
                  className={`button button--tertiary button--${AICuisinePreferences.isSelected(type) ? "active" : ""}`}>
                  {capitalize(type)}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="content__groups">
          <div className="content__group">
            <h3 className="content__title">Nutrition goals</h3>
            <div className="preferences__row preferences__row--calories">
              <div>
                <p className="preferences__row-title">Daily calories</p>
                <p className="preferences__row-content">Target kcal per day</p>
              </div>
              <div className="content__edit">
                <div className="content__input-suffix">
                  <input className="input__text" type="number" value={nutritionCalories} onChange={(e) => setNutritionCalories(Number(e.target.value))} />
                  <p className="input__suffix">kcal</p>
                </div>     
              </div>
            </div>
            <div className="preferences__row preferences__row--flex preferences__row--protein-carbs">
              <div className="row">
                <p className="preferences__row-title">Protein</p>
                <div className="content__edit">
                  <div className="content__input-suffix">
                    <input className="input__text" type="number" value={nutritionProtein} onChange={(e) => setNutritionProtein(Number(e.target.value))} />
                    <p className="input__suffix">g</p>
                  </div>     
                </div>
              </div>
              <div className="row">
                <p className="preferences__row-title">Carbs</p>
                <div className="content__edit">
                  <div className="content__input-suffix">
                    <input className="input__text" type="number" value={nutritionCarbs} onChange={(e) => setNutritionCarbs(Number(e.target.value))} />
                    <p className="input__suffix">g</p>
                  </div>     
                </div>
              </div>
            </div>
            <div className="preferences__row preferences__row--flex preferences__row--fat-fibre">
              <div className="row">
                <p className="preferences__row-title">Fat</p>
                <div className="content__edit">
                  <div className="content__input-suffix">
                    <input className="input__text" type="number" value={nutritionFat} onChange={(e) => setNutritionFat(Number(e.target.value))} />
                    <p className="input__suffix">g</p>
                  </div>     
                </div>
              </div>
              <div className="row">
                <p className="preferences__row-title">Fibre</p>
                <div className="content__edit">
                  <div className="content__input-suffix">
                    <input className="input__text" type="number" value={nutritionFibre} onChange={(e) => setNutritionFibre(Number(e.target.value))} />
                    <p className="input__suffix">g</p>
                  </div>     
                </div>
              </div>
            </div>
          </div>
          <div className="content__group">
            <h3 className="content__title">Dietary Needs</h3>
              <div className="preferences__row preferences__row--no-flex preferences__row--diet-type">
                <p className="preferences__row-title">Diet type</p>
                <div className="preferences__buttons">
                  {DIET_TYPES.map((type: DietTypes) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => dietaryDietType.selectValue(type)}
                      className={`button button--tertiary button--${dietaryDietType.isSelected(type) ? "active" : ""}`}>
                      {capitalize(type)}</button>
                  ))}
                </div>
              </div>
              <div className="preferences__row preferences__row--no-flex preferences__row--allergies">
                <p className="preferences__row-title">Allergies & intolerances</p>
                <div className="preferences__buttons">
                  {ALLERGIES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => dietaryAllergies.toggleValue(type)}
                    className={`button button--tertiary button--${dietaryAllergies.isSelected(type) ? "active" : ""}`}>
                    {capitalize(type)}</button>
                  ))}
                </div>
              </div>
          </div>
          <div className="content__group">
            <h3 className="content__title">Notifications</h3>
            <div className="preferences__row preferences__row--flex preferences__row--meal-shopping">
              <div className="row">
                <div>
                  <p className="preferences__row-title">Meal reminders</p>
                  <p className="preferences__row-content">Remind me to log unplanned meals</p>
                </div>
                <div className="content__edit">
                    <Toggle
                      enabled={notificationMealReminder}
                      onToggle={() =>
                        setNotificationMealReminder(!notificationMealReminder)
                      }
                    />
                </div>
              </div>
              <div className="row">
                <div>
                  <p className="preferences__row-title">Shopping list alerts</p>
                  <p className="preferences__row-content">Notify when a new list is ready</p>
                </div>
                <div className="content__edit">
                    <Toggle
                      enabled={notificationShoppingList}
                      onToggle={() =>
                        setNotificationShoppingList(!notificationShoppingList)
                      }
                    />
                </div>
              </div>
            </div>
            <div className="preferences__row preferences__row--flex preferences__row--weekly-goal">
              <div className="row">
                <div>
                  <p className="preferences__row-title">Weekly summary</p>
                  <p className="preferences__row-content">Nutrition recap every Monday</p>
                </div>
                <div className="content__edit">
                  <Toggle
                    enabled={notificationWeeklySummary}
                    onToggle={() =>
                      setNotificationWeeklySummary(!notificationWeeklySummary)
                    }
                  />    
                </div>
              </div>
              <div className="row">
                <div>
                  <p className="preferences__row-title">Goal milestones</p>
                  <p className="preferences__row-content">Celebrate streaks and targets</p>
                </div>
                <div className="content__edit">
                    <Toggle
                      enabled={notificationGoalMilestones}
                      onToggle={() =>
                        setNotificationGoalMilestones(!notificationGoalMilestones)
                      }
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}