import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";

export enum Routes {
  HOME = "home",
  AUTO_COMBO = "auto-combo",
  MOVE_BINDINGS = "move-bindings",
  ALERT = "alert",
  AUTO_CATCH = "auto-catch",
  HEALING = 'healing'
}

type ContextType = {
  currentRoute: string;
  setCurrentRoute: Dispatch<SetStateAction<Routes>>;
};

const Context = createContext<ContextType>({} as ContextType);

const Provider = ({ children }: PropsWithChildren) => {
  const [currentRoute, setCurrentRoute] = useState(Routes.AUTO_COMBO);

  return (
    <Context.Provider value={{ currentRoute, setCurrentRoute }}>
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
export type { ContextType };
