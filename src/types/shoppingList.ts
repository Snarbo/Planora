export type GroupedIngredient = {
  name: string;
  count: number;
};

export type CategoryMap = Record<string, GroupedIngredient[]>;