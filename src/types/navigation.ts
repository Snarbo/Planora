import type { IconType } from "@/types/icons";

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export type NavItem = {
  href: string;
  label: string;
  expandedLabel?: string;
  icon: IconType;
};