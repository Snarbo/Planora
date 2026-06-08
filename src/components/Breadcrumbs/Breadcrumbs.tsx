"use client"

import { usePathname } from "next/navigation";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { getBreadcrumb } from "@/config/getBreadcrumb";

import {
  IconChevronRight
} from "../Icons";

export const Breadcrumbs = () => {
    const pathname = usePathname();
    const breadcrumb = getBreadcrumb(pathname);
    const theme = usePreferencesStore((state) => state.theme);
    const { isMobile } = useBreakpoints();

    if (!breadcrumb) return null;

    const isMealDetailMobile = isMobile && pathname.startsWith("/meals/");
    const Icon = breadcrumb.icon;
    
    return (
        <div className="breadcrumbs">
            <Icon className="breadcrumbs__icon" color={theme == "light" ? "primary" : "ivory"} />
            <p>{breadcrumb.groupTitle}</p>
            <IconChevronRight className="breadcrumbs__chevron" color={theme == "light" ? "primary" : "ivory"} />

            {breadcrumb.parentPage && (
                <>
                    <p>{breadcrumb.parentPage}</p>
                    {!isMealDetailMobile && <IconChevronRight className="breadcrumbs__chevron" color={theme == "light" ? "primary" : "ivory"} />}  
                </>
            )}

            {!isMealDetailMobile && <p>{breadcrumb.pageTitle}</p>}
            
        </div>
    );
}