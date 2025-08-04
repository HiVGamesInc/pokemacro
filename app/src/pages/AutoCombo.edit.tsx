import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Combo, ComboMove, HotkeyObject } from "../types/types";
import { useContext, useState, useEffect } from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import Select from "../components/Select/Select";
import { actions } from "./AutoCombo.data";
import * as AutoComboContext from "../contexts/AutoComboContext";
import * as KeybindingsContext from "../contexts/KeybindingsContext";
import { TYPE_LABELS, Types } from "../components/ActionsList/ActionsList";
import SortableItem from "../components/ComboList/SortableItem";
import KeybindingPicker from "../components/KeybindingPicker";
import { toggleMouseTracking, getMouseCoordinates } from "../utils/actions";
import { KeyboardKeys } from "../utils/keys";
import colors from "tailwindcss/colors";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensor,
  MouseSensor,
  KeyboardSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

const defaultNewCombo: Combo = {
  name: "New Combo",
  triggerKey: [
    {
      keyName: "End",
      keyNumber: 64,
    },
  ],
  moveList: [],
};

const defaultNewMove: ComboMove = {
  skillName: "Move 1",
  delay: "350",
  hotkey: undefined, // Add this to ensure hotkey is properly reset
};

// Utility function to clean any temporary ID fields from move items
const cleanMoveList = (moveList: any[]): ComboMove[] => {
  return moveList.map((move) => {
    const { id, ...cleanMove } = move;
    return cleanMove;
  });
};

const AutoComboEdit = ({
  data,
  updateCombo,
}: {
  data: Combo;
  updateCombo: (combo: Combo | {}) => void;
}) => {
  const [combo, setCombo] = useState(
    data || { name: "", triggerKey: [], moveList: [] }
  );
  const [isAdding, setIsAdding] = useState<Types | null>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<ComboMove>(defaultNewMove);
  const [newMove, setNewMove] = useState<ComboMove>(defaultNewMove);
  const [isTracking, setIsTracking] = useState(false);
  const [mouseButton, setMouseButton] = useState<"left" | "right">("left");
  const [mouseCoordinates, setMouseCoordinates] = useState({ x: 0, y: 0 });

  const { setCurrentCombo } = useContext(AutoComboContext.Context);
  const { keybindings } = useContext(KeybindingsContext.Context);

  // Create items with unique IDs for drag and drop
  const items = combo.moveList.map((item, index) => ({
    ...item,
    id: `item-${index}`,
  }));

  // Drag and drop sensors
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, keyboardSensor);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id && over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);

      // Update the combo with reordered items (without the id field)
      const reorderedMoveList = cleanMoveList(newItems);
      setCombo({
        ...combo,
        moveList: reorderedMoveList,
      });
    }
  };

  // Poll for coordinates when tracking is active
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(async () => {
      try {
        const coords = await getMouseCoordinates();

        // Check if we have new coordinates
        if (
          coords &&
          (coords.x !== 0 || coords.y !== 0) &&
          (coords.x !== mouseCoordinates.x || coords.y !== mouseCoordinates.y)
        ) {
          // Update coordinates in state
          setMouseCoordinates(coords);

          // Stop tracking immediately once we get coordinates
          setIsTracking(false);

          // Log for debugging
          console.log("Captured coordinates:", coords);
        }
      } catch (error) {
        console.error("Error getting mouse coordinates:", error);
      }
    }, 200); // Poll more frequently (200ms)

    return () => clearInterval(interval);
  }, [isTracking, mouseCoordinates.x, mouseCoordinates.y]);

  const handleStartTracking = async () => {
    try {
      const result = await toggleMouseTracking();
      setIsTracking(result.tracking_enabled);
    } catch (error) {
      console.error("Error toggling mouse tracking:", error);
    }
  };

  const removeSkill = (index: number) => {
    setCombo({
      ...combo,
      moveList: combo.moveList.filter((_, i) => i !== index),
    });
  };

  const editSkill = (index: number) => {
    const itemToEdit = combo.moveList[index];

    // Check if item is editable (only move, delay, hotkey, and mouse click items)
    const isItemEditable = !!(
      itemToEdit.delay || // delay items
      itemToEdit.mouseClick || // mouse click items
      (itemToEdit.hotkey && !itemToEdit.skillName) || // hotkey items
      (itemToEdit.skillName &&
        !itemToEdit.autoCatch &&
        !["Pokestop", "Medicine", "Revive", "Auto Loot", "Auto Catch"].includes(
          itemToEdit.skillName
        ))
    );

    if (!isItemEditable) {
      return; // Don't allow editing of non-editable items
    }

    setEditingIndex(index);
    setEditedItem({ ...itemToEdit });
  };

  const saveEdit = (index: number, updatedItem: ComboMove) => {
    const updatedMoveList = [...combo.moveList];
    updatedMoveList[index] = updatedItem;
    setCombo({
      ...combo,
      moveList: updatedMoveList,
    });
    setEditingIndex(null);
    setEditedItem(defaultNewMove);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedItem(defaultNewMove);
  };

  const handleEditFieldChange = (field: string, value: any) => {
    if (field === "mouseClick") {
      setEditedItem({
        ...editedItem,
        mouseClick: value,
      });
    } else if (field === "hotkey") {
      setEditedItem({
        ...editedItem,
        hotkey: value,
      });
    } else if (field === "skillName") {
      setEditedItem({
        ...editedItem,
        skillName: value,
      });
    } else if (field === "delay") {
      setEditedItem({
        ...editedItem,
        delay: value,
      });
    }
  };

  const handleNewMove = (key: HotkeyObject["keyName"]) => {
    setNewMove({
      skillName: key,
    });
  };

  // Add a new handler function for hotkey selection
  const handleNewHotkey = (keyName: string) => {
    console.log("Selected key:", keyName);
    const key = Object.values(KeyboardKeys).find((k) => k.keyName === keyName);
    if (key) {
      setNewMove({
        ...newMove,
        hotkey: {
          keyName: key.keyName,
          keyNumber: key.keyNumber,
        },
      });
    } else {
      console.error(`Key not found for: ${keyName}`);
    }
  };

  const addItemAtPosition = (type: Types, position: number) => {
    setIsAdding(type);
    setInsertIndex(position);
    if (type === "mouseclick") {
      setMouseButton("left");
      setMouseCoordinates({ x: 0, y: 0 });
    }
  };

  const insertItemIntoCombo = () => {
    if (!isAdding) return;

    const position = insertIndex !== null ? insertIndex : combo.moveList.length;
    const newMoveList = [...combo.moveList];

    if (isAdding === "delay") {
      newMoveList.splice(position, 0, { delay: newMove.delay });
    } else if (isAdding === "mouseclick") {
      newMoveList.splice(position, 0, {
        skillName: TYPE_LABELS[isAdding],
        mouseClick: {
          button: mouseButton,
          x: mouseCoordinates.x,
          y: mouseCoordinates.y,
        },
      });
    } else if (isAdding === "hotkey") {
      if (!newMove.hotkey || !newMove.hotkey.keyName) {
        alert("Please select a hotkey first");
        return;
      }
      newMoveList.splice(position, 0, {
        hotkey: newMove.hotkey,
        skillName: newMove.hotkey.keyName,
      });
    } else if (isAdding === "move") {
      const skillName = newMove.skillName;
      const hotkey = skillName ? keybindings[skillName] : undefined;
      newMoveList.splice(position, 0, {
        skillName,
        ...(hotkey && { hotkey }),
      });
    } else if (
      ["pokestop", "medicine", "revive", "autoloot"].includes(isAdding)
    ) {
      const skillName = TYPE_LABELS[isAdding];
      const hotkey = keybindings[skillName];
      newMoveList.splice(position, 0, {
        skillName,
        ...(hotkey && { hotkey }),
      });
    } else if (isAdding === "autocatch") {
      const skillName = TYPE_LABELS[isAdding];
      const hotkey = keybindings[skillName];
      newMoveList.splice(position, 0, {
        skillName,
        autoCatch: true,
        ...(hotkey && { hotkey }),
      });
    }

    setCombo({
      ...combo,
      moveList: newMoveList,
    });

    // Reset form state
    setNewMove({
      ...defaultNewMove,
      hotkey: undefined,
    });
    setIsAdding(null);
    setInsertIndex(null);
    setIsTracking(false);
  };

  const renderAddItemForm = () => {
    if (!isAdding) return null;

    return (
      <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-600">
        <div className="mb-3">
          <div className="text-sm text-gray-400">
            Adding {TYPE_LABELS[isAdding] || isAdding}
            {insertIndex !== null && ` at position ${insertIndex + 1}`}
          </div>
        </div>
        <div className="flex gap-2 items-start">
          {isAdding === "move" && (
            <Select
              wrapperClassName="flex-1 !mt-0"
              className="bg-black text-slate-50 border border-slate-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
              value={newMove ? newMove.skillName || "" : ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleNewMove(e.target.value)
              }
              options={actions.map((action) => ({
                value: action.label,
                label: action.label,
              }))}
            />
          )}
          {isAdding === "delay" && (
            <Input
              name="delay"
              wrapperClassName="flex-1 !mt-0"
              value={newMove.delay || ""}
              placeholder="Delay in milliseconds"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewMove({ ...newMove, delay: e.target.value })
              }
            />
          )}
          {isAdding === "mouseclick" && (
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2">
                <Select
                  wrapperClassName="flex-1 !mt-0"
                  className="bg-black text-slate-50 border border-slate-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
                  value={mouseButton}
                  onChange={(e) =>
                    setMouseButton(e.target.value as "left" | "right")
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
                  value={mouseCoordinates.x.toString()}
                  placeholder="X coordinate"
                  onChange={(e) =>
                    setMouseCoordinates({
                      ...mouseCoordinates,
                      x: Number(e.target.value),
                    })
                  }
                />
                <Input
                  name="mouseY"
                  wrapperClassName="flex-1 !mt-0"
                  value={mouseCoordinates.y.toString()}
                  placeholder="Y coordinate"
                  onChange={(e) =>
                    setMouseCoordinates({
                      ...mouseCoordinates,
                      y: Number(e.target.value),
                    })
                  }
                />
                <Button
                  className={`${
                    isTracking ? "bg-red-600" : "bg-blue-600"
                  } p-2 rounded-lg`}
                  onClick={handleStartTracking}
                >
                  {isTracking ? "Cancel" : "Track"}
                </Button>
              </div>
            </div>
          )}
          {isAdding === "hotkey" && (
            <Select
              wrapperClassName="flex-1 !mt-0"
              className="bg-black text-slate-50 border border-slate-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
              value={newMove?.hotkey?.keyName || ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                handleNewHotkey(e.target.value);
              }}
              options={Object.values(KeyboardKeys).map((key) => ({
                value: key.keyName,
                label: key.keyName,
              }))}
            />
          )}
          <Button
            className="bg-green-600 p-2 rounded-lg text-white h-[42px] hover:bg-green-700"
            onClick={insertItemIntoCombo}
          >
            <CheckIcon className="size-4" />
          </Button>
          <Button
            className="bg-red-600 p-2 rounded-lg text-white h-[42px] hover:bg-red-700"
            onClick={() => {
              setNewMove(defaultNewMove);
              setIsAdding(null);
              setInsertIndex(null);
              setIsTracking(false);
            }}
          >
            <XMarkIcon className="size-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-8">
      {/* Left side - Combo Configuration */}
      <div className="w-80">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-medium mb-6">Combo Configuration</h2>

          <div className="space-y-6">
            <Input
              name="combo-name"
              label="Combo Name"
              value={combo.name || defaultNewCombo.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCombo({ ...combo, name: e.target.value })
              }
            />

            <KeybindingPicker
              name="trigger-key"
              label="Trigger Key"
              currentKey={
                combo.triggerKey?.[0]?.keyName ||
                defaultNewCombo.triggerKey?.[0]?.keyName
              }
              onKeySelected={(selectedKey) =>
                setCombo({ ...combo, triggerKey: [selectedKey] })
              }
            />
          </div>
        </div>
      </div>

      {/* Right side - Combo Items */}
      <div className="flex-1">
        <h2 className="text-lg font-medium mb-4">Combo Sequence</h2>

        {isTracking && (
          <div className="mb-4 p-4 bg-blue-900 rounded-lg">
            <p className="text-white font-bold">
              Waiting for your next click...
            </p>
            <p className="text-white">
              Click anywhere on screen (or press Enter) to capture the position.
            </p>
          </div>
        )}

        {/* Combo List with insertion points */}
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="min-h-32 flex flex-col gap-1 justify-center p-4 border border-dashed border-slate-500 mb-4 rounded-lg duration-100">
              {combo.moveList.length === 0 ? (
                <div className="text-center">
                  <div className="text-sm text-slate-300 mb-4">
                    No items in combo yet
                  </div>
                  <div
                    className="h-8 border-2 border-dashed border-blue-400 hover:border-blue-300 transition-colors cursor-pointer rounded-lg flex items-center justify-center bg-blue-900/20"
                    onClick={() => setInsertIndex(0)}
                    title="Click to add your first item"
                  >
                    <span className="text-xs text-blue-300">
                      Click here to add first item
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Insert at beginning */}
                  <div
                    className={`${
                      insertIndex === 0 ? "h-auto min-h-8" : "h-3"
                    } border-2 border-dashed transition-all duration-200 cursor-pointer rounded-lg flex flex-col items-center justify-center ${
                      insertIndex === 0
                        ? "border-blue-400 bg-blue-900/30"
                        : "border-transparent hover:border-blue-500 hover:bg-blue-900/20"
                    }`}
                    onClick={() => setInsertIndex(insertIndex === 0 ? null : 0)}
                    title="Click to insert item at the beginning"
                  >
                    {insertIndex === 0 ? (
                      <div className="p-4 w-full">
                        {isAdding && insertIndex === 0 ? (
                          renderAddItemForm()
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs text-blue-300 font-medium">
                                Add Item at Position 1
                              </span>
                              <Button
                                className="text-xs px-2 py-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInsertIndex(null);
                                }}
                              >
                                ×
                              </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <Button
                                className="text-xs py-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addItemAtPosition("move", 0);
                                }}
                              >
                                Move
                              </Button>
                              <Button
                                className="text-xs py-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addItemAtPosition("delay", 0);
                                }}
                              >
                                Delay
                              </Button>
                              <Button
                                className="text-xs py-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addItemAtPosition("hotkey", 0);
                                }}
                              >
                                Hotkey
                              </Button>
                              <Button
                                className="text-xs py-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addItemAtPosition("mouseclick", 0);
                                }}
                              >
                                Mouse Click
                              </Button>
                              <Button
                                className="text-xs py-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addItemAtPosition("pokestop", 0);
                                }}
                              >
                                Pokestop
                              </Button>
                              <Button
                                className="text-xs py-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addItemAtPosition("medicine", 0);
                                }}
                              >
                                Medicine
                              </Button>
                              <Button
                                className="text-xs py-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addItemAtPosition("revive", 0);
                                }}
                              >
                                Revive
                              </Button>
                              <Button
                                className="text-xs py-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addItemAtPosition("autoloot", 0);
                                }}
                              >
                                Auto Loot
                              </Button>
                              <Button
                                className="text-xs py-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addItemAtPosition("autocatch", 0);
                                }}
                              >
                                Auto Catch
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 opacity-0">
                        Click to insert item here
                      </span>
                    )}
                  </div>

                  {items.map((item, index) => (
                    <div key={item.id}>
                      <SortableItem
                        id={item.id}
                        item={item}
                        isEditing={editingIndex === index}
                        editedItem={editedItem}
                        onRemove={() => removeSkill(index)}
                        onEdit={() => editSkill(index)}
                        onSaveEdit={(updatedItem: ComboMove) =>
                          saveEdit(index, updatedItem)
                        }
                        onCancelEdit={cancelEdit}
                        onEditFieldChange={handleEditFieldChange}
                        {...(item.delay && {
                          style: { backgroundColor: colors.slate[900] },
                        })}
                      />
                      {/* Insert after this item */}
                      <div
                        className={`${
                          insertIndex === index + 1 ? "h-auto min-h-8" : "h-3"
                        } border-2 border-dashed transition-all duration-200 cursor-pointer rounded-lg flex flex-col items-center justify-center ${
                          insertIndex === index + 1
                            ? "border-blue-400 bg-blue-900/30"
                            : "border-transparent hover:border-blue-500 hover:bg-blue-900/20"
                        }`}
                        onClick={() =>
                          setInsertIndex(
                            insertIndex === index + 1 ? null : index + 1
                          )
                        }
                        title={`Click to insert item after position ${
                          index + 1
                        }`}
                      >
                        {insertIndex === index + 1 ? (
                          <div className="p-4 w-full">
                            {isAdding && insertIndex === index + 1 ? (
                              renderAddItemForm()
                            ) : (
                              <>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs text-blue-300 font-medium">
                                    Add Item at Position {index + 2}
                                  </span>
                                  <Button
                                    className="text-xs px-2 py-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setInsertIndex(null);
                                    }}
                                  >
                                    ×
                                  </Button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <Button
                                    className="text-xs py-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addItemAtPosition("move", index + 1);
                                    }}
                                  >
                                    Move
                                  </Button>
                                  <Button
                                    className="text-xs py-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addItemAtPosition("delay", index + 1);
                                    }}
                                  >
                                    Delay
                                  </Button>
                                  <Button
                                    className="text-xs py-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addItemAtPosition("hotkey", index + 1);
                                    }}
                                  >
                                    Hotkey
                                  </Button>
                                  <Button
                                    className="text-xs py-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addItemAtPosition(
                                        "mouseclick",
                                        index + 1
                                      );
                                    }}
                                  >
                                    Mouse Click
                                  </Button>
                                  <Button
                                    className="text-xs py-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addItemAtPosition("pokestop", index + 1);
                                    }}
                                  >
                                    Pokestop
                                  </Button>
                                  <Button
                                    className="text-xs py-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addItemAtPosition("medicine", index + 1);
                                    }}
                                  >
                                    Medicine
                                  </Button>
                                  <Button
                                    className="text-xs py-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addItemAtPosition("revive", index + 1);
                                    }}
                                  >
                                    Revive
                                  </Button>
                                  <Button
                                    className="text-xs py-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addItemAtPosition("autoloot", index + 1);
                                    }}
                                  >
                                    Auto Loot
                                  </Button>
                                  <Button
                                    className="text-xs py-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addItemAtPosition("autocatch", index + 1);
                                    }}
                                  >
                                    Auto Catch
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 opacity-0">
                            Click to insert item here
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </SortableContext>
        </DndContext>

        <div className="flex gap-4 justify-end">
          <Button
            className="p-4 bg-slate-900 border-red-900 rounded-lg min-w-[160px]"
            onClick={() => updateCombo({})}
          >
            Delete
          </Button>
          <Button
            className="p-4 bg-slate-950 border-blue-900 rounded-lg min-w-[160px]"
            onClick={() => {
              // Clean the moveList of any temporary ID fields before sending
              const moveListToSend = cleanMoveList(combo.moveList).map(
                (move) => ({
                  ...move,
                  hotkey: move.hotkey || undefined,
                })
              );

              const newCombo = {
                name: combo.name || defaultNewCombo.name,
                triggerKey:
                  combo.triggerKey.length > 0
                    ? combo.triggerKey
                    : defaultNewCombo.triggerKey,
                moveList: moveListToSend,
              };

              updateCombo(newCombo);
              setCurrentCombo(newCombo);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AutoComboEdit;
