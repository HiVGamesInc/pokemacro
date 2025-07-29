import React, { PropsWithChildren } from "react";

type ButtonProps = {
  className?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  active?: boolean;
  activeClass?: string;
  inactiveClass?: string;
  variant?: "default" | "primary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
};

const Button = ({
  active,
  onClick,
  className,
  children,
  activeClass,
  inactiveClass,
  variant = "default",
  size = "md",
  disabled = false,
  ...rest
}: PropsWithChildren<ButtonProps>) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const variantClasses = {
    default: "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600",
    primary: "bg-blue-600 border-blue-500 text-white hover:bg-blue-700",
    danger: "bg-red-600 border-red-500 text-white hover:bg-red-700",
    outline: "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700",
  };

  let statusClasses = "";
  if (disabled) {
    statusClasses =
      "bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed opacity-50";
  } else if (active === true) {
    statusClasses =
      activeClass ||
      (variant === "primary"
        ? "bg-blue-700 border-blue-600"
        : "bg-green-600 border-green-500 text-white");
  } else if (active === false) {
    statusClasses =
      inactiveClass || "bg-gray-600 border-gray-500 text-gray-400";
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-medium rounded border transition-colors duration-150
        ${sizeClasses[size]}
        ${statusClasses || variantClasses[variant]}
        ${className || ""}
      `
        .trim()
        .replace(/\s+/g, " ")}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
