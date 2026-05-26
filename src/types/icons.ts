import type { ComponentType } from "react";

export type IconColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "white"
  | "midnight"
  | "ivory"
  | "cream"
  | "light-grey"
  | "grey"
  | "mint"
  | "green"
  | "light-blue"
  | "blue"
  | "dark-blue"
  | "orange"
  | "pink"
  | "red";

export type IconProps = {
  color?: IconColor;
  className?: string;
};

export type IconType = ComponentType<IconProps>;