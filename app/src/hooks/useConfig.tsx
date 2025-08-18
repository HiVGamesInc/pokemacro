import { useCallback } from "react";
import { loadConfig, saveConfig } from "../utils/actions";

const useConfig = () => {
  const handleSaveConfig = useCallback(
    (config: Record<string, any>, filename: string) =>
      saveConfig(config, filename),
    []
  );

  const handleLoadConfig = useCallback(
    (filename: string) => loadConfig(filename),
    []
  );

  return {
    saveConfig: handleSaveConfig,
    loadConfig: handleLoadConfig,
  };
};

export default useConfig;
