import { loadConfig, saveConfig } from "../utils/actions";

const useConfig = () => {
  return {
    saveConfig: (config: Record<string, any>, filename: string) =>
      saveConfig(config, filename),
    loadConfig: (filename: string) => loadConfig(filename),
  };
};

export default useConfig;
