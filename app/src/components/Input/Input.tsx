import React, { PropsWithChildren } from 'react';

type Input = {
  label?: string;
  defaultValue?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const Input = ({ label, ...rest }: PropsWithChildren<Input>) => {
  return (
    <label className="flex items-center gap-2 mt-4">
      {label && <span className="min-w-12">{label}</span>}
      <input type="text" className="p-2 w-32 bg-black border border-slate-500 text-sm" {...rest} />
    </label>
  );
};

export default Input;
