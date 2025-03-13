import { useContext } from "react";
import * as KeybindingsContext from "../contexts/KeybindingsContext";
import KeybindingPicker from "../components/KeybindingPicker";

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
  "Pokeball"
];

const MoveBindings = () => {
  const { keybindings, setKeybindings } = useContext(
    KeybindingsContext.Context
  );

  if (!keybindings || Object.keys(keybindings).length === 0) {
    return <div>Loading keybindings...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Configuration</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-800 border border-gray-800">
              <th className="px-4 py-2 text-white">Action</th>
              <th className="px-4 py-2 text-white">Key Binding</th>
            </tr>
          </thead>
          <tbody>
            {KEYBINDINGS_ORDER.map((action) => {
              const keyObj = keybindings[action];

              return (
                <tr key={action} className="border border-gray-800">
                  <td className="px-4 py-2 font-medium">{action}</td>
                  <td className="px-4 py-2">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoveBindings;
