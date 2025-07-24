import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import useConfig from "../hooks/useConfig";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  children: TodoItem[];
}

export interface TodoConfigInterface {
  todos: TodoItem[];
  lastReset?: string | null;
}

type ContextType = {
  todoConfig: TodoConfigInterface | undefined;
  setTodoConfig: Dispatch<SetStateAction<TodoConfigInterface | undefined>>;
  addTodo: (text: string, parentId?: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, text: string) => Promise<void>;
  resetAllTodos: () => Promise<void>;
};

const Context = createContext<ContextType>({} as ContextType);

const Provider = ({ children }: PropsWithChildren) => {
  const { loadConfig, saveConfig } = useConfig();
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(false);
  const [todoConfig, setTodoConfig] = useState<TodoConfigInterface>();

  useEffect(() => {
    (async () => {
      setIsLoadingConfig(true);
      async function getTodoConfig() {
        const config = await loadConfig("todoConfig.json");
        return config && Object.keys(config).length
          ? config
          : await loadConfig("configs/defaultTodoConfig.json");
      }

      const finalConfig = await getTodoConfig();
      setTodoConfig(finalConfig);
      setIsLoadingConfig(false);
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isLoadingConfig && todoConfig && Object.keys(todoConfig).length > 0) {
      saveConfig(todoConfig, "todoConfig.json");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(todoConfig), isLoadingConfig]);

  const addTodo = async (text: string, parentId?: string) => {
    try {
      const response = await fetch("/todo/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, parentId }),
      });

      const result = await response.json();

      if (result.success) {
        // Reload the config to get the updated state
        const updatedConfig = await loadConfig("todoConfig.json");
        setTodoConfig(updatedConfig);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const response = await fetch("/todo/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (result.success) {
        // Reload the config to get the updated state
        const updatedConfig = await loadConfig("todoConfig.json");
        setTodoConfig(updatedConfig);
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch("/todo/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (result.success) {
        // Reload the config to get the updated state
        const updatedConfig = await loadConfig("todoConfig.json");
        setTodoConfig(updatedConfig);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const updateTodo = async (id: string, text: string) => {
    try {
      const response = await fetch("/todo/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, text }),
      });

      const result = await response.json();

      if (result.success) {
        // Reload the config to get the updated state
        const updatedConfig = await loadConfig("todoConfig.json");
        setTodoConfig(updatedConfig);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const resetAllTodos = async () => {
    try {
      const response = await fetch("/todo/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        // Reload the config to get the updated state
        const updatedConfig = await loadConfig("todoConfig.json");
        setTodoConfig(updatedConfig);
      }
    } catch (error) {
      console.error("Error resetting todos:", error);
    }
  };

  return (
    <Context.Provider
      value={{
        todoConfig,
        setTodoConfig,
        addTodo,
        toggleTodo,
        deleteTodo,
        updateTodo,
        resetAllTodos,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
export type { ContextType };
