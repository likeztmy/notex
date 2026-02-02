import * as React from "react";
import type { Block } from "~/types/block";
import { BaseBlock } from "./BaseBlock";
import { TasksBlock } from "./TasksBlock";
import { HabitsBlock } from "./HabitsBlock";
import { ChartBlock } from "./ChartBlock";
import { CodeBlock } from "./CodeBlock";
import { CardBlock } from "./CardBlock";
import { MermaidBlock } from "./MermaidBlock";
import { EmbedBlock } from "./EmbedBlock";

interface BlockRendererProps {
  block: Block;
  onChange: (blockId: string, updates: Partial<Block>) => void;
  onDelete: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  dragHandleProps?: any;
  isDragging?: boolean;
}

export function BlockRenderer({
  block,
  onChange,
  onDelete,
  onDuplicate,
  dragHandleProps,
  isDragging,
}: BlockRendererProps) {
  const handleChange = (updates: Partial<Block>) => {
    onChange(block.id, updates);
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case "text":
        return (
          <textarea
            value={(block as any).content}
            onChange={(e) => handleChange({ content: e.target.value } as any)}
            placeholder="Start typing..."
            className="w-full min-h-[100px] border-none outline-none bg-transparent resize-none"
            style={{ color: "var(--color-linear-text-primary)" }}
          />
        );

      case "heading":
        const HeadingTag = `h${(block as any).level}` as
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6";
        return (
          <div className="space-y-2">
            <select
              value={(block as any).level}
              onChange={(e) =>
                handleChange({ level: parseInt(e.target.value) } as any)
              }
              className="text-xs px-2 py-1 rounded border"
              style={{ borderColor: "var(--color-linear-border-primary)" }}
            >
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <option key={level} value={level}>
                  Heading {level}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={(block as any).content}
              onChange={(e) => handleChange({ content: e.target.value } as any)}
              placeholder="Heading text"
              className={`w-full border-none outline-none bg-transparent font-bold`}
              style={{
                fontSize: `${3 - (block as any).level * 0.3}rem`,
                color: "var(--color-linear-text-primary)",
              }}
            />
          </div>
        );

      case "tasks":
        return <TasksBlock block={block as any} onChange={handleChange} />;

      case "habits":
        return <HabitsBlock block={block as any} onChange={handleChange} />;

      case "chart":
        return <ChartBlock block={block as any} onChange={handleChange} />;

      case "code":
        return <CodeBlock block={block as any} onChange={handleChange} />;

      case "card":
        return <CardBlock block={block as any} onChange={handleChange} />;

      case "mermaid":
        return <MermaidBlock block={block as any} onChange={handleChange} />;

      case "embed":
        return <EmbedBlock block={block as any} onChange={handleChange} />;

      case "divider":
        return (
          <div className="py-2">
            <div
              className="h-px"
              style={{
                borderTop: `1px ${
                  (block as any).style || "solid"
                } var(--color-linear-border-primary)`,
              }}
            />
          </div>
        );

      case "callout":
        const calloutColors: Record<
          string,
          { bg: string; border: string; icon: string }
        > = {
          info: { bg: "#e0f2fe", border: "#0ea5e9", icon: "ℹ️" },
          warning: { bg: "#fef3c7", border: "#f59e0b", icon: "⚠️" },
          success: { bg: "#dcfce7", border: "#10b981", icon: "✅" },
          error: { bg: "#fee2e2", border: "#ef4444", icon: "❌" },
        };
        const calloutStyle =
          calloutColors[(block as any).calloutType || "info"];

        return (
          <div
            className="p-4 rounded-lg border-l-4"
            style={{
              background: calloutStyle.bg,
              borderLeftColor: calloutStyle.border,
            }}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">
                {(block as any).emoji || calloutStyle.icon}
              </span>
              <div className="flex-1">
                {(block as any).title && (
                  <p className="font-semibold mb-1">{(block as any).title}</p>
                )}
                <textarea
                  value={(block as any).content}
                  onChange={(e) =>
                    handleChange({ content: e.target.value } as any)
                  }
                  placeholder="Callout message..."
                  className="w-full min-h-[60px] border-none outline-none bg-transparent resize-none"
                />
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-sm text-gray-400">Unknown block type</div>;
    }
  };

  return (
    <BaseBlock
      block={block}
      onDelete={() => onDelete(block.id)}
      onDuplicate={() => onDuplicate(block.id)}
      dragHandleProps={dragHandleProps}
      isDragging={isDragging}
    >
      {renderBlockContent()}
    </BaseBlock>
  );
}
