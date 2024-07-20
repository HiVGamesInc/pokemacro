import React, { PropsWithChildren } from "react";

type InputProps = {
  label?: string;
  defaultValue?: string;
  wrapperClassName?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const Input = ({
  label,
  wrapperClassName,
  ...rest
}: PropsWithChildren<InputProps>) => {
  return (
    <label
      className={`flex flex-col justify-center gap-2 mt-4 ${
        wrapperClassName && wrapperClassName
      }`}
    >
      {label && <span className="min-w-12 text-xs">{label}</span>}
      <input
        type="text"
        className="p-2 w-32 bg-black border border-slate-500 text-sm rounded-lg w-full"
        {...rest}
      />
    </label>
  );
};

export default Input;
