import * as React from "react";
import { Plus, Check, X } from "lucide-react";
import type { TasksBlock as TasksBlockType, TaskItem } from "~/types/block";

interface TasksBlockProps {
  block: TasksBlockType;
  onChange: (updates: Partial<TasksBlockType>) => void;
}

export function TasksBlock({ block, onChange }: TasksBlockProps) {
  const [newTaskText, setNewTaskText] = React.useState("");

  const addTask = () => {
    if (!newTaskText.trim()) return;

    const newTask: TaskItem = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: newTaskText.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    onChange({
      tasks: [...block.tasks, newTask],
    });
    setNewTaskText("");
  };

  const toggleTask = (taskId: string) => {
    onChange({
      tasks: block.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    });
  };

  const deleteTask = (taskId: string) => {
    onChange({
      tasks: block.tasks.filter((task) => task.id !== taskId),
    });
  };

  const updateTaskText = (taskId: string, text: string) => {
    onChange({
      tasks: block.tasks.map((task) =>
        task.id === taskId ? { ...task, text } : task
      ),
    });
  };

  const completedCount = block.tasks.filter((t) => t.completed).length;
  const totalCount = block.tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={block.title || ""}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Tasks"
            className="w-full text-sm font-semibold border-none outline-none bg-transparent"
            style={{ color: "var(--color-linear-text-primary)" }}
          />
          <div className="block-label">Tasks</div>
        </div>
        {block.showProgress && totalCount > 0 && (
          <span
            className="text-xs px-2 py-1 rounded-full"
            style={{
              background: "var(--color-linear-bg-tertiary)",
              color: "var(--color-linear-text-secondary)",
            }}
          >
            {Math.round(progress)}%
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {block.showProgress && totalCount > 0 && (
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--color-linear-bg-secondary)" }}
        >
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              width: `${progress}%`,
              background: "var(--color-linear-accent-primary)",
            }}
          />
        </div>
      )}

      {/* Task List */}
      <div className="space-y-1.5">
        {block.tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-2.5 group">
            {/* Checkbox */}
            <button
              onClick={() => toggleTask(task.id)}
              className="mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                borderColor: task.completed
                  ? "var(--color-linear-accent-primary)"
                  : "var(--color-linear-border-primary)",
                background: task.completed
                  ? "var(--color-linear-accent-primary)"
                  : "transparent",
              }}
            >
              {task.completed && <Check className="w-3 h-3 text-white" />}
            </button>

            {/* Task Text */}
            <input
              type="text"
              value={task.text}
              onChange={(e) => updateTaskText(task.id, e.target.value)}
              className={`flex-1 border-none outline-none bg-transparent text-sm ${
                task.completed ? "line-through opacity-60" : ""
              }`}
              style={{ color: "var(--color-linear-text-primary)" }}
            />

            {/* Delete Button */}
            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Task Input */}
      <div className="flex items-center gap-2 pt-1">
        <div
          className="w-4 h-4 flex items-center justify-center rounded border"
          style={{ borderColor: "var(--color-linear-border-primary)" }}
        >
          <Plus
            className="w-3 h-3"
            style={{ color: "var(--color-linear-text-tertiary)" }}
          />
        </div>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTask();
            }
          }}
          placeholder="Add a task..."
          className="flex-1 border-none outline-none bg-transparent text-sm"
          style={{ color: "var(--color-linear-text-primary)" }}
        />
        {newTaskText && (
          <button
            onClick={addTask}
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              background: "var(--color-linear-accent-primary)",
              color: "white",
            }}
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}
