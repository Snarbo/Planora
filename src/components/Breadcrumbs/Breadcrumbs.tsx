"use client"

import { usePathname } from "next/navigation";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { getBreadcrumb } from "@/config/getBreadcrumb";

import {
  IconChevronRight
} from "../Icons";

export const Breadcrumbs = () => {
    const pathname = usePathname();
    const breadcrumb = getBreadcrumb(pathname);
    const theme = usePreferencesStore((state) => state.theme);

    if (!breadcrumb) return null;

    const Icon = breadcrumb.icon;
    
    return (
        <div className="breadcrumbs">
            <Icon className="breadcrumbs__icon" color={theme == "light" ? "primary" : "ivory"} />
            <p>{breadcrumb.groupTitle}</p>
            <IconChevronRight className="breadcrumbs__chevron" color={theme == "light" ? "primary" : "ivory"} />
            <p>{breadcrumb.pageTitle}</p>
        </div>
    )
}