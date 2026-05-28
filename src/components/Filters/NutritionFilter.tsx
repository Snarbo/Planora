import { FilterProps } from "@/types/filter";
import { NutritionFilters } from "@/types/nutrition";

import "../../app/styles/components/filter.scss";

export type NutritionFilterProps = FilterProps & {
  activeFilters: NutritionFilters[];
  handleFilter: (filter: NutritionFilters | "all") => void;
}; 

export const NutritionFilter = ({
  activeFilters,
  handleFilter,
}: NutritionFilterProps) => {
  return (
    <div className="filter">
        <div className="filter__buttons">
          <button className={`button button--filter ${activeFilters.includes("day") ? "button--active" : ""}`} onClick={() => handleFilter("day")}>Day</button>
          <button className={`button button--filter ${activeFilters.includes("week") ? "button--active" : ""}`} onClick={() => handleFilter("week")}>Week</button>
          <button className={`button button--filter ${activeFilters.includes("month") ? "button--active" : ""}`} onClick={() => handleFilter("month")}>Month</button>
        </div>
    </div>
  );
};