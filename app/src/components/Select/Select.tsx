import { ChevronDownIcon } from "@heroicons/react/24/outline";

export type Option = {
  value: string | number;
  label: string;
};

type SelectProps = {
  title?: string;
  className?: string;
  wrapperClassName?: string;
  placeholder?: string;
  defaultValue?: string;
  value: string;
  onChange?: (value: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
};

const Select = ({
  options,
  title,
  wrapperClassName,
  onChange,
  defaultValue,
  value,
  ...props
}: SelectProps) => {
  return (
    <label
      className={`flex flex-col mt-4 ${wrapperClassName && wrapperClassName}`}
    >
      {title && <span className="min-w-12 text-xs mb-2">{title}</span>}
      <div className="relative">
        <select
          className={`appearance-none ${props.className}`}
          value={value}
          onChange={onChange}
        >
          <option value="">{props.placeholder}</option>
          {options.map((option: Option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDownIcon className="size-4 absolute right-4 top-[50%] translate-y-[-50%]" />
      </div>
    </label>
  );
};

export default Select;
