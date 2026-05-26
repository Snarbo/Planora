"use client";

import { useEffect, useState } from "react";
import { breakpoints } from "@/config/breakpoints";

export const useBreakpoints = () => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobile = width < breakpoints.tablet;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;
  const isDesktop = width >= breakpoints.desktop;

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
  };
};