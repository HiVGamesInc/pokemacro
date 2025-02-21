import React, { PropsWithChildren } from "react";

type InputProps = {
  label?: string;
  defaultValue?: string;
  value: string;
  wrapperClassName?: string;
  className?: string;
  placeholder?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const Input = ({
  label,
  wrapperClassName,
  className,
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
        className={`p-2 w-32 h-[42px] bg-black border border-slate-500 text-sm rounded-lg w-full ${className}`}
        {...rest}
      />
    </label>
  );
};

export default Input;
