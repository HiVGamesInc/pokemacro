import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useEffect,
    useState,
  } from "react";
  import useConfig from "../hooks/useConfig";

  interface HealingConfigField {
    label: string,
    value: string
  }
  
  export interface HealingConfigInterface {
    fields: Record<string, HealingConfigField>,
  }
  
  type ContextType = {
    healConfig: HealingConfigInterface | undefined;
    setHealConfig: Dispatch<SetStateAction<HealingConfigInterface | undefined>>;
  };
  
  const Context = createContext<ContextType>({} as ContextType);
  
  const Provider = ({ children }: PropsWithChildren) => {
    const { loadConfig, saveConfig } = useConfig();
    const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(false);
    const [healConfig, setHealConfig] = useState<HealingConfigInterface>();
  
    useEffect(() => {
      (async () => {
        setIsLoadingConfig(true);
        async function getHealingConfig() {
          const config = await loadConfig("healConfig.json");
          return config && Object.keys(config).length
            ? config
            : await loadConfig("configs/defaultHealConfig.json");
        }

        const finalConfig = await getHealingConfig();
        setHealConfig(finalConfig);
        setIsLoadingConfig(false);
      })();
      // eslint-disable-next-line
    }, []);
  
    useEffect(() => {
      if (
        !isLoadingConfig &&
        healConfig &&
        Object.keys(healConfig).length > 0
      ) {
        saveConfig(healConfig, "healConfig.json");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(healConfig), isLoadingConfig]);
    

    return (
      <Context.Provider value={{ healConfig, setHealConfig }}>
        {children}
      </Context.Provider>
    );
  };
  
  export { Provider, Context };
  export type { ContextType };
  