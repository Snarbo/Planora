import type { IconProps } from "@/types/icons";

export const IconLogout = ({
  color = "primary",
  className = "",
}: IconProps) => {
  return (
    <svg className={`color-${color} ${className}`} width="100%" height="100%" viewBox="0 0 15 15" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: 1,
      }}>
      <g transform="matrix(1,0,0,1,-402.474201,-1004.283255)">
          <g transform="matrix(0.892186,0,0,0.892186,-1798.14411,109.052759)">
              <path d="M2481.91,1011.49L2472.672,1011.49" stroke="currentColor" strokeWidth="1.12"/>
          </g>
          <g transform="matrix(0.776793,0,0,0.776793,-1511.749908,225.771329)">
              <path d="M2477.684,1006.949L2481.91,1011.49" stroke="currentColor" strokeWidth="1.29"/>
          </g>
          <g transform="matrix(0.776793,0,0,-0.776793,-1511.749908,1797.209394)">
              <path d="M2477.684,1006.949L2481.91,1011.49" stroke="currentColor" strokeWidth="1.29"/>
          </g>
          <g transform="matrix(1,0,0,1,-2065.72859,0)">
              <path d="M2474.192,1004.99L2468.91,1004.99L2468.91,1017.99L2474.192,1017.99" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="square" strokeLinejoin="round"/>
          </g>
      </g>
  </svg>
  );
};