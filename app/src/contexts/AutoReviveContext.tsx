import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import useConfig from "../hooks/useConfig";

export interface AutoReviveConfig {
  position: {
    x: number;
    y: number;
  };
  keybind: string;
  delays: {
    afterMove: number; // Delay after moving to revive position
    afterRemovePokemon: number; // Delay after removing/fainting pokemon
    afterUseRevive: number; // Delay after using revive item/key
    afterReleasePokemon: number; // Delay after releasing pokemon back
  };
  clickConfig: {
    removeClick: "left" | "right"; // Click type for removing pokemon
    releaseClick: "left" | "right"; // Click type for releasing pokemon
  };
}

export const defaultAutoReviveConfig: AutoReviveConfig = {
  position: { x: 0, y: 0 },
  keybind: "",
  delays: {
    afterMove: 100, // 100ms after moving to position
    afterRemovePokemon: 200, // 200ms after removing pokemon
    afterUseRevive: 300, // 300ms after using revive
    afterReleasePokemon: 150, // 150ms after releasing pokemon
  },
  clickConfig: {
    removeClick: "right", // Default: right click to remove pokemon
    releaseClick: "left", // Default: left click to release pokemon
  },
};

type AutoReviveContextType = {
  autoReviveConfig: AutoReviveConfig;
  setAutoReviveConfig: Dispatch<SetStateAction<AutoReviveConfig>>;
};

const AutoReviveContext = createContext<AutoReviveContextType>(
  {} as AutoReviveContextType
);

const AutoReviveProvider = ({ children }: PropsWithChildren) => {
  const { loadConfig, saveConfig } = useConfig();
  const [autoReviveConfig, setAutoReviveConfig] = useState<AutoReviveConfig>(
    defaultAutoReviveConfig
  );
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const getAutoReviveConfig = async () => {
          const config = await loadConfig("autorevive.json");
          return config && Object.keys(config).length > 0
            ? config
            : await loadConfig("configs/defaultAutoReviveConfig.json");
        };

        const finalConfig = await getAutoReviveConfig();
        console.log("AutoRevive - Loaded config:", finalConfig);

        // Ensure all delay properties exist with defaults
        const configWithDefaults = {
          ...defaultAutoReviveConfig,
          ...finalConfig,
          delays: {
            ...defaultAutoReviveConfig.delays,
            ...(finalConfig.delays || {}),
          },
        };

        setAutoReviveConfig(configWithDefaults);
      } catch (error) {
        console.error("Error loading AutoRevive config:", error);
        setAutoReviveConfig(defaultAutoReviveConfig);
      } finally {
        setInitialized(true);
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialized && !isLoading) {
      console.log("AutoRevive - Saving config:", autoReviveConfig);
      saveConfig(autoReviveConfig, "autorevive.json")
        .then((response) => {
          console.log("AutoRevive config saved:", response);
        })
        .catch((error) => {
          console.error("Error saving AutoRevive config:", error);
        });
    }
  }, [autoReviveConfig, initialized, isLoading, saveConfig]);

  return (
    <AutoReviveContext.Provider
      value={{ autoReviveConfig, setAutoReviveConfig }}
    >
      {children}
    </AutoReviveContext.Provider>
  );
};

export { AutoReviveProvider, AutoReviveContext };
export type { AutoReviveContextType };
