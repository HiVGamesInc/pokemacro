import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import useConfig from "../hooks/useConfig";

export interface SelectedImage {
  filename: string;
  label: string;
}

export interface AutoCatchConfig {
  selectedImages: SelectedImage[];
  hotkey: string;
}

export const defaultAutoCatchConfig: AutoCatchConfig = {
  selectedImages: [],
  hotkey: "",
};

type AutoCatchContextType = {
  autoCatchConfig: AutoCatchConfig;
  setAutoCatchConfig: Dispatch<SetStateAction<AutoCatchConfig>>;
};

const AutoCatchContext = createContext<AutoCatchContextType>(
  {} as AutoCatchContextType
);

const AutoCatchProvider = ({ children }: PropsWithChildren) => {
  const { loadConfig, saveConfig } = useConfig();
  const [autoCatchConfig, setAutoCatchConfig] = useState<AutoCatchConfig>(
    defaultAutoCatchConfig
  );
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      const config = await loadConfig("autocatch.json");
      console.log("Loaded config:", config);
      if (config && Object.keys(config).length > 0) {
        setAutoCatchConfig({
          selectedImages: config.selectedImages || [],
          hotkey: config.hotkey || defaultAutoCatchConfig.hotkey,
        });
      }
      setInitialized(true);
    })();
  }, [loadConfig]); 

  useEffect(() => {
    if (initialized) {
      console.log("Saving config:", autoCatchConfig);
      saveConfig(autoCatchConfig, "autocatch.json")
        .then((response) => {
          console.log("AutoCatch config saved:", response);
        })
        .catch((error) => {
          console.error("Error saving AutoCatch config:", error);
        });
    }
  }, [autoCatchConfig, initialized, saveConfig]);

  return (
    <AutoCatchContext.Provider value={{ autoCatchConfig, setAutoCatchConfig }}>
      {children}
    </AutoCatchContext.Provider>
  );
};

export { AutoCatchProvider, AutoCatchContext };
export type { AutoCatchContextType };
