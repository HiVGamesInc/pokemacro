import React, { useState, useEffect } from "react";
import { Combo, ComboItem, Hotkey } from "../types/types";
import { findKey, KeyboardKeys } from "../utils/keys";

const initialCombos: { [key: string]: Combo } = {
  exampleCombo: {
    name: "",
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
};

const AutoComboTab = () => {
  const [combos, setCombos] = useState<{ [key: string]: Combo }>(initialCombos);
  const [selectedCombo, setSelectedCombo] = useState<string>(
    Object.keys(initialCombos)[0]
  );
  const [comboName, setComboName] = useState<string>(selectedCombo);
  const [reviveSliderValue, setReviveSliderValue] = useState<number>(
    initialCombos[selectedCombo]?.reviveSliderValue || 0
  );
  const [items, setItems] = useState<ComboItem[]>(
    initialCombos[selectedCombo]?.itemList || []
  );
  const [selectedMedicineHotkey, setSelectedMedicineHotkey] = useState<Hotkey>(
    KeyboardKeys.A
  );
  const [selectedReviveHotkey, setSelectedReviveHotkey] = useState<Hotkey>(
    KeyboardKeys.A
  );
  const [selectedAutoReviveHotkey, setSelectedAutoReviveHotkey] =
    useState<Hotkey>(KeyboardKeys.A);
  const [selectedMoveHotkey, setSelectedMoveHotkey] = useState<Hotkey>(
    KeyboardKeys.A
  );
  const [selectedPokestopHotkey, setSelectedPokestopHotkey] = useState<Hotkey>(
    KeyboardKeys.A
  );
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemHotkey, setNewItemHotkey] = useState<Hotkey>(KeyboardKeys.A);
  const [newItemAfterAttackDelay, setNewItemAfterAttackDelay] =
    useState<number>(1);

  useEffect(() => {
    if (selectedCombo && combos[selectedCombo]) {
      const combo = combos[selectedCombo];
      setComboName(selectedCombo);
      setReviveSliderValue(combo.reviveSliderValue);
      setItems(combo.itemList);
    }
  }, [selectedCombo, combos]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        skillName: newItemName,
        hotkey: newItemHotkey,
        afterAttackDelay: newItemAfterAttackDelay,
      },
    ]);
    setNewItemName("");
    setNewItemHotkey(KeyboardKeys.A);
    setNewItemAfterAttackDelay(1);
  };

  const handleRemoveItem = (index: number) => {
    // window.electron.ipcRenderer.sendMessage('move-mouse');
    setItems(items.filter((_, i) => i !== index));
  };

  useEffect(() => {
    // window.electron.ipcRenderer.sendMessage(
    //   'registerKey',
    //   JSON.stringify({ key: 'F1', items: initialCombos.exampleCombo.itemList })
    // );
  }, []);

  useEffect(() => {
    console.log("Updated combos:", combos);
  }, [combos]);

  const handleSaveCombo = () => {
    setCombos({
      ...combos,
      [comboName]: {
        name: comboName,
        reviveSliderValue: reviveSliderValue,
        itemList: items,
      },
    });
  };

  const handleDragStart =
    (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData("text/plain", index.toString());
    };

  const handleDragOver =
    (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    };

  const handleDrop =
    (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
      if (draggedIndex !== index) {
        const updatedItems = [...items];
        const [draggedItem] = updatedItems.splice(draggedIndex, 1);
        updatedItems.splice(index, 0, draggedItem);
        setItems(updatedItems);
      }
    };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Auto Combo</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Combo:</label>
        <select
          className="bg-gray-800 text-white p-2 rounded"
          value={selectedCombo}
          onChange={(e) => setSelectedCombo(e.target.value)}
        >
          {Object.keys(combos).map((comboName) => (
            <option key={comboName} value={comboName}>
              {comboName}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Combo Name:</label>
        <input
          className="bg-gray-800 text-white p-2 rounded"
          type="text"
          value={comboName}
          onChange={(e) => setComboName(e.target.value)}
          placeholder="Combo Name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Revive Slider: {reviveSliderValue}
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={reviveSliderValue}
          onChange={(e) => setReviveSliderValue(parseFloat(e.target.value))}
        />
        <label className="block text-sm font-medium mb-2">
          Medicine Hotkey:
        </label>
        <select
          className="bg-gray-800 text-white p-2 rounded"
          value={selectedMedicineHotkey.toString()}
          onChange={(e) => setSelectedMedicineHotkey(findKey(e.target.value))}
        >
          {Object.values(KeyboardKeys).map((key) => (
            <option key={key.keyName} value={key.keyNumber}>
              {key.keyName}
            </option>
          ))}
        </select>
        <label className="block text-sm font-medium mb-2">Revive Hotkey:</label>
        <select
          className="bg-gray-800 text-white p-2 rounded"
          value={selectedReviveHotkey.toString()}
          onChange={(e) => setSelectedReviveHotkey(findKey(e.target.value))}
        >
          {Object.values(KeyboardKeys).map((key) => (
            <option key={key.keyName} value={key.keyNumber}>
              {key.keyName}
            </option>
          ))}
        </select>
        <label className="block text-sm font-medium mb-2">
          Auto Revive Hotkey:
        </label>
        <select
          className="bg-gray-800 text-white p-2 rounded"
          value={selectedAutoReviveHotkey.toString()}
          onChange={(e) => setSelectedAutoReviveHotkey(findKey(e.target.value))}
        >
          {Object.values(KeyboardKeys).map((key) => (
            <option key={key.keyName} value={key.keyNumber}>
              {key.keyName}
            </option>
          ))}
        </select>
        <label className="block text-sm font-medium mb-2">
          PokeStop Hotkey:
        </label>
        <select
          className="bg-gray-800 text-white p-2 rounded"
          value={selectedPokestopHotkey.toString()}
          onChange={(e) => setSelectedPokestopHotkey(findKey(e.target.value))}
        >
          {Object.values(KeyboardKeys).map((key) => (
            <option key={key.keyName} value={key.keyNumber}>
              {key.keyName}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Move Name:</label>
        <input
          className="bg-gray-800 text-white p-2 rounded"
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Item Name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Move Hotkey:</label>
        <select
          className="bg-gray-800 text-white p-2 rounded"
          value={selectedMoveHotkey.toString()}
          onChange={(e) => setSelectedMoveHotkey(findKey(e.target.value))}
        >
          {Object.values(KeyboardKeys).map((key) => (
            <option key={key.keyName} value={key.keyNumber}>
              {key.keyName}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          After Attack Delay: {newItemAfterAttackDelay}
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={newItemAfterAttackDelay}
          onChange={(e) =>
            setNewItemAfterAttackDelay(parseFloat(e.target.value))
          }
        />
      </div>
      <div className="mb-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 mr-2"
          onClick={handleAddItem}
        >
          Add New Item
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSaveCombo}
        >
          Save Combo
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {items.map(({ skillName, hotkey, afterAttackDelay }, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-md shadow-md flex items-center justify-between cursor-move"
            draggable
            onDragStart={handleDragStart(index)}
            onDragOver={handleDragOver(index)}
            onDrop={handleDrop(index)}
          >
            <div>
              <p className="font-bold">{skillName}</p>
              <p className="text-sm text-gray-400">
                Hotkey:{" "}
                {Array.isArray(hotkey)
                  ? hotkey.map((h) => h.keyName).join("+")
                  : hotkey.keyName}
              </p>
              <p className="text-sm text-gray-400">
                After Attack Delay: {afterAttackDelay}
              </p>
            </div>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              onClick={() => handleRemoveItem(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutoComboTab;
