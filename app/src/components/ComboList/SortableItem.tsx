import React, { CSSProperties, useContext } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Card from "../Card/Card";
import { TrashIcon } from "@heroicons/react/24/outline";
import colors from "tailwindcss/colors";
import * as KeybindingsContext from "../../contexts/KeybindingsContext";

type SortableItemProps = {
  id: string;
  item: any; // adjust the type according to your Combo.moveList type
  onRemove: () => void;
  style?: CSSProperties;
};

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  item,
  onRemove,
  style,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const { keybindings } = useContext(KeybindingsContext.Context);
  const key = keybindings[item.skillName];

  const defaultStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    overflow: "hidden",
    borderWidth: 2,
    borderRadius: "1rem",
    borderColor: transform ? colors.gray[600] : colors.gray[700],
    backgroundColor: colors.slate[800],
    ...style,
  };

  const displayName = item.delay ? "Delay" : item.skillName || item.id;

  return (
    <div ref={setNodeRef} style={defaultStyle} {...attributes} {...listeners}>
      <Card
        as="div"
        className="m-0 bg-transparent"
        {...(item.delay && {
          style: { padding: "2px!important" },
        })}
      >
        <div className="flex justify-between items-center">
          <div>
            {!item.delay && (
              <div className="text-md font-medium">{displayName}</div>
            )}
            {key?.keyName && (
              <div className="flex gap-4">
                <div className="text-sm text-slate-300">
                  <span className="font-medium">Hotkey:</span> {key.keyName}
                </div>
              </div>
            )}
            {item.delay && (
              <div className="flex gap-4">
                <div className="text-xs text-slate-300">
                  {item.delay + " milliseconds"}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
          >
            <TrashIcon className="w-5 h-5 text-red-500 hover:text-blue-100" />
          </button>
        </div>
      </Card>
    </div>
  );
};

export default SortableItem;
