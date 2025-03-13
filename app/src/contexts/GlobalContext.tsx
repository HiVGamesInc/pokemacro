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
  alertStatus: boolean;
  setAlertStatus: Dispatch<SetStateAction<boolean>>;
  autoCatch: boolean;
  setAutoCatch: Dispatch<SetStateAction<boolean>>; 
};

const Context = createContext<ContextType>({} as ContextType);

const Provider = ({ children }: PropsWithChildren) => {
  const [antiLogout, setAntiLogout] = useState(false);
  const [autoCombo, setAutoCombo] = useState(false);
  const [alertStatus, setAlertStatus] = useState(false);
  const [autoCatch, setAutoCatch] = useState(false);
  return (
    <Context.Provider
      value={{
        antiLogout,
        setAntiLogout,
        autoCombo,
        setAutoCombo,
        alertStatus,
        setAlertStatus,
        autoCatch, 
        setAutoCatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
export type { ContextType };
