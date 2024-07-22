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
      active={false}
      className="mb-4 bg-transparent outline-dashed w-full hover:outline-slate-500 transition-all"
      onClick={onClick}
    >
      {children}
    </Card>
  );
};

export default AddItemButton;
