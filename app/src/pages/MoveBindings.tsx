import React, { useState } from "react";
import Input from "../components/Input/Input";
import { HotkeyObject } from "../types/types";
import { KeyboardKeys } from "../utils/keys";
import Button from "../components/Button/Button";

type Form = {
  [key: string]: HotkeyObject;
};

const MoveBindings = () => {
  const [movesFormData, setMovesFormData] = useState<Form>({
    M1: KeyboardKeys.F1,
    M2: KeyboardKeys.F2,
    M3: KeyboardKeys.F3,
    M4: KeyboardKeys.F4,
    M5: KeyboardKeys.F5,
    M6: KeyboardKeys.F6,
    M7: KeyboardKeys.F7,
    M8: KeyboardKeys.F8,
    M9: KeyboardKeys.F9,
    M10: KeyboardKeys.F10,
    M11: KeyboardKeys.F11,
    M12: KeyboardKeys.F12,
  });

  const handleSave = () => {
    // window.electron.ipcRenderer.sendMessage('unbindAll');
    // Object.values(movesFormData).forEach(m => window.electron.ipcRenderer.sendMessage('pressKey', m));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Configuration</h2>
      <div className="flex gap-2 flex-wrap justify-between">
        {Object.entries(movesFormData).map(([key, value]) => (
          <Input
            key={key}
            label={key}
            value={value.keyName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const filteredKey: any = Object.values(KeyboardKeys).find(
                (k) => k.keyName === e.target.value
              );

              setMovesFormData({
                ...movesFormData,
                [key]: filteredKey,
              });
            }}
          />
        ))}
      </div>
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default MoveBindings;
