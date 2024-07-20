import React, { PropsWithChildren } from "react";

type ButtonProps = {
  className?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  active: boolean;
  activeClass?: string;
  inactiveClass?: string;
};

const Button = ({
  active,
  onClick,
  className,
  children,
  activeClass = "outline-green-400",
  inactiveClass = "outline-red-300",
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      type="button"
      className={`mt-4 text-white bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 outline ${
        active ? activeClass : inactiveClass
      } ${className || ""} `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
