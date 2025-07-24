import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Card from "../components/Card/Card";
import { Combo, ComboMove, HotkeyObject } from "../types/types";
import { useContext, useState, useEffect } from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import Select from "../components/Select/Select";
import { actions } from "./AutoCombo.data";
import * as AutoComboContext from "../contexts/AutoComboContext";
import ActionsList, {
  TYPE_DELAYS,
  TYPE_LABELS,
  Types,
} from "../components/ActionsList/ActionsList";
import ComboList from "../components/ComboList/ComboList";
import KeybindingPicker from "../components/KeybindingPicker";
import { toggleMouseTracking, getMouseCoordinates } from "../utils/actions";
import { KeyboardKeys } from "../utils/keys";

const getMoveDelay = (moveName?: string) => {
  if (!moveName) return;

  const skillLower = moveName.toLowerCase();

  let defaultDelay = "350";
  if (skillLower.includes("pokestop")) {
    defaultDelay = TYPE_DELAYS["pokestop"];
  } else if (skillLower.includes("medicine")) {
    defaultDelay = TYPE_DELAYS["medicine"];
  } else if (skillLower.includes("revive")) {
    defaultDelay = TYPE_DELAYS["revive"];
  } else if (skillLower.includes("auto loot")) {
    defaultDelay = TYPE_DELAYS["autoloot"];
  } else {
    defaultDelay = TYPE_DELAYS["move"];
  }

  return defaultDelay;
};

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
  const [newMove, setNewMove] = useState<ComboMove>(defaultNewMove);
  const [isTracking, setIsTracking] = useState(false);
  const [mouseButton, setMouseButton] = useState<"left" | "right">("left");
  const [mouseCoordinates, setMouseCoordinates] = useState({ x: 0, y: 0 });

  const { setCurrentCombo } = useContext(AutoComboContext.Context);

  // Poll for coordinates when tracking is active
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(async () => {
      try {
        const coords = await getMouseCoordinates();
        
        // Check if we have new coordinates
        if (coords && (coords.x !== 0 || coords.y !== 0) && 
            (coords.x !== mouseCoordinates.x || coords.y !== mouseCoordinates.y)) {
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
    }, 200);  // Poll more frequently (200ms)

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

  const handleReorder = (newMoveList: any[]) => {
    setCombo({ ...combo, moveList: newMoveList });
  };

  const handleNewMove = (key: HotkeyObject["keyName"]) => {
    setNewMove({
      skillName: key,
    });
  };

  // Add a new handler function for hotkey selection
  const handleNewHotkey = (keyName: string) => {
    console.log("Selected key:", keyName);
    const key = Object.values(KeyboardKeys).find(k => k.keyName === keyName);
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

  return (
    <div className="flex gap-8">
      <div>
        <h2 className="text-lg font-medium mb-[43px]">Actions</h2>
        <ActionsList
          onClick={(type) => {
            if (["pokestop", "medicine", "revive", "autoloot"].includes(type)) {
              setCombo({
                ...combo,
                moveList: [
                  ...combo.moveList,
                  ...(!combo.moveList[combo.moveList.length - 1]?.delay
                    ? [{ delay: TYPE_DELAYS[type] }]
                    : []),
                  { skillName: TYPE_LABELS[type] },
                ],
              });
            } else if (type === "autocatch") {
              setCombo({
                ...combo,
                moveList: [
                  ...combo.moveList,
                  { skillName: TYPE_LABELS[type], autoCatch: true },
                ],
              });
            } else if (type === "mouseclick") {
              // Initialize the mouseclick action with default values
              setIsAdding(type);
              setMouseButton("left");
              setMouseCoordinates({ x: 0, y: 0 });
            } else {
              setIsAdding(type);
            }
          }}
        />
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-medium">
          {combo.name || defaultNewCombo.name}
        </h2>
        <div className="flex gap-4 mb-8">
          <Input
            name="combo-name"
            wrapperClassName="flex-1"
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
        <h2 className="text-md font-medium my-4">Skills</h2>

        <ComboList
          combo={combo}
          onRemove={removeSkill}
          onReorder={handleReorder}
        />

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

        {isAdding && (
          <Card as="div" active={false} className="bg-slate-800 w-full mb-8">
            <div className="flex gap-2 items-center">
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
                <>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2">
                      <Select
                        wrapperClassName="flex-1 !mt-0"
                        className="bg-black text-slate-50 border border-slate-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
                        value={mouseButton}
                        onChange={(e) => setMouseButton(e.target.value as "left" | "right")}
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
                        value={mouseCoordinates.x.toString()} // Convert number to string
                        placeholder="X coordinate"
                        onChange={(e) => setMouseCoordinates({...mouseCoordinates, x: Number(e.target.value)})}
                      />
                      <Input
                        name="mouseY"
                        wrapperClassName="flex-1 !mt-0"
                        value={mouseCoordinates.y.toString()} // Convert number to string
                        placeholder="Y coordinate"
                        onChange={(e) => setMouseCoordinates({...mouseCoordinates, y: Number(e.target.value)})}
                      />
                      <Button 
                        className={`${isTracking ? "bg-red-600" : "bg-blue-600"} p-2 rounded-lg`}
                        onClick={handleStartTracking}
                      >
                        {isTracking ? "Cancel" : "Track"}
                      </Button>
                    </div>
                  </div>
                </>
              )}
              {isAdding === "hotkey" && (
                <Select
                  wrapperClassName="flex-1 !mt-0"
                  className="bg-black text-slate-50 border border-slate-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
                  value={newMove?.hotkey?.keyName || ""} // This should show the selected key
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    console.log("Select onChange:", e.target.value); // Debug log
                    handleNewHotkey(e.target.value);
                  }}
                  options={Object.values(KeyboardKeys).map((key) => ({
                    value: key.keyName,
                    label: key.keyName,
                  }))}
                />
              )}
              <Button
                className="bg-blue-00 p-4 rounded-lg text-green-400 h-[42px] hover:bg-green-900 hover:text-white"
                onClick={() => {
                  if (isAdding === "delay") {
                    setCombo({
                      ...combo,
                      moveList: [...combo.moveList, { delay: newMove.delay }],
                    });
                  } else if (isAdding === "mouseclick") {
                    setCombo({
                      ...combo,
                      moveList: [
                        ...combo.moveList,
                        ...(!combo.moveList[combo.moveList.length - 1]?.delay
                          ? [{ delay: TYPE_DELAYS[isAdding] }]
                          : []),
                        {
                          skillName: TYPE_LABELS[isAdding],
                          mouseClick: {
                            button: mouseButton,
                            x: mouseCoordinates.x,
                            y: mouseCoordinates.y
                          }
                        },
                      ],
                    });
                  } else if (isAdding === "hotkey") {
                    console.log("Adding hotkey - newMove:", newMove); // Debug log
                    console.log("Adding hotkey - newMove.hotkey:", newMove.hotkey); // Debug log
                    
                    // Verificar se o hotkey foi selecionado
                    if (!newMove.hotkey || !newMove.hotkey.keyName) {
                      alert("Please select a hotkey first");
                      return;
                    }
                    
                    setCombo({
                      ...combo,
                      moveList: [
                        ...combo.moveList,
                        ...(!combo.moveList[combo.moveList.length - 1]?.delay
                          ? [{ delay: TYPE_DELAYS[isAdding] }]
                          : []),
                        {
                          hotkey: newMove.hotkey,
                          skillName: newMove.hotkey.keyName // Use the actual key name
                        },
                      ],
                    });
                  } else {
                    setCombo({
                      ...combo,
                      moveList: [
                        ...combo.moveList,
                        ...(!combo.moveList[combo.moveList.length - 1]?.delay
                          ? [{ delay: getMoveDelay(newMove.skillName) }]
                          : []),
                        {
                          skillName: newMove.skillName,
                        },
                      ],
                    });
                  }

                  // After all the setCombo calls, make sure to reset properly:
                  setNewMove({
                    ...defaultNewMove,
                    hotkey: undefined // Explicitly reset hotkey
                  });
                  setIsAdding(null);
                  setIsTracking(false);
                }}
              >
                <CheckIcon className="size-4" />
              </Button>
              <Button
                className="bg-blue-900 p-4 rounded-lg text-red-400 h-[42px] hover:bg-red-900 hover:text-white"
                onClick={() => {
                  setNewMove(defaultNewMove);
                  setIsAdding(null);
                  setIsTracking(false);
                }}
              >
                <XMarkIcon className="size-4" />
              </Button>
            </div>
          </Card>
        )}
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
              const moveListToSend = combo.moveList.map((move) => ({
                ...move,
                hotkey: move.hotkey || undefined, // Preserve hotkey structure
              }));

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
