import type { IconProps } from "@/types/icons";

export const IconSearch = ({
  color = "primary",
  className = "",
}: IconProps) => {
  return (
    <svg className={`color-${color} ${className}`} width="100%" height="100%" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: 1.5,
      }}>
      <g transform="matrix(0.425548,0,0,0.425548,-200.424721,-94.434164)">
        <g transform="matrix(0.7097,0,-0,0.7097,-1293.900209,99.841994)">
          <path
            d="M2658.724,343.927L2598.516,283.719"
            fill="none"
            stroke="currentColor"
            strokeWidth="12.74"
          />
        </g>

        <g transform="matrix(1.314484,0,0,1.314484,-2869.698161,-84.638261)">
          <circle
            cx="2578.118"
            cy="269.889"
            r="33.242"
            fill="none"
            stroke="currentColor"
            strokeWidth="6.88"
          />
        </g>
      </g>
  </svg>
  );
};