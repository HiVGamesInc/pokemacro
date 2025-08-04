import React, { CSSProperties, useContext } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Card from "../Card/Card";
import {
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import colors from "tailwindcss/colors";
import * as KeybindingsContext from "../../contexts/KeybindingsContext";
import { ComboMove } from "../../types/types";
import Input from "../Input/Input";
import Select from "../Select/Select";
import Button from "../Button/Button";
import { KeyboardKeys } from "../../utils/keys";
import { actions } from "../../pages/AutoCombo.data";

type SortableItemProps = {
  id: string;
  item: ComboMove;
  isEditing: boolean;
  editedItem: ComboMove;
  onRemove: () => void;
  onEdit: () => void;
  onSaveEdit: (updatedItem: ComboMove) => void;
  onCancelEdit: () => void;
  onEditFieldChange: (field: string, value: any) => void;
  style?: CSSProperties;
};

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  item,
  isEditing,
  editedItem,
  onRemove,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onEditFieldChange,
  style,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const { keybindings } = useContext(KeybindingsContext.Context);
  const key = item.skillName ? keybindings[item.skillName] : undefined;

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

  const displayName = item.delay ? "Delay" : item.skillName || "Unknown";

  // Check if item is editable (only move, delay, hotkey, and mouse click items)
  const isItemEditable = !!(
    (
      item.delay || // delay items
      item.mouseClick || // mouse click items
      (item.hotkey && !item.skillName) || // hotkey items
      (item.skillName &&
        !item.autoCatch &&
        !["Pokestop", "Medicine", "Revive", "Auto Loot", "Auto Catch"].includes(
          item.skillName
        ))
    ) // move items (exclude system actions)
  );

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={{ ...defaultStyle, backgroundColor: "transparent" }}
      >
        <Card as="div" active={false} className="bg-slate-800 w-full mb-0">
          <div className="mb-2">
            <div className="text-sm text-gray-400">Editing item</div>
          </div>
          <div className="flex gap-2 items-center">
            {/* Edit form based on item type */}
            {item.delay ? (
              <Input
                name="delay"
                wrapperClassName="flex-1 !mt-0"
                value={editedItem.delay || ""}
                placeholder="Delay in milliseconds"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onEditFieldChange("delay", e.target.value)
                }
              />
            ) : item.mouseClick ? (
              <>
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex gap-2">
                    <Select
                      wrapperClassName="flex-1 !mt-0"
                      className="bg-black text-slate-50 border border-slate-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
                      value={editedItem.mouseClick?.button || "left"}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        onEditFieldChange("mouseClick", {
                          ...editedItem.mouseClick,
                          button: e.target.value as "left" | "right",
                        })
                      }
                      options={[
                        { value: "left", label: "Left Click" },
                        { value: "right", label: "Right Click" },
                      ]}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      name="mouseX"
                      wrapperClassName="flex-1 !mt-0"
                      value={editedItem.mouseClick?.x?.toString() || ""}
                      placeholder="X coordinate"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onEditFieldChange("mouseClick", {
                          ...editedItem.mouseClick,
                          x: Number(e.target.value),
                        })
                      }
                    />
                    <Input
                      name="mouseY"
                      wrapperClassName="flex-1 !mt-0"
                      value={editedItem.mouseClick?.y?.toString() || ""}
                      placeholder="Y coordinate"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onEditFieldChange("mouseClick", {
                          ...editedItem.mouseClick,
                          y: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </>
            ) : item.hotkey ? (
              <Select
                wrapperClassName="flex-1 !mt-0"
                className="bg-black text-slate-50 border border-slate-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
                value={editedItem.hotkey?.keyName || ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selectedKey = Object.values(KeyboardKeys).find(
                    (k) => k.keyName === e.target.value
                  );
                  if (selectedKey) {
                    onEditFieldChange("hotkey", selectedKey);
                    onEditFieldChange("skillName", selectedKey.keyName);
                  }
                }}
                options={Object.values(KeyboardKeys).map((key) => ({
                  value: key.keyName,
                  label: key.keyName,
                }))}
              />
            ) : (
              <Select
                wrapperClassName="flex-1 !mt-0"
                className="bg-black text-slate-50 border border-slate-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
                value={editedItem.skillName || ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onEditFieldChange("skillName", e.target.value)
                }
                options={actions.map((action) => ({
                  value: action.label,
                  label: action.label,
                }))}
              />
            )}

            {/* Action buttons - matching the add form style */}
            <Button
              className="bg-blue-00 p-4 rounded-lg text-green-400 h-[42px] hover:bg-green-900 hover:text-white"
              onClick={() => onSaveEdit(editedItem)}
            >
              <CheckIcon className="size-4" />
            </Button>
            <Button
              className="bg-blue-900 p-4 rounded-lg text-red-400 h-[42px] hover:bg-red-900 hover:text-white"
              onClick={onCancelEdit}
            >
              <XMarkIcon className="size-4" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={defaultStyle} {...attributes} {...listeners}>
      <Card
        as="div"
        className="m-0 bg-transparent text-left"
        {...(item.delay && {
          style: { padding: "2px!important" },
        })}
      >
        <div className="flex justify-between items-center">
          <div>
            {!item.delay && (
              <div className="text-md font-medium">{displayName}</div>
            )}
            {!item.autoCatch && key?.keyName && (
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
            {item.mouseClick && (
              <div className="text-sm text-slate-300">
                <span className="font-medium">
                  {item.mouseClick.button === "left" ? "Left" : "Right"} Click:
                </span>{" "}
                ({item.mouseClick.x}, {item.mouseClick.y})
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {isItemEditable && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <PencilIcon className="w-4 h-4 text-blue-500 hover:text-blue-300" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove();
              }}
            >
              <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-300" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SortableItem;
