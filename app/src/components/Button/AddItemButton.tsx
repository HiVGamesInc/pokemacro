import { PropsWithChildren } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

type AddItemButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const AddItemButton = ({
  onClick,
  children,
}: PropsWithChildren<AddItemButtonProps>) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
    >
      <PlusIcon className="w-4 h-4" />
      {children || "Add Combo"}
    </button>
  );
};

export default AddItemButton;
