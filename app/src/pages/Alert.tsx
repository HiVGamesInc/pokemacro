import { useContext } from "react";
import * as AlertContext from "../contexts/AlertContext";
import { XMarkIcon, PlusIcon, BellIcon } from "@heroicons/react/24/outline";
import Input from "../components/Input/Input";
import PageWrapper from "../components/PageWrapper";

const Alert = () => {
  const { alertConfig, setAlertConfig } = useContext(AlertContext.Context);

  if (!alertConfig || Object.keys(alertConfig).length === 0) {
    return (
      <PageWrapper title="Alert Settings">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400">Loading alert configuration...</div>
        </div>
      </PageWrapper>
    );
  }

  const fields = Object.entries(alertConfig.fields);

  const handleChangeField = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    setAlertConfig({
      ...alertConfig,
      fields: {
        ...alertConfig.fields,
        [id]: {
          ...alertConfig.fields[id],
          value: e.target.value,
        },
      },
    });
  };

  const handleChangeHunt = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setAlertConfig((prevAlertConfig) => {
      if (prevAlertConfig) {
        const newList = [...prevAlertConfig.hunt.list];
        if (index >= 0 && index < newList.length) {
          newList[index] = e.target.value;
        }
        return {
          ...prevAlertConfig,
          hunt: {
            ...prevAlertConfig.hunt,
            list: newList,
          },
        };
      }
      return prevAlertConfig;
    });
  };

  const addHunt = () => {
    setAlertConfig((prevAlertConfig) => {
      if (prevAlertConfig) {
        return {
          ...prevAlertConfig,
          hunt: {
            ...prevAlertConfig.hunt,
            list: [...prevAlertConfig.hunt.list, ""],
          },
        };
      }
      return prevAlertConfig;
    });
  };

  const removeHunt = (index: number) => {
    setAlertConfig((prevAlertConfig) => {
      if (prevAlertConfig) {
        const newList = [...prevAlertConfig.hunt.list];
        newList.splice(index, 1);
        return {
          ...prevAlertConfig,
          hunt: {
            ...prevAlertConfig.hunt,
            list: newList,
          },
        };
      }
      return prevAlertConfig;
    });
  };

  return (
    <PageWrapper
      title="Alert Settings"
      subtitle="Configure notification triggers and hunt targets"
    >
      <div className="flex gap-6">
        {/* Hunt List */}
        <div className="flex-[2] bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 p-6 border-b border-gray-700">
            <BellIcon className="w-5 h-5 text-yellow-400" />
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-100">
                {alertConfig.hunt.label}
              </h3>
              <p className="text-sm text-gray-400">
                Add Pokemon names or keywords to get notified when they appear
              </p>
            </div>
            <button
              onClick={addHunt}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add Target
            </button>
          </div>

          {alertConfig.hunt.list.length > 0 ? (
            <div className="space-y-3">
              {alertConfig.hunt.list.map((hunt, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      value={hunt}
                      onChange={(e) => handleChangeHunt(e, index)}
                      placeholder="Enter Pokemon name or keyword..."
                      className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    />
                  </div>
                  <button
                    onClick={() => removeHunt(index)}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                    title="Remove target"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <p className="mb-2">No hunt targets configured</p>
              <p className="text-sm">
                Add targets to get alerted when they appear
              </p>
            </div>
          )}
        </div>
        {/* Configuration Fields */}
        <div className="flex-[1] bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-base font-semibold mb-4 text-gray-100">
            Configuration
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {fields.map(([id, field]) => (
              <div key={id} className="space-y-2">
                <label
                  htmlFor={id}
                  className="block text-sm font-medium text-gray-300"
                >
                  {field.label}
                </label>
                <Input
                  value={field.value}
                  onChange={(e) => handleChangeField(e, id)}
                  className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Alert;
