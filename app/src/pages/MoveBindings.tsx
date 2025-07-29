import { useContext } from "react";
import * as KeybindingsContext from "../contexts/KeybindingsContext";
import KeybindingPicker from "../components/KeybindingPicker";
import PageWrapper from "../components/PageWrapper";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

// Define the desired order of actions. Adjust these strings to match your intended names.
const KEYBINDINGS_ORDER = [
  "Move 1",
  "Move 2",
  "Move 3",
  "Move 4",
  "Move 5",
  "Move 6",
  "Move 7",
  "Move 8",
  "Move 9",
  "Move 10",
  "Move 11",
  "Move 12",
  "Pokestop",
  "Revive",
  "Medicine",
  "Auto Loot",
  "Pokeball",
  "Poke Heal",
];

const MoveBindings = () => {
  const { keybindings, setKeybindings } = useContext(
    KeybindingsContext.Context
  );

  if (!keybindings || Object.keys(keybindings).length === 0) {
    return (
      <PageWrapper title="Key Bindings">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400">Loading key bindings...</div>
        </div>
      </PageWrapper>
    );
  }

  const moveActions = KEYBINDINGS_ORDER.filter((action) =>
    action.startsWith("Move")
  );
  const otherActions = KEYBINDINGS_ORDER.filter(
    (action) => !action.startsWith("Move")
  );

  const KeybindingRow = ({ action }: { action: string }) => {
    const keyObj = keybindings[action];

    return (
      <div className="flex flex-col gap-2 p-4 border-b border-gray-700 last:border-b-0">
        <span className="text-sm font-medium text-gray-300">{action}</span>
        <KeybindingPicker
          name={action}
          currentKey={keyObj?.keyName}
          onKeySelected={(selectedKey) => {
            setKeybindings((prev) => {
              const newBindings = { ...prev };
              newBindings[action] = selectedKey;
              return newBindings;
            });
          }}
        />
      </div>
    );
  };

  return (
    <PageWrapper
      title="Key Bindings"
      subtitle="Configure keyboard shortcuts for game actions"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Move Actions */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 p-6 border-b border-gray-700">
            <Cog6ToothIcon className="w-5 h-5 text-yellow-400" />
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-100">
                Move Actions
              </h3>
              <p className="text-sm text-gray-400">
                Configure keys for Pokemon moves and abilities
              </p>
            </div>
          </div>
          <div>
            {moveActions.map((action) => (
              <KeybindingRow key={action} action={action} />
            ))}
          </div>
        </div>

        {/* Other Actions */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 p-6 border-b border-gray-700">
            <Cog6ToothIcon className="w-5 h-5 text-green-400" />
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-100">
                Game Actions
              </h3>
              <p className="text-sm text-gray-400">
                Configure keys for game interactions and items
              </p>
            </div>
          </div>
          <div>
            {otherActions.map((action) => (
              <KeybindingRow key={action} action={action} />
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default MoveBindings;
