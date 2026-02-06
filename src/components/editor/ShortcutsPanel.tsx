import * as React from "react";

function ShortcutRow({ label, shortcut }: { label: string; shortcut: string }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span style={{ color: "var(--color-linear-text-secondary)" }}>
        {label}
      </span>
      <kbd
        className="px-2.5 py-1 rounded text-xs font-mono"
        style={{
          background: "var(--color-linear-bg-tertiary)",
          color: "var(--color-linear-text-secondary)",
        }}
      >
        {shortcut}
      </kbd>
    </div>
  );
}

const SHORTCUTS: { label: string; shortcut: string }[] = [
  { label: "Quick Switcher", shortcut: "⌘ K" },
  { label: "Show Shortcuts", shortcut: "⌘ /" },
  { label: "Focus Mode", shortcut: "⌘ ⇧ F" },
  { label: "Bold", shortcut: "⌘ B" },
  { label: "Italic", shortcut: "⌘ I" },
  { label: "Inline Code", shortcut: "⌘ E" },
  { label: "Heading 1", shortcut: "# + Space" },
  { label: "Heading 2", shortcut: "## + Space" },
  { label: "Heading 3", shortcut: "### + Space" },
  { label: "Bullet List", shortcut: "- + Space" },
  { label: "Numbered List", shortcut: "1. + Space" },
  { label: "Task List", shortcut: "[ ] + Space" },
  { label: "Code Block", shortcut: "``` + Space" },
  { label: "Blockquote", shortcut: "> + Space" },
  { label: "Divider", shortcut: "--- + Space" },
  { label: "Slash Commands", shortcut: "/ + Space" },
];

export interface ShortcutsPanelProps {
  onClose: () => void;
}

export function ShortcutsPanel({ onClose }: ShortcutsPanelProps) {
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center animate-fadeIn"
      style={{ background: "rgba(0, 0, 0, 0.2)" }}
      onClick={onClose}
    >
      <div
        className="rounded-lg p-8 max-w-md w-full mx-4"
        style={{
          background: "var(--color-linear-bg-primary)",
          border: "1px solid var(--color-linear-border-primary)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className="text-lg font-normal mb-6"
          style={{ color: "var(--color-linear-text-primary)" }}
        >
          Keyboard Shortcuts
        </h3>
        <div className="space-y-3 text-sm">
          {SHORTCUTS.map((s) => (
            <ShortcutRow key={s.label} label={s.label} shortcut={s.shortcut} />
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded transition-colors duration-200 text-sm"
          style={{
            background: "var(--color-linear-bg-tertiary)",
            color: "var(--color-linear-text-primary)",
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
