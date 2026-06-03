import { RecipeFilters } from "@/types/recipes";
import { FilterProps } from "@/types/filter";

import {
  IconSearch
} from "../Icons";

import "../../app/styles/components/filter.scss";

export type MealsFilterProps = FilterProps & {
  activeFilters: RecipeFilters[];
  handleFilter: (filter: RecipeFilters | "all") => void;
}; 

export const MealsFilter = ({
  enableSearch = true,
  activeFilters,
  setSearchQuery,
  handleFilter,
}: MealsFilterProps) => {
  return (
    <div className="filter">
        {enableSearch && <div className="input input--search">
          <IconSearch />
          <input
            id="historySearch"
            name="historySearch"
            className="filter__search"
            placeholder="Search recipes..."
            onChange={(e) => setSearchQuery?.(e.target.value)}
          />
        </div> }
        <div className="filter__buttons">
          <button className={`button button--filter ${activeFilters.length === 0 ? "button--active" : ""}`} onClick={() => handleFilter("all")}>All Recipes</button>
          <button className={`button button--filter ${activeFilters.includes("vegan") ? "button--active" : ""}`} onClick={() => handleFilter("vegan")}>Vegan</button>
          <button className={`button button--filter ${activeFilters.includes("30Mins") ? "button--active" : ""}`} onClick={() => handleFilter("30Mins")}>Under 30 Mins</button>
          <button className={`button button--filter ${activeFilters.includes("highProtein") ? "button--active" : ""}`} onClick={() => handleFilter("highProtein")}>High Protein</button>
        </div>
    </div>
  );
};