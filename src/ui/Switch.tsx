import React from "react";

type SwitchProps = {
  inputId?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

const Switch: React.FC<SwitchProps> = ({ inputId, checked, onChange, className = "" }) => {
  return (
    <span className={`relative inline-block h-7 w-12 shrink-0 ${className}`}>
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer appearance-none rounded-full opacity-0"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full border border-transparent bg-(--ui-switch-off) transition-[background-color,box-shadow] duration-200 peer-hover:bg-(--ui-switch-off-hover) peer-checked:bg-(--ui-primary) peer-checked:peer-hover:bg-(--ui-primary-hover) peer-focus-visible:shadow-(--ui-focus-ring) before:absolute before:top-1/2 before:left-1 before:-mt-2.5 before:size-5 before:rounded-full before:bg-(--ui-switch-knob) before:transition-transform before:duration-200 before:content-[''] peer-checked:before:translate-x-5 peer-checked:before:bg-(--ui-primary-text)"
      />
    </span>
  );
};

export default Switch;
