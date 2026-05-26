"use client";

import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import {
  IconLight,
  IconDark
} from "../Icons";

export const ThemeToggle = () => {
    const { theme, toggleTheme } = usePreferencesStore();
    const { isTablet, isDesktop } = useBreakpoints();

    if (isTablet || isDesktop) {
        return (
            <button className={`theme-switcher theme-switcher--tablet-desktop theme-switcher--${theme}`} onClick={toggleTheme}>
                <span className="theme-switcher__circle" />
                <div className="theme-switcher__icon-wrapper">
                    <IconLight color={theme === "light" ? "primary" : "grey"} />
                </div>
                <div className="theme-switcher__icon-wrapper">
                    <IconDark color={theme === "dark" ? "primary" : "grey"} />
                </div>
            </button>   
        )
    }

    return (
        <button className="theme-switcher theme-switcher--mobile" onClick={toggleTheme}>
            {theme === "light" ? <IconLight color="ivory" /> : <IconDark />}
        </button>
    )
}