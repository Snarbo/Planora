import { useBreakpoints } from "@/hooks/useBreakpoints";
import type { StatConfig } from "@/types/stats";

type StatProps = {
  config: StatConfig;
  value: number;
};

export const Stat = ({ config, value }: StatProps) => {
  const { isDesktop } = useBreakpoints();

  return (
    <div className="stat">
      <p className="stat__label">{isDesktop && config.expandedLabel ? config.expandedLabel : config.label}</p>
      <h1 className="stat__value">{value}{config.suffix && <span>{config.suffix}</span>}
      </h1>
    </div>
  );
};