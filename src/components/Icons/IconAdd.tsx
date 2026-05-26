import type { IconProps } from "@/types/icons";

export const IconAdd = ({
  color = "primary",
  className = "",
}: IconProps) => {
  return (
    <svg className={`color-${color} ${className}`} width="100%" height="100%" viewBox="0 0 7 7" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: 1.5,
      }}>
        <g>
          <path d="M3.497,0.563l0,5.868" stroke="currentColor" strokeWidth="1.12"/>
          <path d="M0.562,3.497l5.868,0" stroke="currentColor" strokeWidth="1.12"/>
        </g>
    </svg>
  );
};