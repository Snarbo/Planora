import type { IconProps } from "@/types/icons";

export const IconNutrition = ({
  color = "primary",
  className = "",
}: IconProps) => {
  return (
    <svg className={`color-${color} ${className}`} width="100%" height="100%" viewBox="0 0 38 54" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: 1.5,
      }}>
        <g transform="matrix(2.370883,0,0,2.370883,-1354.550798,-1392.209629)">
            <g transform="matrix(1,0,0,1,-2065.72859,0)">
                <path d="M2645.009,593.968C2645.009,593.968 2644.196,592.654 2640.879,592.654C2637.562,592.654 2637.875,595.532 2637.875,595.532" fill="none"
                  stroke="currentColor"
                  strokeWidth="1.62"/>
            </g>
            <g transform="matrix(-1,-0,0,-1,3224.289996,1196.759071)">
                <path d="M2645.009,593.968C2645.009,593.968 2644.196,592.654 2640.879,592.654C2637.562,592.654 2637.875,595.532 2637.875,595.532" fill="none"
                  stroke="currentColor"
                  strokeWidth="1.62"/>
            </g>
            <g transform="matrix(1,0,0,1,-2065.72859,0)">
                <path d="M2645.009,588.023L2645.009,609.112" fill="none"
                  stroke="currentColor"
                  strokeWidth="1.62"/>
            </g>
        </g>
    </svg>
  );
};