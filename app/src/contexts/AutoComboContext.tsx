import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Combo } from "../types/types";
import useConfig from "../hooks/useConfig";

type ContextType = {
  combos: Combo[];
  setCombos: Dispatch<SetStateAction<Combo[]>>;
  currentCombo: Combo;
  setCurrentCombo: Dispatch<SetStateAction<Combo>>;
};

const Context = createContext<ContextType>({} as ContextType);

const Provider = ({ children }: PropsWithChildren) => {
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(false);
  const [combos, setCombos] = useState<Combo[]>([] as Combo[]);

  const [currentCombo, setCurrentCombo] = useState<Combo>({} as Combo);

  const { loadConfig, saveConfig } = useConfig();

  useEffect(() => {
    (async () => {
      setIsLoadingConfig(true);
      const config = await loadConfig("autocombo.json");
      console.log(config);
      if (config && config.length) {
        setCombos(config);
        setCurrentCombo(config[0]);
      }
    })();
  }, []);

  useEffect(() => {
    console.log(1, JSON.stringify(combos));
    if (isLoadingConfig) setIsLoadingConfig(false);
    else if (combos && combos.length && !isLoadingConfig) {
      console.log(combos, combos.length, !isLoadingConfig);
      saveConfig(combos, "autocombo.json");
    }
  }, [JSON.stringify(combos), isLoadingConfig]);

  return (
    <Context.Provider
      value={{ combos, setCombos, currentCombo, setCurrentCombo }}
    >
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
export type { ContextType };
