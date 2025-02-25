import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import useConfig from "../hooks/useConfig";
import { HotkeyObject } from "../types/types";

type ContextType = {
  keybindings: Record<string, HotkeyObject>;
  setKeybindings: Dispatch<SetStateAction<Record<string, HotkeyObject>>>;
};

const Context = createContext<ContextType>({} as ContextType);

const Provider = ({ children }: PropsWithChildren) => {
  const { loadConfig, saveConfig } = useConfig();
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(false);
  const [keybindings, setKeybindings] = useState<Record<string, HotkeyObject>>(
    {}
  );

  useEffect(() => {
    (async () => {
      setIsLoadingConfig(true);
      async function getKeybindingsConfig() {
        const config = await loadConfig("keybindings.json");
        return config && Object.keys(config).length
          ? config
          : await loadConfig("defaultKeybindings.json");
      }
      const finalConfig = await getKeybindingsConfig();
      setKeybindings(finalConfig);
      setIsLoadingConfig(false);
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      !isLoadingConfig &&
      keybindings &&
      Object.keys(keybindings).length > 0
    ) {
      saveConfig(keybindings, "keybindings.json");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(keybindings), isLoadingConfig]);

  return (
    <Context.Provider value={{ keybindings, setKeybindings }}>
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
export type { ContextType };
