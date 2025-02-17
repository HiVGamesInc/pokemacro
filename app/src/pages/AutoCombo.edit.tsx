import { TrashIcon } from "@heroicons/react/24/outline";
import Card from "../components/Card/Card";
import { Combo, ComboItem } from "../types/types";
import { useContext, useState } from "react";
import Input from "../components/Input/Input";
import { findKey } from "../utils/keys";
import KeyboardKeysSelect from "../components/Select/KeyboardKeysSelect";
import Button from "../components/Button/Button";
import Select from "../components/Select/Select";
import { actions } from "./AutoCombo.data";
import AddItemButton from "../components/Button/AddItemButton";
// import Checkbox from "../components/Checkbox/Checkbox";

import * as AutoComboContext from "../contexts/AutoComboContext";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

type AutoComboEditProps = {
  data: Combo;
  updateCombo: (combo: Combo | {}) => void;
};

const defaultNewCombo: Combo = {
  name: "New Combo",
  triggerKey: [
    {
      keyName: "V",
      keyNumber: 90,
    },
  ],
  reviveSliderValue: 1,
  itemList: [],
  useRevive: false,
};

const defaultNewSkill = {
  skillName: "",
  hotkey: [],
  afterAttackDelay: 500,
};

const AutoComboEdit = ({ data, updateCombo }: AutoComboEditProps) => {
  const [combo, setCombo] = useState(
    data || {
      name: "",
      triggerKey: [],
      itemList: [],
      useRevive: false,
    }
  );
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState<ComboItem>(defaultNewSkill);

  const { setCurrentCombo } = useContext(AutoComboContext.Context);

  const removeSkill = (index: number) =>
    setCombo({
      ...combo,
      itemList: combo.itemList.filter((item, i) => i !== index),
    });

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.index === destination.index) return;
    const newItemList = Array.from(combo.itemList);
    newItemList.splice(source.index, 1);
    newItemList.splice(destination.index, 0, combo.itemList[source.index]);
    setCombo({ ...combo, itemList: newItemList });
  };

  return (
    <div>
      <h2 className="text-lg font-medium">
        {combo.name || defaultNewCombo.name}
      </h2>

      <div className="flex gap-4 mb-8">
        <Input
          wrapperClassName="flex-1"
          label="Combo Name"
          value={combo.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCombo({
              ...combo,
              name: e.target.value,
            });
          }}
        />

        <KeyboardKeysSelect
          wrapperClassName="flex-1"
          title="Trigger Key"
          value={combo.triggerKey?.[0]?.keyNumber?.toString() || ""}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const key = findKey(false, Number(e.target.value));

            setCombo({
              ...combo,
              triggerKey: [key],
            });
          }}
        />

        {/* <Checkbox
          wrapperClassName="flex-1"
          label="Use Revive on Combo"
          defaultValue={combo.useRevive}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCombo({
              ...combo,
              useRevive: e.target.checked,
            });
          }}
        /> */}
      </div>
      <h2 className="text-md font-medium my-4">Skills</h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {combo.itemList.map((item, index) => (
                <Draggable
                  key={item.skillName}
                  draggableId={item.skillName}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card
                        as="div"
                        key={item.skillName + index}
                        active={false}
                        className="my-4"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-md font-medium">
                              {item.skillName}
                            </div>
                            <div className="flex gap-4">
                              <div className="text-sm text-slate-300">
                                <span className="font-medium">Hotkey:</span>{" "}
                                {item.hotkey.map((k) => k.keyName).join("+")}
                              </div>
                              <div className="text-sm text-slate-300">
                                <span className="font-medium">Delay:</span>{" "}
                                {item.afterAttackDelay / 1000} segundos
                              </div>
                            </div>
                          </div>
                          <button onClick={() => removeSkill(index)}>
                            <TrashIcon className="size-6 text-blue-500" />
                          </button>
                        </div>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isAdding ? (
        <Card
          as="div"
          active={false}
          className="mb-4 bg-transparent outline-dashed w-full hover:outline-slate-500 transition-all"
        >
          <div className="flex gap-4">
            <Select
              wrapperClassName="flex-1"
              className="bg-black text-slate-50 border border-slate-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
              title="Select an action"
              value={
                newSkill
                  ? `${newSkill.hotkey?.[0]?.keyName}+${newSkill.skillName}`
                  : ""
              }
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const [key, label] = e.target.value.split("+");
                const keyObj = findKey(key);

                setNewSkill({
                  ...newSkill,
                  skillName: label,
                  hotkey: [keyObj],
                });
              }}
              options={actions.map((action) => ({
                value: `${action.hotkey}+${action.label}`,
                label: action.label,
              }))}
            />

            <Input
              wrapperClassName="flex-1"
              label="Delay (in milliseconds)"
              value={(
                newSkill.afterAttackDelay || defaultNewSkill.afterAttackDelay
              ).toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewSkill({
                  ...newSkill,
                  afterAttackDelay: Number(e.target.value),
                });
              }}
            />
          </div>

          <div className="flex justify-end">
            <Button
              active={false}
              inactiveClass="outline-none"
              className="mt-4 bg-blue-800 p-4 rounded-lg min-w-[160px]"
              onClick={() => {
                setCombo({
                  ...combo,
                  itemList: [...combo.itemList, newSkill],
                });
                setNewSkill(defaultNewSkill);
              }}
            >
              Add
            </Button>
          </div>
        </Card>
      ) : (
        <AddItemButton onClick={() => setIsAdding(true)}>
          <div className="flex items-center justify-center">
            <div className="text-md font-medium">Add Skill</div>
          </div>
        </AddItemButton>
      )}
      <div className="flex justify-end">
        <Button
          active={false}
          inactiveClass="outline-none"
          className="mt-16 p-4 bg-slate-800 rounded-lg min-w-[160px]"
          onClick={() => updateCombo({})}
        >
          Delete
        </Button>
        <Button
          active={false}
          inactiveClass="outline-none"
          className="mt-16 p-4 bg-blue-800 rounded-lg min-w-[160px]"
          onClick={() => {
            updateCombo({
              name: combo.name || defaultNewCombo.name,
              triggerKey:
                combo.triggerKey.length > 0
                  ? combo.triggerKey
                  : defaultNewCombo.triggerKey,
              itemList:
                combo.itemList.length > 0
                  ? combo.itemList
                  : defaultNewCombo.itemList,
              reviveSliderValue:
                combo.reviveSliderValue ?? defaultNewCombo.reviveSliderValue,
              useRevive: combo.useRevive ?? defaultNewCombo.useRevive,
            });

            setCurrentCombo(combo);
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default AutoComboEdit;
