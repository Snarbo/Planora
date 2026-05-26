import type { IconProps } from "@/types/icons";

export const IconClose = ({
  color = "primary",
  className = "",
}: IconProps) => {
  return (
    <svg className={`color-${color} ${className}`} width="100%" height="100%" viewBox="0 0 6 6" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: 1.5,
      }}><g><path d="M0.562,0.562l4.15,4.15" stroke="currentColor" strokeWidth="1.13"/><path d="M0.562,4.712l4.15,-4.15" stroke="currentColor" strokeWidth="1.13"/></g></svg>
  );
};