import { useContext } from "react";
import * as HealingContext from "../contexts/HealingContext";
import Input from "../components/Input/Input";
import PageWrapper from "../components/PageWrapper";
import { HeartIcon } from "@heroicons/react/24/outline";

const Healing = () => {
  const { healConfig, setHealConfig } = useContext(HealingContext.Context);

  if (!healConfig || Object.keys(healConfig).length === 0) {
    return (
      <PageWrapper title="Healing Configuration">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400">Loading healing configuration...</div>
        </div>
      </PageWrapper>
    );
  }

  const fields = Object.entries(healConfig.fields);

  const handleChangeField = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    setHealConfig({
      ...healConfig,
      fields: {
        ...healConfig.fields,
        [id]: {
          ...healConfig.fields[id],
          value: e.target.value,
        },
      },
    });
  };

  return (
    <PageWrapper
      title="Healing Configuration"
      subtitle="Configure automatic healing thresholds and delays"
    >
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex items-center gap-3 p-6 border-b border-gray-700">
          <HeartIcon className="w-5 h-5 text-red-400" />
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-100">
              Healing Settings
            </h3>
            <p className="text-sm text-gray-400">
              Configure when and how healing should be triggered
            </p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-4">
            {fields.map(([id, field]) => (
              <div
                key={id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
              >
                <div>
                  <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-300"
                  >
                    {field.label}
                  </label>
                </div>
                <div className="md:col-span-2">
                  <Input
                    name={id}
                    value={field.value}
                    placeholder="Enter value..."
                    onChange={(e) => handleChangeField(e, id)}
                    className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Healing;
