"use client";

import "./toggle.scss";

type ToggleProps = {
  enabled: boolean;
  onToggle: () => void;
};

export const Toggle = ({ enabled, onToggle }: ToggleProps) => {
  return (
    <button
      type="button"
      className={`toggle ${enabled ? "toggle--active" : ""}`}
      onClick={onToggle}
      aria-pressed={enabled}
    >
      <span className="toggle__thumb" />
    </button>
  );
};