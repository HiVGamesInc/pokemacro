import { useContext, useState, useEffect, useMemo } from "react";
import { Combo } from "../types/types";
import Card from "../components/Card/Card";
import AutoComboEdit from "./AutoCombo.edit";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { updateAutoCombo } from "../utils/actions";
import AddItemButton from "../components/Button/AddItemButton";
import * as AutoComboContext from "../contexts/AutoComboContext";

const AutoComboTab = () => {
  const { combos, setCombos, currentCombo, setCurrentCombo } = useContext(
    AutoComboContext.Context
  );

  const activeComboIndex = useMemo(
    () => combos.findIndex((c) => c.name === currentCombo?.name) ?? 0,
    [combos, currentCombo]
  );

  const [isEditing, setIsEditing] = useState<typeof activeComboIndex | null>(
    null
  );

  useEffect(() => {
    if (currentCombo && Object.keys(currentCombo).length) {
      updateAutoCombo(currentCombo)
        .then((response) => {
          console.info("Combo updated:", response);
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

              if (Object.keys(data).length > 0)
                (updatedCombos[isEditing] as Combo | {}) = data;
              else updatedCombos.splice(isEditing, 1);

              setCurrentCombo(updatedCombos[activeComboIndex]);
              setCombos(updatedCombos);
              setIsEditing(null);
            }}
          />
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold">Auto Combo</h2>
          <h3 className="text-lg font-bold mt-4 mb-4">Combos</h3>

          {combos && (
            <>
              <div className="flex gap-4 flex-wrap">
                {combos.map((combo, index) => (
                  <Card
                    key={combo.name}
                    active={activeComboIndex === index}
                    onClick={() => setCurrentCombo(combos[index])}
                    onDoubleClick={() => setIsEditing(index)}
                    className="flex flex-col items-start !m-0"
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="text-lg font-medium">{combo.name}</div>
                      <div className="text-md font-medium text-slate-300">
                        {combo.triggerKey[0].keyName}
                      </div>
                    </div>
                    {/* {combo.moveList &&
                      combo.moveList.map((item, index) => (
                        <div
                          key={item.skillName + index}
                          className="text-xs font-medium mt-1 text-red-300"
                        >
                          {item.skillName} -{" "}
                          {item.hotkey.map((k) => k.keyName).join("+")}
                        </div>
                      ))} */}
                  </Card>
                ))}
              </div>
              <AddItemButton onClick={() => setIsEditing(combos.length)}>
                <div className="flex items-center justify-center">
                  <div className="text-md font-medium">Add Combo</div>
                </div>
              </AddItemButton>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AutoComboTab;
