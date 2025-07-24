import { createContext, Dispatch, PropsWithChildren, SetStateAction, useEffect, useState } from "react";
import useConfig from "../hooks/useConfig";

export interface AutoReviveConfig {
  position: {
    x: number;
    y: number;
  };
  keybind: string;
}

export const defaultAutoReviveConfig: AutoReviveConfig = {
  position: { x: 0, y: 0 },
  keybind: "",
};

type AutoReviveContextType = {
  autoReviveConfig: AutoReviveConfig;
  setAutoReviveConfig: Dispatch<SetStateAction<AutoReviveConfig>>;
};

const AutoReviveContext = createContext<AutoReviveContextType>({} as AutoReviveContextType);

const AutoReviveProvider = ({ children }: PropsWithChildren) => {
  const { loadConfig, saveConfig } = useConfig();
  const [autoReviveConfig, setAutoReviveConfig] = useState<AutoReviveConfig>(defaultAutoReviveConfig);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      const config = await loadConfig("autorevive.json");
      if (config && Object.keys(config).length > 0) {
        setAutoReviveConfig(config);
      }
      setInitialized(true);
    })();
  }, [loadConfig]);

  useEffect(() => {
    if (initialized) {
      saveConfig(autoReviveConfig, "autorevive.json")
        .then((response) => {
          console.log("AutoRevive config saved:", response);
        })
        .catch((error) => {
          console.error("Error saving AutoRevive config:", error);
        });
    }
  }, [autoReviveConfig, initialized, saveConfig]);

  return (
    <AutoReviveContext.Provider value={{ autoReviveConfig, setAutoReviveConfig }}>
      {children}
    </AutoReviveContext.Provider>
  );
};

export { AutoReviveProvider, AutoReviveContext };
export type { AutoReviveContextType };