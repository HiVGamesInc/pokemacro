import React, { PropsWithChildren } from "react";

type ButtonProps = {
  className?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  active?: boolean;
  activeClass?: string;
  inactiveClass?: string;
};

const Button = ({
  active,
  onClick,
  className,
  children,
  activeClass = "border-green-400",
  inactiveClass = "border-red-300",
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      type="button"
      className={`text-white bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 border-2 hover:bg-gray-800 duration-100 ${
        active === true
          ? activeClass
          : active === false
          ? inactiveClass
          : "border-slate-700"
      } ${className || ""} `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
