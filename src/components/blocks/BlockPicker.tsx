import * as React from "react";
import {
  Type,
  Heading,
  CheckSquare,
  Calendar,
  BarChart3,
  Code,
  StickyNote,
  Network,
  Link2,
  Image,
  Minus,
  AlertCircle,
} from "lucide-react";
import type { BlockType } from "~/types/block";

interface BlockOption {
  type: BlockType;
  icon: React.ReactNode;
  label: string;
  description: string;
  category: "basic" | "advanced" | "media";
}

const BLOCK_OPTIONS: BlockOption[] = [
  {
    type: "text",
    icon: <Type className="w-5 h-5" />,
    label: "Text",
    description: "Simple text block",
    category: "basic",
  },
  {
    type: "heading",
    icon: <Heading className="w-5 h-5" />,
    label: "Heading",
    description: "Section heading",
    category: "basic",
  },
  {
    type: "tasks",
    icon: <CheckSquare className="w-5 h-5" />,
    label: "Task List",
    description: "To-do list with progress",
    category: "basic",
  },
  {
    type: "habits",
    icon: <Calendar className="w-5 h-5" />,
    label: "Habit Tracker",
    description: "Track daily habits",
    category: "advanced",
  },
  {
    type: "chart",
    icon: <BarChart3 className="w-5 h-5" />,
    label: "Chart",
    description: "Data visualization",
    category: "advanced",
  },
  {
    type: "code",
    icon: <Code className="w-5 h-5" />,
    label: "Code",
    description: "Code snippet with syntax highlighting",
    category: "basic",
  },
  {
    type: "card",
    icon: <StickyNote className="w-5 h-5" />,
    label: "Card",
    description: "Note or inspiration card",
    category: "basic",
  },
  {
    type: "mermaid",
    icon: <Network className="w-5 h-5" />,
    label: "Mermaid Diagram",
    description: "Flowchart or diagram",
    category: "advanced",
  },
  {
    type: "embed",
    icon: <Link2 className="w-5 h-5" />,
    label: "Embed",
    description: "YouTube, Figma, etc.",
    category: "media",
  },
  {
    type: "divider",
    icon: <Minus className="w-5 h-5" />,
    label: "Divider",
    description: "Horizontal line",
    category: "basic",
  },
  {
    type: "callout",
    icon: <AlertCircle className="w-5 h-5" />,
    label: "Callout",
    description: "Highlighted message box",
    category: "basic",
  },
];

interface BlockPickerProps {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

export function BlockPicker({ onSelect, onClose }: BlockPickerProps) {
  const [search, setSearch] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const filteredBlocks = React.useMemo(() => {
    if (!search.trim()) return BLOCK_OPTIONS;

    const query = search.toLowerCase();
    return BLOCK_OPTIONS.filter(
      (block) =>
        block.label.toLowerCase().includes(query) ||
        block.description.toLowerCase().includes(query),
    );
  }, [search]);

  const groupedBlocks = React.useMemo(() => {
    const groups: Record<string, BlockOption[]> = {
      basic: [],
      advanced: [],
      media: [],
    };

    filteredBlocks.forEach((block) => {
      groups[block.category].push(block);
    });

    return groups;
  }, [filteredBlocks]);

  const handleSelect = (type: BlockType) => {
    onSelect(type);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden"
        style={{ background: "white" }}
      >
        {/* Search */}
        <div
          className="p-4 border-b"
          style={{ borderColor: "var(--color-linear-border-primary)" }}
        >
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blocks..."
            className="w-full px-3 py-2 border rounded-lg outline-none"
            style={{
              borderColor: "var(--color-linear-border-primary)",
              color: "var(--color-linear-text-primary)",
            }}
          />
        </div>

        {/* Block Grid */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {filteredBlocks.length === 0 ? (
            <div
              className="text-center py-8"
              style={{ color: "var(--color-linear-text-tertiary)" }}
            >
              No blocks found
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedBlocks).map(([category, blocks]) => {
                if (blocks.length === 0) return null;

                return (
                  <div key={category}>
                    <h3
                      className="text-xs font-semibold uppercase tracking-wider mb-3"
                      style={{ color: "var(--color-linear-text-tertiary)" }}
                    >
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {blocks.map((block) => (
                        <button
                          key={block.type}
                          onClick={() => handleSelect(block.type)}
                          className="flex items-start gap-3 p-3 rounded-lg border hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
                          style={{
                            borderColor: "var(--color-linear-border-primary)",
                          }}
                        >
                          <div
                            className="flex-shrink-0 mt-0.5"
                            style={{
                              color: "var(--color-linear-accent-primary)",
                            }}
                          >
                            {block.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-medium text-sm mb-0.5"
                              style={{
                                color: "var(--color-linear-text-primary)",
                              }}
                            >
                              {block.label}
                            </p>
                            <p
                              className="text-xs"
                              style={{
                                color: "var(--color-linear-text-tertiary)",
                              }}
                            >
                              {block.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-3 border-t flex items-center justify-between text-xs"
          style={{
            borderColor: "var(--color-linear-border-primary)",
            color: "var(--color-linear-text-tertiary)",
          }}
        >
          <span>Press ESC to close</span>
          <span>{filteredBlocks.length} blocks available</span>
        </div>
      </div>
    </>
  );
}
