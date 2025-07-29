import { useContext } from "react";
import * as TodoContext from "../contexts/TodoContext";
import * as WeeklyTodoContext from "../contexts/WeeklyTodoContext";
import TodoSection from "../components/TodoSection/TodoSection";
import PageWrapper from "../components/PageWrapper";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";

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
    return (
      <PageWrapper title="Todo Lists">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400">Loading todo lists...</div>
        </div>
      </PageWrapper>
    );
  }

  const handleAddChildDaily = (text: string, parentId: string) => {
    addDailyTodo(text, parentId);
  };

  const handleAddChildWeekly = (text: string, parentId: string) => {
    addWeeklyTodo(text, parentId);
  };

  const dailyCompletedCount =
    dailyTodoConfig.todos?.filter((todo) => todo.completed).length || 0;
  const weeklyCompletedCount =
    weeklyTodoConfig.todos?.filter((todo) => todo.completed).length || 0;

  return (
    <PageWrapper
      title="Todo Lists"
      subtitle="Manage your daily and weekly tasks"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Tasks Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 p-6 border-b border-gray-700">
            <ClockIcon className="w-5 h-5 text-blue-400" />
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-100">
                Daily Tasks
              </h2>
              <p className="text-sm text-gray-400">
                {dailyCompletedCount} of {dailyTodoConfig.todos?.length || 0}{" "}
                completed
              </p>
            </div>
            <button
              onClick={resetDailyTodos}
              className="px-2 py-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              Reset All
            </button>
          </div>
          <div className="p-4">
            <TodoSection
              title=""
              todos={dailyTodoConfig.todos || []}
              onAddTodo={(text) => addDailyTodo(text)}
              onToggle={toggleDailyTodo}
              onDelete={deleteDailyTodo}
              onUpdate={updateDailyTodo}
              onAddChild={handleAddChildDaily}
              onReset={resetDailyTodos}
            />
          </div>
        </div>

        {/* Weekly Tasks Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 p-6 border-b border-gray-700">
            <CalendarDaysIcon className="w-5 h-5 text-green-400" />
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-100">
                Weekly Tasks
              </h2>
              <p className="text-sm text-gray-400">
                {weeklyCompletedCount} of {weeklyTodoConfig.todos?.length || 0}{" "}
                completed
              </p>
            </div>
            <button
              onClick={resetAllWeeklyTodos}
              className="px-2 py-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              Reset All
            </button>
          </div>
          <div className="p-4">
            <TodoSection
              title=""
              todos={weeklyTodoConfig.todos || []}
              onAddTodo={(text) => addWeeklyTodo(text)}
              onToggle={toggleWeeklyTodo}
              onDelete={deleteWeeklyTodo}
              onUpdate={updateWeeklyTodo}
              onAddChild={handleAddChildWeekly}
              onReset={resetAllWeeklyTodos}
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Todo;
