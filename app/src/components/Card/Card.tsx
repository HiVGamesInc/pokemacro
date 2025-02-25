import { PropsWithChildren } from "react";
import Button from "../Button/Button";

type CardProps = {
  as?: React.ElementType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  active?: boolean;
};

const Card = ({
  as,
  active,
  onClick,
  onDoubleClick,
  className,
  children,
  ...rest
}: PropsWithChildren<CardProps>) => {
  const Comp = as || (Button as any);

  return (
    <Comp
      className={`py-4 px-4 bg-slate-800 rounded-xl grow text-left ${className} border-1`}
      active={active}
      {...(Comp === Button && {
        onClick: active && onDoubleClick ? onDoubleClick : onClick,
      })}
      inactiveClass="border-slate-100"
      {...rest}
    >
      {children}
    </Comp>
  );
};

export default Card;
