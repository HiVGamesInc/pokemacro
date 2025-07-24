import { useContext } from "react";
import * as TodoContext from "../contexts/TodoContext";
import * as WeeklyTodoContext from "../contexts/WeeklyTodoContext";
import TodoSection from "../components/TodoSection/TodoSection";

const Todo = () => {
  const {
    todoConfig: dailyTodoConfig,
    addTodo: addDailyTodo,
    toggleTodo: toggleDailyTodo,
    deleteTodo: deleteDailyTodo,
    updateTodo: updateDailyTodo,
    resetAllTodos: resetDailyTodos,
  } = useContext(TodoContext.Context);

  const {
    weeklyTodoConfig,
    addWeeklyTodo,
    toggleWeeklyTodo,
    deleteWeeklyTodo,
    updateWeeklyTodo,
    resetAllWeeklyTodos,
  } = useContext(WeeklyTodoContext.Context);

  // Loading check
  if (!dailyTodoConfig || !weeklyTodoConfig) {
    return <div className="p-6 min-h-screen bg-gray-900 text-white">Loading...</div>;
  }

  const handleAddChildDaily = (text: string, parentId: string) => {
    addDailyTodo(text, parentId);
  };

  const handleAddChildWeekly = (text: string, parentId: string) => {
    addWeeklyTodo(text, parentId);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Task Management</h1>
        
        <div className="flex gap-8">
          {/* Daily Tasks Section */}
          <TodoSection
            title="Daily Tasks"
            todos={dailyTodoConfig.todos || []}
            onAddTodo={(text) => addDailyTodo(text)}
            onToggle={toggleDailyTodo}
            onDelete={deleteDailyTodo}
            onUpdate={updateDailyTodo}
            onAddChild={handleAddChildDaily}
            onReset={resetDailyTodos}
            lastReset={dailyTodoConfig.lastReset}
            resetButtonColor="bg-orange-600 hover:bg-orange-700"
          />

          {/* Divider */}
          <div className="w-px bg-gray-700 flex-shrink-0"></div>

          {/* Weekly Tasks Section */}
          <TodoSection
            title="Weekly Tasks"
            todos={weeklyTodoConfig.todos || []}
            onAddTodo={(text) => addWeeklyTodo(text)}
            onToggle={toggleWeeklyTodo}
            onDelete={deleteWeeklyTodo}
            onUpdate={updateWeeklyTodo}
            onAddChild={handleAddChildWeekly}
            onReset={resetAllWeeklyTodos}
            lastReset={weeklyTodoConfig.lastReset}
            resetButtonColor="bg-purple-600 hover:bg-purple-700"
          />
        </div>
      </div>
    </div>
  );
};

export default Todo;
