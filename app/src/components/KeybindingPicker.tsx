import React, { useState, useEffect } from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { HotkeyObject } from "../types/types";
import { findKey } from "../utils/keys";

type KeybindingPickerProps = {
  name: string;
  currentKey: string;
  label?: string;
  wrapperClassName?: string;
  onKeySelected: (key: HotkeyObject) => void;
};

const KeybindingPicker: React.FC<KeybindingPickerProps> = ({
  name,
  currentKey,
  onKeySelected,
  label,
  wrapperClassName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detectedKey, setDetectedKey] = useState<string | null>(currentKey);

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    const pressedKey = event.key;
    const matchedKey = findKey(pressedKey, undefined);
    if (matchedKey && matchedKey.keyName) {
      setDetectedKey(matchedKey.keyName);
      onKeySelected(matchedKey);
    } else {
      // Fallback in case no matching key is found.
      setDetectedKey(pressedKey);
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);

    //eslint-disable-next-line
  }, [isModalOpen]);

  return (
    <>
      <label
        className={`flex flex-col justify-center gap-2 ${
          wrapperClassName || ""
        }`}
      >
        {label && <span className="min-w-12 text-xs mt-4">{label}</span>}
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          <Input
            name={name}
            wrapperClassName="!mt-0"
            readOnly
            value={detectedKey || ""}
            className="cursor-pointer"
            onChange={() => {}}
          />
        </div>
      </label>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-black p-6 rounded shadow-lg text-center">
            <p className="mb-4 text-white">Press any key to set the binding</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  setDetectedKey(null);
                  setIsModalOpen(false);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeybindingPicker;
