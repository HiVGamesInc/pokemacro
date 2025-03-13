import { useContext } from "react";
import * as HealingContext from "../contexts/HealingContext";
import Input from "../components/Input/Input";

// Define the desired order of actions. Adjust these strings to match your intended names.


const Healing = () => {
  const { healConfig, setHealConfig } = useContext(
    HealingContext.Context
  );

  if (!healConfig || Object.keys(healConfig).length === 0) {
    return <div>Loading alert config...</div>;
  }

  const fields = Object.entries(healConfig.fields);

  const handleChangeField = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setHealConfig({
        ...healConfig,
        fields: {
            ...healConfig.fields,
            [id]: {
                ...healConfig.fields[id],
                value: e.target.value
            }
        }
    })
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Configuration</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-800 border border-gray-800">
              <th className="px-4 py-2 text-white text-left">Label</th>
              <th className="px-4 py-2 text-white text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            {fields.map(([id, field]) => {
                return (
                  <tr key={id} className="border border-gray-800">
                    <td className="px-4 py-2 font-medium">{field.label}</td>
                    <td className="px-4 py-2">
                      <Input
                          name="delay"
                          wrapperClassName="flex-1 !mt-0"
                          value={field.value}
                          placeholder="Value"
                          onChange={(e) => handleChangeField(e, id)}
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

export default Healing;
