"use client";

import {
  IconNutrition,
  IconWarning, 
  IconCheck
} from "@/components/Icons";

import "./insights.scss";

export const Insights = () => {

  return (
    <div className="insights">
      <div className="insight insight--nutrition">
        <div className="content__icon content__icon--nutrition">
          <IconNutrition color="blue"/>
        </div>
        <p className="insight__content">Protein on track. You're averaging 94g/day this week, close to your 100g goal. Dinner meals are your biggest protein source.</p>
      </div>
      <div className="insight insight--warning">
        <div className="content__icon content__icon--warning">
          <IconWarning color="orange" />
        </div>
        <p className="insight__content">Protein on track. You're averaging 94g/day this week, close to your 100g goal. Dinner meals are your biggest protein source.</p>
      </div>
      <div className="insight insight--danger">
        <div className="content__icon content__icon--danger">
          <IconWarning color="red" />
        </div>
        <p className="insight__content">Protein on track. You're averaging 94g/day this week, close to your 100g goal. Dinner meals are your biggest protein source.</p>
      </div>
      <div className="insight insight--check">
        <div className="content__icon content__icon--check">
          <IconCheck color="green" />
        </div>
        <p className="insight__content">Protein on track. You're averaging 94g/day this week, close to your 100g goal. Dinner meals are your biggest protein source.</p>
      </div>
    </div>
  );
};