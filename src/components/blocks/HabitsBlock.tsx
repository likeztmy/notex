import * as React from "react";
import { Plus, Check, X } from "lucide-react";
import type {
  HabitsBlock as HabitsBlockType,
  Habit,
  HabitEntry,
} from "~/types/block";

interface HabitsBlockProps {
  block: HabitsBlockType;
  onChange: (updates: Partial<HabitsBlockType>) => void;
}

export function HabitsBlock({ block, onChange }: HabitsBlockProps) {
  const [newHabitName, setNewHabitName] = React.useState("");

  // Generate dates for the current view
  const getDates = () => {
    const start = new Date(block.startDate);
    const dates: Date[] = [];
    const days = block.viewMode === "week" ? 7 : 30;

    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = getDates();

  const addHabit = () => {
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newHabitName.trim(),
      entries: [],
    };

    onChange({
      habits: [...block.habits, newHabit],
    });
    setNewHabitName("");
  };

  const toggleHabit = (habitId: string, dateStr: string) => {
    onChange({
      habits: block.habits.map((habit) => {
        if (habit.id !== habitId) return habit;

        const existingEntry = habit.entries.find((e) => e.date === dateStr);

        if (existingEntry) {
          return {
            ...habit,
            entries: habit.entries.map((e) =>
              e.date === dateStr ? { ...e, completed: !e.completed } : e
            ),
          };
        } else {
          return {
            ...habit,
            entries: [...habit.entries, { date: dateStr, completed: true }],
          };
        }
      }),
    });
  };

  const deleteHabit = (habitId: string) => {
    onChange({
      habits: block.habits.filter((h) => h.id !== habitId),
    });
  };

  const isCompleted = (habit: Habit, dateStr: string) => {
    const entry = habit.entries.find((e) => e.date === dateStr);
    return entry?.completed ?? false;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const toDateString = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--color-linear-text-primary)" }}
          >
            Habits
          </h3>
          <div className="block-label">Habits</div>
        </div>
        <div
          className="flex gap-1 rounded-full p-1"
          style={{ background: "var(--color-linear-bg-tertiary)" }}
        >
          <button
            onClick={() => onChange({ viewMode: "week" })}
            className="text-xs px-3 py-1 rounded-full"
            style={{
              background:
                block.viewMode === "week"
                  ? "var(--color-linear-bg-elevated)"
                  : "transparent",
              color: "var(--color-linear-text-secondary)",
              boxShadow:
                block.viewMode === "week" ? "var(--shadow-linear-sm)" : "none",
            }}
          >
            Week
          </button>
          <button
            onClick={() => onChange({ viewMode: "month" })}
            className="text-xs px-3 py-1 rounded-full"
            style={{
              background:
                block.viewMode === "month"
                  ? "var(--color-linear-bg-elevated)"
                  : "transparent",
              color: "var(--color-linear-text-secondary)",
              boxShadow:
                block.viewMode === "month" ? "var(--shadow-linear-sm)" : "none",
            }}
          >
            Month
          </button>
        </div>
      </div>

      {/* Grid */}
      {block.habits.length > 0 && (
        <div
          className="overflow-x-auto rounded-xl border"
          style={{ borderColor: "var(--color-linear-border-primary)" }}
        >
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr
                style={{
                  background: "var(--color-linear-bg-secondary)",
                }}
              >
                <th
                  className="text-left p-2 text-xs font-medium"
                  style={{ color: "var(--color-linear-text-tertiary)" }}
                >
                  Habit
                </th>
                {dates.map((date, i) => (
                  <th
                    key={i}
                    className="text-center p-2 text-xs font-medium"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    {formatDate(date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.habits.map((habit) => (
                <tr
                  key={habit.id}
                  className="group"
                  style={{
                    borderTop: "1px solid var(--color-linear-border-secondary)",
                  }}
                >
                  <td className="p-2 flex items-center gap-2">
                    <span style={{ color: "var(--color-linear-text-primary)" }}>
                      {habit.name}
                    </span>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 text-xs ml-auto"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </td>
                  {dates.map((date, i) => {
                    const dateStr = toDateString(date);
                    const completed = isCompleted(habit, dateStr);
                    return (
                      <td key={i} className="text-center p-2">
                        <button
                          onClick={() => toggleHabit(habit.id, dateStr)}
                          className="w-5 h-5 rounded border flex items-center justify-center mx-auto transition-all"
                          style={{
                            borderColor: completed
                              ? "var(--color-linear-accent-primary)"
                              : "var(--color-linear-border-primary)",
                            background: completed
                              ? "var(--color-linear-accent-primary)"
                              : "transparent",
                          }}
                        >
                          {completed && (
                            <Check className="w-3.5 h-3.5 text-white" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Habit Input */}
      <div className="flex items-center gap-2 pt-2">
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
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addHabit();
            }
          }}
          placeholder="Add a habit..."
          className="flex-1 border-none outline-none bg-transparent text-sm"
          style={{ color: "var(--color-linear-text-primary)" }}
        />
        {newHabitName && (
          <button
            onClick={addHabit}
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
