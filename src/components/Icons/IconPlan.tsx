import type { IconProps } from "@/types/icons";

export const IconPlan = ({
  color = "primary",
  className = "",
}: IconProps) => {
  return (
    <svg
      className={`color-${color} ${className}`}
      width="100%"
      height="100%"
      viewBox="0 0 54 54"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: 1.5,
      }}
    >
      <g transform="matrix(3.144175,0,0,3.144175,-1288.190548,-821.62994)">
        <g transform="matrix(1.232648,0,0,1.232648,-2634.502861,-62.064485)">
          <rect
            x="2470.146"
            y="262.844"
            width="5.273"
            height="5.273"
            fill="none"
            strokeWidth="0.99"
            stroke="currentColor"
          />
        </g>
        <g transform="matrix(1.232648,0,0,1.232648,-2625.100438,-62.064485)">
          <rect
            x="2470.146"
            y="262.844"
            width="5.273"
            height="5.273"
            fill="none"
            strokeWidth="0.99"
            stroke="currentColor"
          />
        </g>
        <g transform="matrix(1.232648,0,0,1.232648,-2625.100438,-52.662062)">
          <rect
            x="2470.146"
            y="262.844"
            width="5.273"
            height="5.273"
            fill="none"
            strokeWidth="0.99"
            stroke="currentColor"
          />
        </g>
        <g transform="matrix(1.232648,0,0,1.232648,-2634.502861,-52.662062)">
          <rect
            x="2470.146"
            y="262.844"
            width="5.273"
            height="5.273"
            fill="none"
            strokeWidth="0.99"
            stroke="currentColor"
          />
        </g>
      </g>
    </svg>
  );
};