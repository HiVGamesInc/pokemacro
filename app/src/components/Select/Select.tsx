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
      <select className={props.className} value={value} onChange={onChange}>
        <option value="">{props.placeholder}</option>
        {options.map((option: Option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
};

export default Select;
