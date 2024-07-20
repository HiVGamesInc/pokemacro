import React, { PropsWithChildren } from 'react';

type Button = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  active: boolean;
};

const Button = ({ active, onClick, children }: PropsWithChildren<Button>) => {
  return (
    <button
      type="button"
      className={`mt-4 text-white bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 outline ${active ? ' outline-green-400' : ' outline-red-300'}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
