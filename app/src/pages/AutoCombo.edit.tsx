import { TrashIcon } from "@heroicons/react/24/outline";
import Card from "../components/Card/Card";
import { Combo, ComboItem } from "../types/types";
import { useState } from "react";
import Input from "../components/Input/Input";
import { findKey } from "../utils/keys";
import KeyboardKeysSelect from "../components/Select/KeyboardKeysSelect";
import Button from "../components/Button/Button";

type AutoComboEditProps = {
  data: Combo;
  updateCombo: (combo: Combo) => void;
};

const defaultNewSkill = {
  skillName: "",
  hotkey: [],
  afterAttackDelay: 0,
};

const AutoComboEdit = ({ data, updateCombo }: AutoComboEditProps) => {
  const [combo, setCombo] = useState(data);
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState<ComboItem>(defaultNewSkill);

  const removeSkill = (index: number) =>
    setCombo({
      ...combo,
      itemList: combo.itemList.filter((item, i) => i !== index),
    });

  return (
    <div>
      <h2 className="text-md font-medium my-4">Skills</h2>
      {combo.itemList.map((item, index) => (
        <Card
          as="div"
          key={item.skillName + index}
          active={false}
          className="my-4"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-md font-medium">{item.skillName}</div>
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
      ))}

      {isAdding ? (
        <Card
          as="div"
          active={false}
          className="mb-4 bg-transparent outline-dashed w-full hover:outline-slate-500 transition-all"
        >
          <div className="flex gap-4">
            <Input
              wrapperClassName="flex-1"
              label="Skill Name"
              defaultValue={""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewSkill({ ...newSkill, skillName: e.target.value });
              }}
            />

            <KeyboardKeysSelect
              wrapperClassName="flex-1"
              title="Select a hotkey"
              defaultValue={""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const key = findKey(false, Number(e.target.value));

                setNewSkill({
                  ...newSkill,
                  hotkey: [key],
                });
              }}
              options={[
                {
                  value: "1",
                  label: "option1",
                },
                {
                  value: "2",
                  label: "option2",
                },
              ]}
            />

            <Input
              wrapperClassName="flex-1"
              label="Delay (in milliseconds)"
              defaultValue={""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewSkill({
                  ...newSkill,
                  afterAttackDelay: Number(e.target.value),
                });
              }}
            />
          </div>

          <Button
            active={false}
            inactiveClass="outline-none"
            className="mt-4 bg-blue-900 p-4 rounded-lg min-w-[160px]"
            onClick={() => {
              setCombo({
                ...combo,
                itemList: [...combo.itemList, newSkill],
              });
              setIsAdding(false);
              setNewSkill(defaultNewSkill);
            }}
          >
            Add
          </Button>
        </Card>
      ) : (
        <Card
          active={false}
          className="mb-4 bg-transparent outline-dashed w-full hover:outline-slate-500 transition-all"
          onClick={() => setIsAdding(true)}
        >
          <div className="flex items-center justify-center">
            <div className="text-md font-medium">Add Skill</div>
          </div>
        </Card>
      )}
      <div className="flex justify-end">
        <Button
          active={false}
          inactiveClass="outline-none"
          className="mt-16 p-4 bg-blue-900 rounded-lg min-w-[160px]"
          onClick={() => updateCombo(combo)}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default AutoComboEdit;
