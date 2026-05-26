import type { IconProps } from "@/types/icons";

export const IconAI = ({
  color = "primary",
  className = "",
}: IconProps) => {
  return (
    <svg className={`color-${color} ${className}`} width="100%" height="100%" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: 1,
      }}>
    <g transform="matrix(4.464278,0,0,10.790813,-51836.254946,-6727.702713)">
        <g transform="matrix(1.000328,0,0,0.413847,-5.295368,306.676476)">
            <circle cx="11618.854" cy="771.504" r="5.598" fill="none"
            stroke="currentColor"
            strokeWidth="0.86"/>
        </g>
        <g transform="matrix(0.349345,0,0,0.144528,7558.378024,514.456884)">
            <circle cx="11618.854" cy="771.504" r="5.598" fill="currentColor"/>
        </g>
    </g>
</svg>
  );
};