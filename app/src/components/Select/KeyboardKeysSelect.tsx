import { KeyboardKeys } from "../../utils/keys";
import Select from "./Select";

type KeyboardKeysSelectProps = {
  className?: string;
  wrapperClassName?: string;
  label?: string;
  defaultValue?: string;
  value: string;
  title?: string;
  onChange: (value: React.ChangeEvent<HTMLSelectElement>) => void;
};

const KeyboardKeysSelect = ({
  label,
  className,
  defaultValue,
  ...props
}: KeyboardKeysSelectProps) => {
  return (
    <Select
      {...props}
      className={`bg-black text-slate-50 border border-slate-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 ${
        className && className
      }`}
      placeholder={label}
      defaultValue={defaultValue}
      options={Object.values(KeyboardKeys).map((key) => ({
        value: key.keyNumber,
        label: key.keyName,
      }))}
    />
  );
};

export default KeyboardKeysSelect;
