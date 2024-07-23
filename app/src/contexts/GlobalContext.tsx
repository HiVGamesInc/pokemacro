import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";

type ContextType = {
  antiLogout: boolean;
  setAntiLogout: Dispatch<SetStateAction<boolean>>;
  autoCombo: boolean;
  setAutoCombo: Dispatch<SetStateAction<boolean>>;
};

const Context = createContext<ContextType>({} as ContextType);

const Provider = ({ children }: PropsWithChildren) => {
  const [antiLogout, setAntiLogout] = useState(false);
  const [autoCombo, setAutoCombo] = useState(false);

  return (
    <Context.Provider
      value={{ antiLogout, setAntiLogout, autoCombo, setAutoCombo }}
    >
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
export type { ContextType };
