import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import type {
  CalloutBlock as CalloutBlockType,
  CalloutType,
} from "~/types/block";
import { BlockToolbar } from "~/components/editor/BlockToolbar";

// Callout colors configuration
const CALLOUT_STYLES: Record<
  CalloutType,
  {
    bg: string;
    border: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  info: { bg: "#e0f2fe", border: "#0ea5e9", Icon: Info },
  warning: { bg: "#fef3c7", border: "#f59e0b", Icon: AlertTriangle },
  success: { bg: "#dcfce7", border: "#10b981", Icon: CheckCircle2 },
  error: { bg: "#fee2e2", border: "#ef4444", Icon: XCircle },
};

// Inline CalloutBlock component (lightweight, no lazy loading needed)
function CalloutBlockComponent({
  block,
  onChange,
}: {
  block: CalloutBlockType;
  onChange: (updates: Partial<CalloutBlockType>) => void;
}) {
  const calloutStyle = CALLOUT_STYLES[block.calloutType || "info"];
  const options: { value: CalloutType; label: string }[] = [
    { value: "info", label: "Info" },
    { value: "warning", label: "Warning" },
    { value: "success", label: "Success" },
    { value: "error", label: "Error" },
  ];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div
        className="flex items-center gap-1 rounded-full p-1 w-fit"
        style={{ background: "var(--color-linear-bg-tertiary)" }}
      >
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange({ calloutType: option.value })}
            className="text-xs px-3 py-1 rounded-full"
            style={{
              background:
                block.calloutType === option.value
                  ? "var(--color-linear-bg-elevated)"
                  : "transparent",
              color: "var(--color-linear-text-secondary)",
              boxShadow:
                block.calloutType === option.value
                  ? "var(--shadow-linear-sm)"
                  : "none",
            }}
          >
            {option.label}
          </button>
        ))}
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
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(0, 0, 0, 0.06)",
              color: "var(--color-linear-text-primary)",
            }}
          >
            <calloutStyle.Icon className="w-4 h-4" />
          </div>
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
function CalloutBlockView({
  node,
  updateAttributes,
  editor,
  getPos,
}: NodeViewProps) {
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
    <NodeViewWrapper
      className="tiptap-block-wrapper"
      data-type="callout-block"
      data-label="Callout"
    >
      <BlockToolbar editor={editor} node={node} getPos={getPos} />
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
