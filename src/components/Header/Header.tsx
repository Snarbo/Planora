"use client";

import { useState, useEffect, useRef  } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { NotificationBell } from "../Notifications/NotificationBell";
import { Notifications } from "@/components/Notifications/Notifications";
import { Navigation } from "../Navigation/Navigation";
import gsap from "gsap";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const profileName = usePreferencesStore((state) => state.profileName);
  const profilePhoto = usePreferencesStore((state) => state.profilePhoto);
  const pathname = usePathname();
  const { isTablet, isDesktop } = useBreakpoints();

  const handleCloseMenu = () => setIsMenuOpen(false);
  const handleToggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    if (!navRef.current) return;

    if (isMenuOpen) {
      gsap.to(navRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        pointerEvents: "auto",
      });
    } else {
      gsap.to(navRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        pointerEvents: "none",
      });
    }
  }, [isMenuOpen]);

  useEffect(() => {
    handleCloseMenu();
  }, [pathname]);

  if (isDesktop) {
    return <aside className="header">
      <div className="header__wrapper">
        <Link href="/plan" className="header__link" onClick={handleCloseMenu}>
          <Image
            src="/assets/master/logo.svg"
            alt="Planora"
            width={130}
            height={25}
            loading="eager"
            className="header__logo"
          />
        </Link>
      </div>
      <Navigation />   
    </aside>;
  }

  if (isTablet) {
    return <header className="header">
      <div className="header__wrapper">
        <Link href="/plan" className="header__link" onClick={handleCloseMenu}>
          <Image
            src="/assets/master/logo.svg"
            alt="Planora"
            width={107}
            height={20}
            loading="eager"
            className="header__logo"
          />
        </Link>
        <Navigation />
        <NotificationBell />
        <Notifications />
        <div className="header__account">
          <Image
            src={profilePhoto}
            alt={profileName}
            width={25}
            height={25}
            loading="eager"
            className="header__profile-photo"
          />
        </div>
      </div>
    </header>;
  }

  return <>
    <header className="header">
      <div className="header__wrapper">
        <Link href="/plan" className="header__link" onClick={handleCloseMenu}>
          <Image
            src="/assets/master/logo.svg"
            alt="Planora"
            width={107}
            height={20}
            loading="eager"
            className="header__logo"
          />
        </Link>
        <NotificationBell />
        <Notifications />
        <button onClick={handleToggleMenu} className={`header__hamburger hamburger hamburger--collapse ${isMenuOpen ? "is-active" : ""}`} type="button">
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
      </div>
      <div ref={navRef} className="header__navigation">
        <Navigation onNavigate={handleCloseMenu} />
      </div>
    </header>
    
  </>;
};