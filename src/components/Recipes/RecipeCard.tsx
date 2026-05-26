"use client";

import Link from "next/link";
import Image from "next/image";
import type { MealSlotProps } from "@/types/meals";

import "./recipe-card.scss";

export const RecipeCard = ({meal}: MealSlotProps) => {

  console.log(meal);

  return (
    <article className="recipe-card">
      <Link href="/lorem" className="recipe-card__wrapper">
        <div className="recipe-card__head">
          <div className="recipe-card__image-wrapper">
            <Image
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1740&auto=format&fit=crop"
              alt={meal!.name}
              width={340}
              height={230}
              loading="eager"
              className="recipe-card__image"
            />
          </div>
        </div>
        <div className="recipe-card__body">
          <h3 className="recipe-card__name">{meal?.name}</h3>
          <div className="recipe-card__time-kcal">
            {meal?.cookingTime} Mins - {meal?.nutrition.kcal}kcal
          </div>
          <div className="recipe-card__tags-wrapper">
            <div className="recipe-card__tags">
              {meal?.dietTypes && 
                <div className="recipe-card__tag">
                  {meal.dietTypes}
                </div>
              }
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};