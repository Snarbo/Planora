import { navGroups } from "./navigation";

const dynamicRoutes: {
  pattern: RegExp;
  groupTitle: string;
  parentPage: string;
  pageTitle: (match: RegExpMatchArray) => string;
  iconHref: string;
}[] = [
  {
    pattern: /^\/meals\/(.+)$/,
    iconHref: "/meals",
    groupTitle: "Discover",
    parentPage: "Meals",
    pageTitle: (match) => slugToTitle(match[1]),
  },
];

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getBreadcrumb(pathname: string) {
  // 1. Exact match
  for (const group of navGroups) {
    for (const item of group.items) {
      if (item.href === pathname) {
        return {
          icon: item.icon,
          groupTitle: group.title,
          parentPage: null,
          pageTitle: item.expandedLabel,
        };
      }
    }
  }

  // 2. Dynamic pattern match
  for (const route of dynamicRoutes) {
    const match = pathname.match(route.pattern);
    if (match) {
      const parentItem = navGroups
        .flatMap((g) => g.items)
        .find((item) => item.href === route.iconHref);

      if (!parentItem) continue;

      return {
        icon: parentItem.icon,
        groupTitle: route.groupTitle,
        parentPage: route.parentPage,
        pageTitle: route.pageTitle(match),
      };
    }
  }

  return null;
}