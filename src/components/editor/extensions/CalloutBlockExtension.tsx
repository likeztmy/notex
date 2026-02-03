import * as React from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import type {
  CalloutBlock as CalloutBlockType,
  CalloutType,
} from "~/types/block";

// Callout colors configuration
const CALLOUT_COLORS: Record<
  CalloutType,
  { bg: string; border: string; icon: string }
> = {
  info: { bg: "#e0f2fe", border: "#0ea5e9", icon: "ℹ️" },
  warning: { bg: "#fef3c7", border: "#f59e0b", icon: "⚠️" },
  success: { bg: "#dcfce7", border: "#10b981", icon: "✅" },
  error: { bg: "#fee2e2", border: "#ef4444", icon: "❌" },
};

// Inline CalloutBlock component (lightweight, no lazy loading needed)
function CalloutBlockComponent({
  block,
  onChange,
}: {
  block: CalloutBlockType;
  onChange: (updates: Partial<CalloutBlockType>) => void;
}) {
  const calloutStyle = CALLOUT_COLORS[block.calloutType || "info"];

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <select
          value={block.calloutType || "info"}
          onChange={(e) =>
            onChange({ calloutType: e.target.value as CalloutType })
          }
          className="text-xs px-2 py-1 rounded border"
          style={{
            borderColor: "var(--color-linear-border-primary)",
            color: "var(--color-linear-text-secondary)",
          }}
        >
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="success">Success</option>
          <option value="error">Error</option>
        </select>
        <input
          type="text"
          value={block.emoji || ""}
          onChange={(e) => onChange({ emoji: e.target.value.slice(0, 2) })}
          placeholder="Emoji"
          className="w-16 text-xs px-2 py-1 border rounded"
          style={{ borderColor: "var(--color-linear-border-primary)" }}
          maxLength={2}
        />
      </div>

      {/* Callout Content */}
      <div
        className="p-4 rounded-lg border-l-4"
        style={{
          background: calloutStyle.bg,
          borderLeftColor: calloutStyle.border,
        }}
      >
        <div className="flex items-start gap-2">
          <span className="text-xl">{block.emoji || calloutStyle.icon}</span>
          <div className="flex-1">
            <input
              type="text"
              value={block.title || ""}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Title (optional)"
              className="w-full font-semibold mb-1 border-none outline-none bg-transparent"
              style={{ color: "var(--color-linear-text-primary)" }}
            />
            <textarea
              value={block.content}
              onChange={(e) => onChange({ content: e.target.value })}
              placeholder="Callout message..."
              className="w-full min-h-[60px] border-none outline-none bg-transparent resize-none"
              style={{ color: "var(--color-linear-text-primary)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// NodeView component
function CalloutBlockView({ node, updateAttributes }: NodeViewProps) {
  const block: CalloutBlockType = {
    id: "",
    type: "callout",
    calloutType: node.attrs.calloutType || "info",
    title: node.attrs.title || "",
    content: node.attrs.content || "",
    emoji: node.attrs.emoji || "",
    createdAt: 0,
    updatedAt: 0,
    order: 0,
  };

  const handleChange = React.useCallback(
    (updates: Partial<CalloutBlockType>) => {
      updateAttributes(updates);
    },
    [updateAttributes]
  );

  return (
    <NodeViewWrapper className="tiptap-block-wrapper" data-type="callout-block">
      <CalloutBlockComponent block={block} onChange={handleChange} />
    </NodeViewWrapper>
  );
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    calloutBlock: {
      insertCalloutBlock: () => ReturnType;
    };
  }
}

export const CalloutBlockExtension = Node.create({
  name: "calloutBlock",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      calloutType: {
        default: "info" as CalloutType,
        parseHTML: (element) =>
          (element.getAttribute("data-callout-type") as CalloutType) || "info",
        renderHTML: (attributes) => ({
          "data-callout-type": attributes.calloutType,
        }),
      },
      title: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-title") || "",
        renderHTML: (attributes) => ({
          "data-title": attributes.title,
        }),
      },
      content: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-content") || "",
        renderHTML: (attributes) => ({
          "data-content": attributes.content,
        }),
      },
      emoji: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-emoji") || "",
        renderHTML: (attributes) => ({
          "data-emoji": attributes.emoji,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="callout-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "callout-block" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutBlockView);
  },

  addCommands() {
    return {
      insertCalloutBlock:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              calloutType: "info",
              title: "",
              content: "",
              emoji: "",
            },
          });
        },
    };
  },
});
