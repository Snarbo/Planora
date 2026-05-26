"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef  } from "react";
import gsap from "gsap";

import { useBreakpoints } from "@/hooks/useBreakpoints";
import {Navigation} from "../Navigation/Navigation";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isTablet, isDesktop } = useBreakpoints();

  const handleCloseMenu = () => setIsMenuOpen(false);
  const handleToggleMenu = () => setIsMenuOpen((prev) => !prev);

  const userImage = "/assets/master/user.webp" as string;

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
        <div className="header__account">
          <img src={userImage} alt="User" loading="eager"/>
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
        <div className="header__account">
          <img src={userImage} alt="User" />
        </div>
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