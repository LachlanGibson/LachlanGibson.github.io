import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
  /** PrimeIcons class, e.g. "pi pi-refresh" */
  icon?: string;
  severity?: "primary" | "secondary";
  outlined?: boolean;
  text?: boolean;
  size?: "small";
};

const solidClasses = {
  primary:
    "border-(--ui-primary) bg-(--ui-primary) text-(--ui-primary-text) enabled:hover:border-(--ui-primary-hover) enabled:hover:bg-(--ui-primary-hover) enabled:active:border-(--ui-primary-active) enabled:active:bg-(--ui-primary-active)",
  secondary:
    "border-(--ui-secondary) bg-(--ui-secondary) text-(--ui-secondary-text) enabled:hover:border-(--ui-secondary-hover) enabled:hover:bg-(--ui-secondary-hover) enabled:active:border-(--ui-secondary-active) enabled:active:bg-(--ui-secondary-active)",
};

const outlinedClasses =
  "border-(--site-border) bg-transparent text-(--site-text) enabled:hover:bg-(--site-surface-alt)";

const textClasses =
  "border-transparent bg-transparent text-(--ui-primary) enabled:hover:bg-(--ui-primary-tint-hover) enabled:active:bg-(--ui-primary-tint-active)";

const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  severity = "primary",
  outlined = false,
  text = false,
  size,
  className = "",
  children,
  type = "button",
  ...rest
}) => {
  const iconOnly = icon && !label && !children;
  const variantClasses = text ? textClasses : outlined ? outlinedClasses : solidClasses[severity];
  const sizeClasses = iconOnly
    ? "px-0 py-3"
    : size === "small"
      ? "px-[1.09375rem] py-[0.65625rem] text-[0.875rem]"
      : "px-5 py-3 text-[1rem]";

  return (
    <button
      type={type}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border transition-[background-color,color,border-color,box-shadow] duration-200 select-none focus-visible:shadow-(--ui-button-focus-ring) focus-visible:outline-none disabled:cursor-default disabled:opacity-40 ${variantClasses} ${sizeClasses} ${className}`}
      {...rest}
    >
      {icon && <span className={icon} aria-hidden="true" />}
      {label && <span className="font-bold">{label}</span>}
      {children}
    </button>
  );
};

export default Button;
