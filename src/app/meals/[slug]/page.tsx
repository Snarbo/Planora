// app/meals/[slug]/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMeals } from "@/hooks/useMeals";
import { toSlug } from "@/utils/slug";
import { getMealImage } from "@/utils/getMealImage";
import { TopBar } from "@/components/TopBar/TopBar";
import { MealCard } from "@/components/Meals/MealCard";


import "./meal-detail.scss";

import {
  IconArrowLeft
} from "@/components/Icons";

export default function MealDetail() {
  const { slug } = useParams();
  const { meals } = useMeals();

  const meal = meals.find((m) => toSlug(m.name) === slug);

  const relatedMeals = [
    ...meals.filter((m) => toSlug(m.name) !== slug && m.mealType === meal?.mealType),
  ].filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i).slice(0, 4);

  if (!meal) return <div>Loading...</div>;

  return (
    <div className="standard-content meal-detail">
      <TopBar />
      <div className="standard-content__wrapper">  
        <div className="standard-content__layout">
          <div className="standard-content__view scrollable">
            <div className="meal-detail__header">
              <div className="meal-detail__title-tags">
                <h1 className="meal-detail__title">{meal.name}</h1>
                <div className="meal-detail__tags">
                  <div className="meal-detail__tag">{meal.mealType}</div>
                  <div className="meal-detail__tag">{meal.dietTypes}</div>
                  <div className="meal-detail__tag">{meal.cookingTime} Mins</div>
                </div>
              </div>     
              <Link className="button button--secondary button--icon" href="/meals"><IconArrowLeft color="ivory" /> Back</Link>
            </div>
            <div className="content__groups">
              <div className="meal-detail__image-nutrition">
                <div className="meal-detail__image-wrapper">
                  <Image
                    src={getMealImage(meal!.name, meal!.mealType)}
                    alt={meal.name}
                    width={800}
                    height={500}
                    className="meal-detail__image"
                  />
                </div>
                <div className="meal-detail__nutrition">
                    <div className="meal-detail__nutrition-item meal-detail__nutrition-item--kcal">
                      <h1>{meal.nutrition.kcal}</h1>
                      <p>kcal</p>
                    </div>
                    <div className="meal-detail__nutrition-item meal-detail__nutrition-item--protein">
                      <h1>{meal.nutrition.protein}<span>g</span></h1>
                      <p>Protein</p>
                    </div>
                    <div className="meal-detail__nutrition-item meal-detail__nutrition-item--carbs">
                      <h1>{meal.nutrition.carbs}<span>g</span></h1>
                      <p>Carbs</p>
                    </div>
                    <div className="meal-detail__nutrition-item meal-detail__nutrition-item--fat">
                      <h1>{meal.nutrition.fat}<span>g</span></h1>
                      <p>Fat</p>
                    </div>
                    <div className="meal-detail__nutrition-item meal-detail__nutrition-item--fibre">
                      <h1>{meal.nutrition.fibre}<span>g</span></h1>
                      <p>Fibre</p>
                    </div>
                </div>
              </div>
              <div className="content__group content__group--ingredients">
                <h3 className="content__title">Ingredients</h3>
                <ul>
                  {meal.ingredients.map((ing) => (
                    <li key={ing.name} className="list-item">{ing.name}</li>
                  ))}
              </ul>
              </div>
              <div className="content__group content__group--allergens">
                <h3 className="content__title">Allergens</h3>
                {meal.allergyTypes && meal.allergyTypes.length > 0 ? (
                  <ul>
                    {meal.allergyTypes.map((a) => (
                      <li key={a} className="list-item">{a}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="content__empty">No allergens listed for this meal.</p>
                )}
              </div>
            </div>
            <div className="related-items">
              <h2 className="related-items__title">Other meals you may be interested in...</h2>
              <div className="related-items__items">
                {relatedMeals.map((relatedMeal) => (
                  <MealCard key={relatedMeal.id} type={relatedMeal.mealType} meal={relatedMeal} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}