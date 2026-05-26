import type { IconProps } from "@/types/icons";

export const IconChevronRight = ({
  color = "primary",
  className = "",
}: IconProps) => {
  return (
    <svg className={`color-${color} ${className}`} width="100%" height="100%" viewBox="0 0 6 9" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: 1.5,
      }}>
      <g transform="matrix(0.325214,0,0,0.61318,-813.126132,-41.356386)">
          <path d="M2501.819,68.261L2514.819,74.761L2501.819,81.261" fill="none" stroke="currentColor"
                  strokeWidth="2.04"/>
      </g>
  </svg>
  );
};