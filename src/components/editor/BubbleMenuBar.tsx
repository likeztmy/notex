import * as React from "react";

export interface BubbleMenuBarProps {
  editor: any;
}

export function BubbleMenuBar({ editor }: BubbleMenuBarProps) {
  return (
    <div
      className="flex items-center gap-1 rounded-xl shadow-lg p-1.5 backdrop-blur-sm"
      style={{
        background: "var(--color-linear-bg-elevated)",
        border: "1px solid var(--color-linear-border-primary)",
        boxShadow: "var(--shadow-linear-lg)",
      }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
        style={{
          background: editor.isActive("bold")
            ? "var(--color-linear-bg-tertiary)"
            : "transparent",
          color: "var(--color-linear-text-primary)",
        }}
      >
        B
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="px-3.5 py-2 rounded-lg text-sm italic transition-all duration-200 hover:scale-105"
        style={{
          background: editor.isActive("italic")
            ? "var(--color-linear-bg-tertiary)"
            : "transparent",
          color: "var(--color-linear-text-primary)",
        }}
      >
        I
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className="px-3.5 py-2 rounded-lg text-sm font-mono transition-all duration-200 hover:scale-105"
        style={{
          background: editor.isActive("code")
            ? "var(--color-linear-bg-tertiary)"
            : "transparent",
          color: "var(--color-linear-text-primary)",
        }}
      >
        {"<>"}
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className="px-3.5 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
        style={{
          background: editor.isActive("highlight")
            ? "var(--color-linear-bg-tertiary)"
            : "transparent",
          color: "var(--color-linear-text-primary)",
        }}
      >
        ⬛
      </button>
    </div>
  );
}
