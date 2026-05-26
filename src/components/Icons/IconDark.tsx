import type { IconProps } from "@/types/icons";

export const IconDark = ({
  color = "primary",
  className = "",
}: IconProps) => {
  return (
    <svg className={`color-${color} ${className}`} width="100%" height="100%" viewBox="0 0 9 10" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinejoin: "round",
        strokeMiterlimit: 2,
      }}><path d="M4.875,0c-2.693,0 -4.875,2.182 -4.875,4.875c0,2.693 2.182,4.875 4.875,4.875c1.31,0 2.5,-0.518 3.376,-1.36c0.139,-0.133 0.179,-0.341 0.101,-0.516c-0.078,-0.175 -0.261,-0.284 -0.453,-0.269c-0.093,0.008 -0.187,0.011 -0.282,0.011c-1.935,0 -3.504,-1.569 -3.504,-3.504c0,-1.373 0.79,-2.563 1.944,-3.138c0.173,-0.086 0.272,-0.272 0.249,-0.465c-0.023,-0.192 -0.164,-0.348 -0.352,-0.39c-0.348,-0.078 -0.71,-0.12 -1.08,-0.12Z" fill="currentColor"/></svg>
  );
};