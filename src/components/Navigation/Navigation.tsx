"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { navGroups } from "@/config/navigation";

import {
  IconLogout
} from "@/components/Icons";

type NavigationProps = {
  onNavigate?: () => void;
}

export const Navigation = ({ onNavigate }: NavigationProps) => {
  const profileName = usePreferencesStore((state) => state.profileName);
  const profilePhoto = usePreferencesStore((state) => state.profilePhoto);
  const pathname = usePathname();
  const { isTablet } = useBreakpoints();

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {};

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
      {!isTablet && 
        <div className="navigation__account">
          <div className="navigation__account-wrapper">
            <div className="navigation__user">
              <div className="navigation__user-profile-photo-wrapper">
                <Image
                  src={profilePhoto}
                  alt={profileName}
                  width={25}
                  height={25}
                  loading="eager"
                  className="navigation__user-profile-photo"
                />
              </div>
              <p className="navigation__user-profile-name">{profileName}</p>
            </div>
            <Link className="navigation__logout" href="#" onClick={handleLogout}>
                <IconLogout color="ivory" />
            </Link>
          </div>
        </div>
      }
    </nav>
  );
};