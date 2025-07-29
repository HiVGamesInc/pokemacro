import { PropsWithChildren } from "react";

type CardProps = {
  as?: React.ElementType;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
  active?: boolean;
};

const Card = ({
  as = "div",
  active,
  onClick,
  onDoubleClick,
  className,
  children,
  ...rest
}: PropsWithChildren<CardProps>) => {
  const Component = as;

  return (
    <Component
      className={`
        p-4 rounded-lg border transition-colors duration-150
        ${
          active
            ? "bg-gray-900 hover:bg-gray-900 border-blue-500"
            : "bg-gray-800 border-gray-700 hover:border-gray-600"
        }
        ${onClick ? "cursor-pointer" : ""}
        ${className || ""}
      `
        .trim()
        .replace(/\s+/g, " ")}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Card;
