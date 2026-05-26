import { usePathname } from "next/navigation";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { Breadcrumbs } from "../Breadcrumbs/Breadcrumbs";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";

import {
  IconStars
} from "@/components/Icons";

type TopBarProps = {
  onAIGenerate?: () => void;
  isGenerating?: boolean;
};

export const TopBar = ({ onAIGenerate, isGenerating }: TopBarProps) => {
  const pathname = usePathname();
  const { isDesktop } = useBreakpoints();
  const AIMealGeneration = usePreferencesStore((state) => state.AIMealGeneration);

  return (
    <div className="top-bar">
      <Breadcrumbs />
      <ThemeToggle />
      {AIMealGeneration && isDesktop &&  pathname === "/plan" && (
        <button
          className="button button--icon button--primary"
          onClick={onAIGenerate}
          disabled={isGenerating}
        >
          <IconStars color="tertiary" />
          {isGenerating ? "Generating..." : "AI Generate"}
        </button>
      )}
    </div>
  );
};