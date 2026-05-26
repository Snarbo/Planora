import { navGroups } from "./navigation";

export function getBreadcrumb(pathname: string) {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (item.href === pathname) {
        return {
          icon: item.icon,
          groupTitle: group.title,
          pageTitle: item.expandedLabel
        };
      }
    }
  }

  return null;
}