import type { IconProps } from "@/types/icons";

export const IconShoppingList = ({
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
      <g transform="matrix(3.846154,0,0,3.846154,-2161.00267,-1454.439708)">
          <g transform="matrix(1,0,0,1,-2065.72859,0)">
              <path d="M2628.089,378.654L2641.089,378.654" fill="none"
              stroke="currentColor"
              strokeWidth="1"/>
          </g>
          <g transform="matrix(0.5,0,0,0.5,-751.683948,195.827162)">
              <path d="M2628.089,378.654L2641.089,378.654" fill="none"
              stroke="currentColor"
              strokeWidth="2"/>
          </g>
          <g transform="matrix(0.758691,0,0,0.758691,-1431.546246,104.209149)">
              <path d="M2628.089,378.654L2641.981,378.654" fill="none"
              stroke="currentColor"
              strokeWidth="1.32"/>
          </g>
      </g>
    </svg>
  );
};