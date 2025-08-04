import { useContext, useState, useEffect, useMemo } from "react";
import { Combo } from "../types/types";
import Card from "../components/Card/Card";
import AutoComboEdit from "./AutoCombo.edit";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import { updateAutoCombo } from "../utils/actions";
import AddItemButton from "../components/Button/AddItemButton";
import PageWrapper from "../components/PageWrapper";
import * as AutoComboContext from "../contexts/AutoComboContext";
import * as KeybindingsContext from "../contexts/KeybindingsContext";

const AutoComboTab = () => {
  const { combos, setCombos, currentCombo, setCurrentCombo } = useContext(
    AutoComboContext.Context
  );
  const { keybindings } = useContext(KeybindingsContext.Context);

  const activeComboIndex = useMemo(
    () => combos.findIndex((c) => c.name === currentCombo?.name) ?? 0,
    [combos, currentCombo]
  );

  const [isEditing, setIsEditing] = useState<typeof activeComboIndex | null>(
    null
  );

  const syncComboWithKeybindings = (combo: Combo): Combo => {
    const updatedMoveList = combo.moveList.map((move) => {
      if (move.skillName && keybindings[move.skillName]) {
        return {
          ...move,
          hotkey: keybindings[move.skillName],
        };
      }
      return move;
    });

    return {
      ...combo,
      moveList: updatedMoveList,
    };
  };

  useEffect(() => {
    if (
      keybindings &&
      Object.keys(keybindings).length > 0 &&
      combos.length > 0
    ) {
      const updatedCombos = combos.map(syncComboWithKeybindings);

      const hasChanges =
        JSON.stringify(updatedCombos) !== JSON.stringify(combos);
      if (hasChanges) {
        console.log("Syncing combos with updated keybindings...");
        setCombos(updatedCombos);

        if (currentCombo) {
          const updatedCurrentCombo = syncComboWithKeybindings(currentCombo);
          setCurrentCombo(updatedCurrentCombo);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keybindings]);

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

  if (isEditing !== null) {
    return (
      <PageWrapper
        title="Edit Combo"
        subtitle={`Editing: ${combos[isEditing]?.name}`}
        actions={
          <button
            onClick={() => setIsEditing(null)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to List
          </button>
        }
      >
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
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Auto Combo"
      subtitle="Manage and configure your combat combos"
      actions={
        <AddItemButton
          onClick={() => {
            const newComboIndex = combos.length;
            const newCombo: Combo = {
              name: `New Combo ${newComboIndex + 1}`,
              triggerKey: [],
              moveList: [],
            };
            setCombos([...combos, newCombo]);
            setIsEditing(newComboIndex);
          }}
        />
      }
    >
      {combos && combos.length > 0 ? (
        <div className="grid gap-3">
          {combos.map((combo, index) => (
            <Card
              key={combo.name}
              active={activeComboIndex === index}
              onClick={() => setCurrentCombo(combos[index])}
              onDoubleClick={() => setIsEditing(index)}
              className="!m-0 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-400 font-mono">
                      #{index + 1}
                    </span>
                    <h3 className="font-medium text-gray-100">{combo.name}</h3>
                    {activeComboIndex === index && (
                      <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded">
                        Active
                      </span>
                    )}
                  </div>

                  {combo.triggerKey?.[0] && (
                    <div className="text-sm text-gray-400 mb-2">
                      Trigger:{" "}
                      <kbd className="px-1.5 py-0.5 text-xs bg-green-700 text-gray-100 rounded">
                        {combo.triggerKey[0].keyName}
                      </kbd>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {combo.moveList?.slice(0, 5).map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
                      >
                        {item.mouseClick
                          ? `Click (${item.mouseClick.x}, ${item.mouseClick.y})`
                          : item.skillName
                          ? item.skillName
                          : item.delay
                          ? `${item.delay}ms`
                          : "Unknown"}
                      </span>
                    ))}
                    {combo.moveList && combo.moveList.length > 5 && (
                      <span className="px-2 py-1 text-xs bg-blue-900 text-white rounded">
                        +{combo.moveList.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Create a duplicate combo
                      const duplicatedCombo: Combo = {
                        ...combo,
                        name: `${combo.name} (Copy)`,
                        // Deep copy the moveList to avoid reference issues
                        moveList: combo.moveList.map((item) => ({
                          ...item,
                          // Remove any temporary IDs that might exist
                          id: undefined,
                        })),
                      };
                      const newCombos = [...combos, duplicatedCombo];
                      setCombos(newCombos);
                      setIsEditing(newCombos.length - 1); // Open the duplicated combo for editing
                    }}
                    className="px-2 py-1 text-xs text-blue-400 hover:text-blue-200 hover:bg-blue-900/30 rounded transition-colors"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(index);
                    }}
                    className="px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <PlusIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No combos configured yet</p>
            <p className="text-sm">Create your first combo to get started</p>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default AutoComboTab;
