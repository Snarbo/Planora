"use client";

import Link from "next/link";
import Image from "next/image";
import type { MealSlotProps } from "@/types/meals";
import { toSlug } from "@/utils/slug";
import { getMealImage } from "@/utils/getMealImage";

import "./meal-card.scss";

export const MealCard = ({meal}: MealSlotProps) => {

  return (
    <article className="meal-card">
      <Link href={`/meals/${toSlug(meal!.name)}`} className="meal-card__wrapper">
        <div className="meal-card__head">
          <div className="meal-card__image-wrapper">
            <Image
              src={getMealImage(meal!.name, meal!.mealType)}
              alt={meal!.name}
              width={340}
              height={235}
              loading="eager"
              className="meal-card__image"
            />
          </div>
        </div>
        <div className="meal-card__body">
          <h3 className="meal-card__name">{meal?.name}</h3>
          <div className="meal-card__time-kcal">
            {meal?.cookingTime} Mins - {meal?.nutrition.kcal}kcal
          </div>
          <div className="meal-card__tags-wrapper">
            <div className="meal-card__tags">
              {meal?.dietTypes && 
                <div className="meal-card__tag">
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