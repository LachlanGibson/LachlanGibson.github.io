import React, { useState } from "react";

type NumberInputProps = {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  inputClassName?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** Integer input: commits in-range values while typing, clamps on blur/Enter, arrow keys step by 1. */
const NumberInput: React.FC<NumberInputProps> = ({
  min,
  max,
  value,
  onChange,
  className = "",
  inputClassName = "",
}) => {
  // Text being edited; null when showing the committed value
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    if (draft !== null && draft !== "") {
      const next = clamp(Number(draft), min, max);
      if (next !== value) onChange(next);
    }
    setDraft(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.replace(/\D/g, "");
    setDraft(text);
    if (text !== "") {
      const next = Number(text);
      if (next >= min && next <= max && next !== value) onChange(next);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commit();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = clamp(value + (e.key === "ArrowUp" ? 1 : -1), min, max);
      setDraft(null);
      if (next !== value) onChange(next);
    }
  };

  return (
    <span className={`inline-flex ${className}`}>
      <input
        type="text"
        inputMode="numeric"
        role="spinbutton"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        value={draft ?? String(value)}
        onChange={handleChange}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className={`rounded-md border border-(--ui-input-border) bg-(--ui-input-bg) p-3 text-[1rem] text-(--ui-text) transition-[border-color,box-shadow] duration-200 outline-none enabled:hover:border-(--ui-primary) focus:border-(--ui-primary) focus:shadow-(--ui-focus-ring) ${inputClassName}`}
      />
    </span>
  );
};

export default NumberInput;
