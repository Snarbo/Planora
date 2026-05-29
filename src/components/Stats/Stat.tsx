import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import type { StatConfig } from "@/types/stats";

type StatProps = {
  config: StatConfig;
  value: number;
};

export const Stat = ({ config, value }: StatProps) => {
  const { isDesktop } = useBreakpoints();
  const valueRef = useRef<HTMLHeadingElement>(null);
  const animatedValue = useRef({ val: 0 });

  useEffect(() => {
    if (!valueRef.current) return;

    const el = valueRef.current;
    const suffixHTML = config.suffix
      ? `<span>${config.suffix}</span>`
      : "";

    gsap.to(animatedValue.current, {
      val: value,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        const display = Number.isInteger(value)
          ? Math.round(animatedValue.current.val)
          : animatedValue.current.val.toFixed(1);
        el.innerHTML = `${display}${suffixHTML}`;
      },
    });

    return () => {
      gsap.killTweensOf(animatedValue.current);
    };
  }, [value, config.suffix]);

  return (
    <div className="stat">
      <p className="stat__label">
        {isDesktop && config.expandedLabel
          ? config.expandedLabel
          : config.label}
      </p>
      <h1 className="stat__value" ref={valueRef}>
        {value}
        {config.suffix && <span>{config.suffix}</span>}
      </h1>
    </div>
  );
};