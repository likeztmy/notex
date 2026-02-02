import * as React from "react";
import { GripVertical, MoreVertical, Trash2, Copy } from "lucide-react";
import type { Block } from "~/types/block";

interface BaseBlockProps {
  block: Block;
  children: React.ReactNode;
  onDelete?: () => void;
  onDuplicate?: () => void;
  dragHandleProps?: any;
  isDragging?: boolean;
}

export function BaseBlock({
  block,
  children,
  onDelete,
  onDuplicate,
  dragHandleProps,
  isDragging,
}: BaseBlockProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div
      className={`group relative rounded-lg border transition-all ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
      style={{
        background: "white",
        borderColor: "var(--color-linear-border-primary)",
        padding: "16px",
      }}
    >
      {/* Block Toolbar */}
      <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
        {/* Drag Handle */}
        <button
          {...dragHandleProps}
          className="p-1 rounded hover:bg-gray-100 cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical
            className="w-4 h-4"
            style={{ color: "var(--color-linear-text-tertiary)" }}
          />
        </button>

        {/* More Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-gray-100"
            title="More options"
          >
            <MoreVertical
              className="w-4 h-4"
              style={{ color: "var(--color-linear-text-tertiary)" }}
            />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div
                className="absolute left-full ml-2 top-0 z-20 rounded-lg shadow-lg border py-1 min-w-[120px]"
                style={{
                  background: "white",
                  borderColor: "var(--color-linear-border-primary)",
                }}
              >
                {onDuplicate && (
                  <button
                    onClick={() => {
                      onDuplicate();
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    style={{ color: "var(--color-linear-text-primary)" }}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Duplicate
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Block Content */}
      <div className="relative">{children}</div>
    </div>
  );
}
