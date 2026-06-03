import { FilterProps } from "@/types/filter";
import { MealType } from "@/types/meals";

import {
  IconSearch
} from "../Icons";

import "../../app/styles/components/filter.scss";

export type HistoryFilterProps = FilterProps & {
  activeFilters: MealType[];
  handleFilter: (filter: MealType | "all") => void;
}; 

export const HistoryFilter = ({
  enableSearch = true,
  activeFilters,
  setSearchQuery,
  handleFilter,
}: HistoryFilterProps) => {
  return (
    <div className="filter">
        {enableSearch && <div className="input input--search">
          <IconSearch />
          <input
            id="historySearch"
            name="historySearch"
            className="filter__search"
            placeholder="Search meals..."
            onChange={(e) => setSearchQuery?.(e.target.value)}
          />
        </div> }
        <div className="filter__buttons">
          <button className={`button button--filter ${activeFilters.length === 0 ? "button--active" : ""}`} onClick={() => handleFilter("all")}>All Meals</button>
          <button className={`button button--filter ${activeFilters.includes("breakfast") ? "button--active" : ""}`} onClick={() => handleFilter("breakfast")}>Breakfast</button>
          <button className={`button button--filter ${activeFilters.includes("lunch") ? "button--active" : ""}`} onClick={() => handleFilter("lunch")}>Lunch</button>
          <button className={`button button--filter ${activeFilters.includes("dinner") ? "button--active" : ""}`} onClick={() => handleFilter("dinner")}>Dinner</button>
        </div>
    </div>
  );
};