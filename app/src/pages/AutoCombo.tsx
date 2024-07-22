import { useContext, useState, useEffect } from "react";
import { Combo } from "../types/types";
import { KeyboardKeys } from "../utils/keys";
import Card from "../components/Card/Card";
import AutoComboEdit from "./AutoCombo.edit";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { AutoComboContext } from "../router/router";
import { updateAutoCombo } from "../utils/actions";

const initialCombos: Combo[] = [
  {
    name: "Gyarados",
    reviveSliderValue: 3,
    itemList: [
      {
        skillName: "Skill 1",
        hotkey: [KeyboardKeys.F7],
        afterAttackDelay: 300,
      },
      {
        skillName: "Skill 2",
        hotkey: [KeyboardKeys.F6],
        afterAttackDelay: 300,
      },
      {
        skillName: "Skill 3",
        hotkey: [KeyboardKeys.F5],
        afterAttackDelay: 300,
      },
    ],
  },
  {
    name: "Jynx",
    reviveSliderValue: 3,
    itemList: [
      {
        skillName: "Skill 1",
        hotkey: [KeyboardKeys.F7],
        afterAttackDelay: 300,
      },
      {
        skillName: "Skill 2",
        hotkey: [KeyboardKeys.F6],
        afterAttackDelay: 300,
      },
      {
        skillName: "Skill 3",
        hotkey: [KeyboardKeys.F5],
        afterAttackDelay: 300,
      },
    ],
  },
];

const AutoComboTab = () => {
  const [combos, setCombos] = useState(initialCombos);
  const [activeCombo, setActiveCombo] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<typeof activeCombo | null>(null);
  const { currentCombo, setCurrentCombo } = useContext(AutoComboContext);

  useEffect(() => {
    setCurrentCombo(combos[activeCombo]);
  }, [activeCombo, combos, setCurrentCombo]);

  useEffect(() => {
    if (currentCombo) {
      updateAutoCombo(KeyboardKeys.V, currentCombo)
        .then((response) => {
          console.log("Combo updated:", response);
        })
        .catch((error) => {
          console.error("Error updating combo:", error);
        });
    }
  }, [currentCombo]);

  return (
    <div>
      {isEditing !== null ? (
        <>
          <button onClick={() => setIsEditing(null)}>
            <ArrowLeftIcon className="size-6 text-blue-500" />
          </button>
          <AutoComboEdit
            data={combos[isEditing]}
            updateCombo={(data) => {
              const updatedCombos = [...combos];
              updatedCombos[isEditing] = data;
              setCombos(updatedCombos);
              setCurrentCombo(updatedCombos[activeCombo]);
              setIsEditing(null);
            }}
          />
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold">Auto Combo</h2>
          <h3 className="text-lg font-bold mt-4 mb-4">Combos</h3>

          {combos && (
            <div className="flex gap-4 flex-wrap">
              {combos.map((combo, index) => (
                <Card
                  key={combo.name}
                  active={activeCombo === index}
                  onClick={() => setActiveCombo(index)}
                  onDoubleClick={() => setIsEditing(index)}
                  className="flex flex-col items-start"
                >
                  <div className="text-lg font-medium">{combo.name}</div>
                  {combo.reviveSliderValue && (
                    <div className="text-xs font-normal my-4">
                      Use Revive em{" "}
                      <span className="text-blue-200 font-bold">
                        {combo.reviveSliderValue} segundos.
                      </span>
                    </div>
                  )}
                  {combo.itemList &&
                    combo.itemList.map((item, index) => (
                      <div
                        key={item.skillName + index}
                        className="text-xs font-medium mt-1 text-red-300"
                      >
                        {item.skillName} -{" "}
                        {item.hotkey.map((k) => k.keyName).join("+")} -{" "}
                        {item.afterAttackDelay / 1000} segundos
                      </div>
                    ))}
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AutoComboTab;
