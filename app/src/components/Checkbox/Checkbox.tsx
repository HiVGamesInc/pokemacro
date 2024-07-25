import React, { PropsWithChildren } from "react";

type CheckboxProps = {
  label?: string;
  defaultValue?: boolean;
  wrapperClassName?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const Checkbox = ({
  label,
  wrapperClassName,
  defaultValue,
  ...rest
}: PropsWithChildren<CheckboxProps>) => {
  return (
    <label
      className={`flex flex-col justify-center gap-2 mt-4 ${
        wrapperClassName && wrapperClassName
      }`}
    >
      {label && <span className="min-w-12 text-xs">{label}</span>}
      <input
        type="checkbox"
        className="p-2 w-32 bg-black border border-slate-500 text-sm rounded-lg w-full"
        defaultChecked={defaultValue}
        {...rest}
      />
    </label>
  );
};

export default Checkbox;
