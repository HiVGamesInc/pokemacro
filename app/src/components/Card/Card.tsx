import { PropsWithChildren } from "react";
import Button from "../Button/Button";

type CardProps = {
  as?: React.ElementType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  active: boolean;
};

const Card = ({
  as,
  active,
  onClick,
  onDoubleClick,
  className,
  children,
}: PropsWithChildren<CardProps>) => {
  const Comp = as || (Button as any);

  return (
    <Comp
      className={`py-4 px-4 bg-slate-800 rounded-xl basis-96 grow text-left ${className}`}
      active={active}
      {...(Comp === Button && {
        onClick: active && onDoubleClick ? onDoubleClick : onClick,
      })}
      inactiveClass="outline-slate-700"
    >
      {children}
    </Comp>
  );
};

export default Card;
