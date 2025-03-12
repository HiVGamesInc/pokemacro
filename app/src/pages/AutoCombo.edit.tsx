import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Card from "../components/Card/Card";
import { Combo, ComboMove, HotkeyObject } from "../types/types";
import { useContext, useState } from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import Select from "../components/Select/Select";
import { actions } from "./AutoCombo.data";
import * as AutoComboContext from "../contexts/AutoComboContext";
import * as KeybindingsContext from "../contexts/KeybindingsContext";
import ActionsList, {
  TYPE_DELAYS,
  TYPE_LABELS,
  Types,
} from "../components/ActionsList/ActionsList";
import ComboList from "../components/ComboList/ComboList";
import KeybindingPicker from "../components/KeybindingPicker";
import { comboWithHotkeys } from "../utils/combo";

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

  const { setCurrentCombo } = useContext(AutoComboContext.Context);
  const { keybindings } = useContext(KeybindingsContext.Context);

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
                  {
                    skillName: TYPE_LABELS[type],
                  },
                ],
              });
            } else {
              // opens accept/cancel ui
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

        {/* ComboList now uses dnd-kit internally. */}
        <ComboList
          combo={combo}
          onRemove={removeSkill}
          onReorder={handleReorder}
        />

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
              <Button
                className="bg-blue-00 p-4 rounded-lg text-green-400 h-[42px] hover:bg-green-900 hover:text-white"
                onClick={() => {
                  console.log(combo);

                  if (isAdding === "delay") {
                    setCombo({
                      ...combo,
                      moveList: [...combo.moveList, { delay: newMove.delay }],
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

                  setNewMove(defaultNewMove);
                  setIsAdding(null);
                }}
              >
                <CheckIcon className="size-4" />
              </Button>
              <Button
                className="bg-blue-900 p-4 rounded-lg text-red-400 h-[42px] hover:bg-red-900 hover:text-white"
                onClick={() => {
                  setNewMove(defaultNewMove);
                  setIsAdding(null);
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
              const moveListToSend = comboWithHotkeys(
                combo.moveList,
                keybindings
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
