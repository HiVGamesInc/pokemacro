import { useState } from "react";
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon as CheckIconSolid } from "@heroicons/react/24/solid";
import Button from "../Button/Button";
import Input from "../Input/Input";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  children: TodoItem[];
}

interface TodoItemComponentProps {
  todo: TodoItem;
  level: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onAddChild: (text: string, parentId: string) => void;
}

const TodoItemComponent = ({
  todo,
  level,
  onToggle,
  onDelete,
  onUpdate,
  onAddChild,
}: TodoItemComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChildText, setNewChildText] = useState("");

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${todo.text}"?`)) {
      onDelete(todo.id);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleAddChild = () => {
    if (newChildText.trim()) {
      onAddChild(newChildText.trim(), todo.id);
      setNewChildText("");
      setIsAddingChild(false);
    }
  };

  const handleCancelAddChild = () => {
    setIsAddingChild(false);
    setNewChildText("");
  };

  const indentStyle = { marginLeft: `${level * 24}px` };

  return (
    <div className="mb-2">
      <div
        className={`flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg`}
        style={indentStyle}
      >
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 w-6 h-6 rounded border-2 border-gray-500 flex items-center justify-center transition-colors ${
            todo.completed
              ? "bg-green-500 border-green-500"
              : "hover:border-gray-400"
          }`}
        >
          {todo.completed && <CheckIconSolid className="w-4 h-4 text-white" />}
        </button>

        {/* Todo text or edit input */}
        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-2 items-center">
              <Input
                value={editText}
                wrapperClassName="!mt-0"
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") handleCancelEdit();
                }}
                className="flex-1"
                autoFocus
              />
              <button
                onClick={handleSaveEdit}
                className="p-1 text-green-400 hover:text-green-300"
              >
                <CheckIcon className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-1 text-red-400 hover:text-red-300"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span
              className={`${
                todo.completed ? "line-through text-gray-400" : "text-white"
              }`}
            >
              {todo.text}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddingChild(true)}
            className="p-1 text-blue-400 hover:text-blue-300"
            title="Add subtask"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleEdit}
            className="p-1 text-yellow-400 hover:text-yellow-300"
            title="Edit"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-red-400 hover:text-red-300"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add child form */}
      {isAddingChild && (
        <div className={`mt-2 ml-6`} style={indentStyle}>
          <div className="flex gap-2 items-center p-3 bg-gray-700 border border-gray-600 rounded-lg">
            <Input
              value={newChildText}
              onChange={(e) => setNewChildText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddChild();
                if (e.key === "Escape") handleCancelAddChild();
              }}
              wrapperClassName="!mt-0"
              placeholder="Enter subtask..."
              className="flex-1"
              autoFocus
            />
            <button
              onClick={handleAddChild}
              className="p-1 text-green-400 hover:text-green-300"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancelAddChild}
              className="p-1 text-red-400 hover:text-red-300"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Render children */}
      {todo.children && todo.children.length > 0 && (
        <div className="mt-2">
          {todo.children.map((child) => (
            <TodoItemComponent
              key={child.id}
              todo={child}
              level={level + 1}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface TodoSectionProps {
  title: string;
  todos: TodoItem[];
  onAddTodo: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onAddChild: (text: string, parentId: string) => void;
  onReset: () => void;
  lastReset?: string | null;
  resetButtonColor?: string;
}

const TodoSection = ({
  title,
  todos,
  onAddTodo,
  onToggle,
  onDelete,
  onUpdate,
  onAddChild,
  onReset,
  lastReset,
  resetButtonColor = "bg-red-600 hover:bg-red-700",
}: TodoSectionProps) => {
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      onAddTodo(newTodoText.trim());
      setNewTodoText("");
      setIsAddingTodo(false);
    }
  };

  const handleCancelAdd = () => {
    setIsAddingTodo(false);
    setNewTodoText("");
  };

  const handleReset = () => {
    if (
      window.confirm(
        `Are you sure you want to reset all ${title.toLowerCase()}? This will mark all tasks as incomplete.`
      )
    ) {
      onReset();
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  const formatLastReset = (lastReset: string | null | undefined) => {
    if (!lastReset) return "Never";
    try {
      const date = new Date(lastReset);
      return date.toLocaleString();
    } catch {
      return lastReset;
    }
  };

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-gray-400 mt-1">
            {completedCount} of {totalCount} tasks completed
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Last reset: {formatLastReset(lastReset)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleReset} className={resetButtonColor}>
            Reset All
          </Button>
          <Button onClick={() => setIsAddingTodo(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progress</span>
          <span>
            {totalCount > 0
              ? Math.round((completedCount / totalCount) * 100)
              : 0}
            %
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{
              width:
                totalCount > 0
                  ? `${(completedCount / totalCount) * 100}%`
                  : "0%",
            }}
          ></div>
        </div>
      </div>

      {/* Add new todo form */}
      {isAddingTodo && (
        <div className="mb-4">
          <div className="flex gap-2 items-center p-3 bg-gray-800 border border-gray-700 rounded-lg">
            <Input
              value={newTodoText}
              wrapperClassName="!mt-0"
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTodo();
                if (e.key === "Escape") handleCancelAdd();
              }}
              placeholder="Enter new task..."
              className="flex-1"
              autoFocus
            />
            <button
              onClick={handleAddTodo}
              className="p-1 text-green-400 hover:text-green-300"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancelAdd}
              className="p-1 text-red-400 hover:text-red-300"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Todo list */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No tasks yet. Add your first task to get started!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <TodoItemComponent
              key={todo.id}
              todo={todo}
              level={0}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onAddChild={onAddChild}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoSection;
