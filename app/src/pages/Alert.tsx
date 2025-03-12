import { useContext } from "react";
import * as AlertContext from "../contexts/AlertContext";
import Button from "../components/Button/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Input from "../components/Input/Input";

// Define the desired order of actions. Adjust these strings to match your intended names.


const Alert = () => {
  const { alertConfig, setAlertConfig } = useContext(
    AlertContext.Context
  );

  if (!alertConfig || Object.keys(alertConfig).length === 0) {
    return <div>Loading alert config...</div>;
  }

  const fields = Object.entries(alertConfig.fields);

  const handleChangeField = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setAlertConfig({
        ...alertConfig,
        fields: {
            ...alertConfig.fields,
            [id]: {
                ...alertConfig.fields[id],
                value: e.target.value
            }
        }
    })
  }

    // Function to update a specific index in the hunt list
    const handleChangeHunt = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        setAlertConfig((prevAlertConfig) => {
            if(prevAlertConfig){
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
        });
    };

    const handleAddHunt = () => {
        setAlertConfig({
            ...alertConfig,
            hunt: {
                ...alertConfig.hunt,
                list: [
                    ...alertConfig.hunt.list,
                    ''
                ]
            }
        });
    }

    const handleRemoveHunt = (index: number) => {
        setAlertConfig((prevAlertConfig) => {
            if(prevAlertConfig){
                console.log(prevAlertConfig.hunt.list)

                const newList = [...prevAlertConfig.hunt.list]
                newList.splice(index, 1);
                console.log(newList)

                return {
                    ...prevAlertConfig,
                    hunt: {
                        ...prevAlertConfig.hunt,
                        list: newList, 
                    },
                };
            }   
        });
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
      <h2 className="text-xl font-bold mb-4 mt-4">
        {alertConfig.hunt.label}
       
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-800 border border-gray-800">
              <th className="px-4 py-2 text-white text-left">Pokemon</th>
            </tr>
          </thead>
          <tbody>
            {alertConfig.hunt.list.map((pokemon, index) => {
              return (
                <tr key={`pokemon-${index}`} className="border border-gray-800">
                  <td className="px-4 py-2">
                    <div className="flex flex-row">
                        <Input
                            name="delay"
                            wrapperClassName="flex-1 !mt-0"
                            value={pokemon}
                            placeholder="Pokemon Name"
                            onChange={(e) => handleChangeHunt(e, index)}
                        />
                        <Button className="ml-2" onClick={() => handleRemoveHunt(index)}>
                            <XMarkIcon className="size-4" />
                        </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="w-full flex justify-end mt-2">
            <Button
                className="bg-blue-00 p-4 rounded-lg text-green-400 h-[42px] hover:bg-green-900 hover:text-white "
                onClick={handleAddHunt}
            >
                Add
            </Button>
        </div>
        
      </div>
    </div>
  );
};

export default Alert;
