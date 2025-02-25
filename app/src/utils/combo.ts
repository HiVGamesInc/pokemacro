import { Combo, HotkeyObject } from "../types/types";

export const comboWithHotkeys = (
  combo: Combo["moveList"],
  keybindings: Record<string, HotkeyObject>
) => {
  return combo.map((move) => ({
    ...move,
    hotkey: move.skillName ? keybindings[move.skillName] : undefined,
  }));
};
