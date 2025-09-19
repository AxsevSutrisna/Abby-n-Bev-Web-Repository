"use client";
import clsx from "clsx";
import { Children, useState } from "react";
import * as FaIcons from "react-icons/fa";
export function BtnIcon({
  children,
  iconName,
  variant = "primary",
  size = "medium",
  className,
  disabled = false,
  ...props
}) {
  const baseStyles =
    "rounded-[24px] font-bold transition-colors-primary-700 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary-700 text-white hover:bg-primary-600 focus:bg-primary-800 transition-all duration-200",
    secondary:
      "bg-secondary-100 text-primary-700 hover:bg-secondary-200 focus:bg-Secondary300 transition-all duraton-200",
    tertiary:
      "bg-transparent border border-transparent font-bold text-primary-700 hover:bg-secondary-100 transition-all duration-200",
  };

  const sizes = {
    sm: "px-2 py-2 text-sm",
    md: "px-3 py-3 text-base",
    lg: "px-4 py-4 text-lg",
  };
  const iconColors = {
    primary: "text-white",
    secondary: "text-primary-700",
    tertiary: "text-primary-700",
  };
  // const [hover, setHover] = useState(false);

  const CurrentIcon = FaIcons[`FaReg${iconName}`] || FaIcons[`Fa${iconName}`];
  // const HoverIcon = FaIcons[`FaReg${iconName}`] || FaIcons[`Fa${iconName}`];
  // const CurrentIcon = hover ? IdleIcon : HoverIcon;

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      // onMouseEnter={() => setHover(true)}
      // onMouseLeave={() => setHover(false)}
      {...props}
    >
      {<CurrentIcon className={clsx(iconColors[variant])} />}
      {children}
    </button>
  );
}
