import { PropsWithChildren } from "react";
import Card from "../Card/Card";

type AddItemButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const AddItemButton = ({
  onClick,
  children,
}: PropsWithChildren<AddItemButtonProps>) => {
  return (
    <Card
      className="mb-4 bg-transparent border-1 w-full hover:border-slate-500 transition-all"
      onClick={onClick}
    >
      {children}
    </Card>
  );
};

export default AddItemButton;
