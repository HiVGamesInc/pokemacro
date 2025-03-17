import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useEffect,
    useState,
  } from "react";
  import useConfig from "../hooks/useConfig";
import type { ScreenBoxValue } from "../components/ScreenBoxPicker/ScreenBoxPicker";

  export interface AlertConfigInterface {
    battleBox: ScreenBoxValue,
    hunt: {
        label: string,
        list: string[]
    }
  }
  
  type ContextType = {
    alertConfig: AlertConfigInterface | undefined;
    setAlertConfig: Dispatch<SetStateAction<AlertConfigInterface | undefined>>;
  };
  
  const Context = createContext<ContextType>({} as ContextType);
  
  const Provider = ({ children }: PropsWithChildren) => {
    const { loadConfig, saveConfig } = useConfig();
    const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(false);
    const [alertConfig, setAlertConfig] = useState<AlertConfigInterface>();
  
    useEffect(() => {
      (async () => {
        setIsLoadingConfig(true);
        async function getAlertConfig() {
          const config = await loadConfig("alertConfig.json");
          return config && Object.keys(config).length
            ? config
            : await loadConfig("configs/defaultAlertConfig.json");
        }

        const finalConfig = await getAlertConfig();
        setAlertConfig(finalConfig);
        setIsLoadingConfig(false);
      })();
      // eslint-disable-next-line
    }, []);
  
    useEffect(() => {
      if (
        !isLoadingConfig &&
        alertConfig &&
        Object.keys(alertConfig).length > 0
      ) {
        saveConfig(alertConfig, "alertConfig.json");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(alertConfig), isLoadingConfig]);
    

    return (
      <Context.Provider value={{ alertConfig, setAlertConfig }}>
        {children}
      </Context.Provider>
    );
  };
  
  export { Provider, Context };
  export type { ContextType };
  