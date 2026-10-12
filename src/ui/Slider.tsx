import React from "react";

type SliderProps = {
  id?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
};

const Slider: React.FC<SliderProps> = ({ id, min, max, step, value, onChange, className = "" }) => {
  const fill = ((value - min) / (max - min)) * 100;

  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`ui-slider ${className}`}
      style={{ "--fill": `${fill}%` } as React.CSSProperties}
    />
  );
};

export default Slider;
