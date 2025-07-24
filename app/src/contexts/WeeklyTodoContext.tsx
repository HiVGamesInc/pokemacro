import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import useConfig from "../hooks/useConfig";

export interface WeeklyTodoItem {
  id: string;
  text: string;
  completed: boolean;
  children: WeeklyTodoItem[];
}

export interface WeeklyTodoConfigInterface {
  todos: WeeklyTodoItem[];
  lastReset?: string | null;
}

type ContextType = {
  weeklyTodoConfig: WeeklyTodoConfigInterface | undefined;
  setWeeklyTodoConfig: Dispatch<
    SetStateAction<WeeklyTodoConfigInterface | undefined>
  >;
  addWeeklyTodo: (text: string, parentId?: string) => Promise<void>;
  toggleWeeklyTodo: (id: string) => Promise<void>;
  deleteWeeklyTodo: (id: string) => Promise<void>;
  updateWeeklyTodo: (id: string, text: string) => Promise<void>;
  resetAllWeeklyTodos: () => Promise<void>;
};

const Context = createContext<ContextType>({} as ContextType);

const Provider = ({ children }: PropsWithChildren) => {
  const { loadConfig, saveConfig } = useConfig();
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(false);
  const [weeklyTodoConfig, setWeeklyTodoConfig] =
    useState<WeeklyTodoConfigInterface>();

  useEffect(() => {
    (async () => {
      setIsLoadingConfig(true);
      async function getWeeklyTodoConfig() {
        const config = await loadConfig("weeklyTodoConfig.json");
        return config && Object.keys(config).length
          ? config
          : await loadConfig("configs/defaultWeeklyTodoConfig.json");
      }

      const finalConfig = await getWeeklyTodoConfig();
      setWeeklyTodoConfig(finalConfig);
      setIsLoadingConfig(false);
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      !isLoadingConfig &&
      weeklyTodoConfig &&
      Object.keys(weeklyTodoConfig).length > 0
    ) {
      saveConfig(weeklyTodoConfig, "weeklyTodoConfig.json");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(weeklyTodoConfig), isLoadingConfig]);

  const addWeeklyTodo = async (text: string, parentId?: string) => {
    try {
      const response = await fetch("/weekly-todo/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, parentId }),
      });

      const result = await response.json();

      if (result.success) {
        // Reload the config to get the updated state
        const updatedConfig = await loadConfig("weeklyTodoConfig.json");
        setWeeklyTodoConfig(updatedConfig);
      }
    } catch (error) {
      console.error("Error adding weekly todo:", error);
    }
  };

  const toggleWeeklyTodo = async (id: string) => {
    try {
      const response = await fetch("/weekly-todo/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (result.success) {
        // Reload the config to get the updated state
        const updatedConfig = await loadConfig("weeklyTodoConfig.json");
        setWeeklyTodoConfig(updatedConfig);
      }
    } catch (error) {
      console.error("Error toggling weekly todo:", error);
    }
  };

  const deleteWeeklyTodo = async (id: string) => {
    try {
      const response = await fetch("/weekly-todo/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (result.success) {
        // Reload the config to get the updated state
        const updatedConfig = await loadConfig("weeklyTodoConfig.json");
        setWeeklyTodoConfig(updatedConfig);
      }
    } catch (error) {
      console.error("Error deleting weekly todo:", error);
    }
  };

  const updateWeeklyTodo = async (id: string, text: string) => {
    try {
      const response = await fetch("/weekly-todo/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, text }),
      });

      const result = await response.json();

      if (result.success) {
        // Reload the config to get the updated state
        const updatedConfig = await loadConfig("weeklyTodoConfig.json");
        setWeeklyTodoConfig(updatedConfig);
      }
    } catch (error) {
      console.error("Error updating weekly todo:", error);
    }
  };

  const resetAllWeeklyTodos = async () => {
    try {
      const response = await fetch("/weekly-todo/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        // Reload the config to get the updated state
        const updatedConfig = await loadConfig("weeklyTodoConfig.json");
        setWeeklyTodoConfig(updatedConfig);
      }
    } catch (error) {
      console.error("Error resetting weekly todos:", error);
    }
  };

  return (
    <Context.Provider
      value={{
        weeklyTodoConfig,
        setWeeklyTodoConfig,
        addWeeklyTodo,
        toggleWeeklyTodo,
        deleteWeeklyTodo,
        updateWeeklyTodo,
        resetAllWeeklyTodos,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
export type { ContextType };
