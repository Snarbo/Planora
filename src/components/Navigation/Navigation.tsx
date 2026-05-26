"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { navGroups } from "@/config/navigation";

type NavigationProps = {
  onNavigate?: () => void;
}

export const Navigation = ({ onNavigate }: NavigationProps) => {
  const pathname = usePathname();
  const { isTablet } = useBreakpoints();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="navigation">
      {navGroups.map((group) => (
        <div key={group.title} className="navigation__group">

          {!isTablet && (
            <h6 className="navigation__group-title">
              {group.title}
            </h6>
          )}

          <ul>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`navigation__link ${active ? "active" : ""}`}
                  >
                    {!isTablet && Icon && (
                      <Icon color={active ? "tertiary" : "ivory"} />
                    )}

                    {isTablet
                      ? item.label
                      : (item.expandedLabel ?? item.label)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};