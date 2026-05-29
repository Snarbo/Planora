// app/recipes/[slug]/page.tsx
"use client";

import { useMeals } from "@/hooks/useMeals";
import { useParams } from "next/navigation";
import { toSlug } from "@/utils/slug";
import { TopBar } from "@/components/TopBar/TopBar";
import Image from "next/image";
import Link from "next/link";

export default function MealDetail() {
  const { slug } = useParams();
  const { meals } = useMeals();

  const meal = meals.find((m) => toSlug(m.name) === slug);

  if (!meal) return <div>Loading...</div>;

  return (
    <div className="standard-content recipe-detail">
      <TopBar />
      <div className="standard-content__wrapper">

        <Link href="/recipes">← Back</Link>

        <div className="recipe-detail__image-wrapper">
          <Image
            src={"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1740&auto=format&fit=crop"}
            alt={meal.name}
            width={800}
            height={500}
            className="recipe-detail__image"
          />
        </div>

        <h1 className="recipe-detail__name">{meal.name}</h1>

        <div className="recipe-detail__meta">
          <span>{meal.cookingTime} mins</span>
          <span>{meal.dietTypes}</span>
          <span>{meal.mealType}</span>
        </div>

        <section className="recipe-detail__nutrition">
          <h2>Nutrition</h2>
          <div className="recipe-detail__nutrition-grid">
            <div><strong>{meal.nutrition.kcal}</strong><span>kcal</span></div>
            <div><strong>{meal.nutrition.protein}g</strong><span>protein</span></div>
            <div><strong>{meal.nutrition.carbs}g</strong><span>carbs</span></div>
            <div><strong>{meal.nutrition.fat}g</strong><span>fat</span></div>
            <div><strong>{meal.nutrition.fibre}g</strong><span>fibre</span></div>
          </div>
        </section>

        <section className="recipe-detail__ingredients">
          <h2>Ingredients</h2>
          <ul>
            {meal.ingredients.map((ing) => (
              <li key={ing.name}>{ing.name}</li>
            ))}
          </ul>
        </section>

        {meal.allergyTypes && meal.allergyTypes.length > 0 && (
          <section className="recipe-detail__allergies">
            <h2>Allergens</h2>
            <div className="recipe-detail__allergy-tags">
              {meal.allergyTypes.map((a) => (
                <span key={a} className="recipe-detail__allergy-tag">{a}</span>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}