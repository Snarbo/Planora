import type { IconProps } from "@/types/icons";

export const IconStars = ({
  color = "primary",
  className = "",
}: IconProps) => {
  return (
    <svg className={`color-${color} ${className}`} width="100%" height="100%" viewBox="0 0 17 13" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: 2,
      }}>
      <g transform="matrix(0.050781,0,0,0.050781,-1.625,-1.625)">
          <path d="M295.4,37L310.2,73.8L347,88.6C350,89.8 352,92.8 352,96C352,99.2 350,102.2 347,103.4L310.2,118.2L295.4,155C294.2,158 291.2,160 288,160C284.8,160 281.8,158 280.6,155L265.8,118.2L229,103.4C226,102.2 224,99.2 224,96C224,92.8 226,89.8 229,88.6L265.8,73.8L280.6,37C281.8,34 284.8,32 288,32C291.2,32 294.2,34 295.4,37ZM142.7,105.7L164.2,155.8L214.3,177.3C220.2,179.8 224,185.6 224,192C224,198.4 220.2,204.2 214.3,206.7L164.2,228.2L142.7,278.3C140.2,284.2 134.4,288 128,288C121.6,288 115.8,284.2 113.3,278.3L91.8,228.2L41.7,206.7C35.8,204.2 32,198.4 32,192C32,185.6 35.8,179.8 41.7,177.3L91.8,155.8L113.3,105.7C115.8,99.8 121.6,96 128,96C134.4,96 140.2,99.8 142.7,105.7Z" fill="currentColor"/>
      </g>
  </svg>
  );
};