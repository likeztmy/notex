import * as React from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import type { HabitsBlock as HabitsBlockType, Habit } from "~/types/block";
import { BlockToolbar } from "~/components/editor/BlockToolbar";

// Lazy load the component
const HabitsBlockComponent = React.lazy(() =>
  import("~/components/blocks/HabitsBlock").then((m) => ({
    default: m.HabitsBlock,
  }))
);

// NodeView component
function HabitsBlockView({
  node,
  updateAttributes,
  editor,
  getPos,
}: NodeViewProps) {
  const block: HabitsBlockType = {
    id: "",
    type: "habits",
    habits: node.attrs.habits || [],
    startDate: node.attrs.startDate || new Date().toISOString().split("T")[0],
    viewMode: node.attrs.viewMode || "week",
    createdAt: 0,
    updatedAt: 0,
    order: 0,
  };

  const handleChange = React.useCallback(
    (updates: Partial<HabitsBlockType>) => {
      updateAttributes(updates);
    },
    [updateAttributes]
  );

  return (
    <NodeViewWrapper
      className="tiptap-block-wrapper"
      data-type="habits-block"
      data-label="Habits"
    >
      <BlockToolbar editor={editor} node={node} getPos={getPos} />
      <React.Suspense
        fallback={
          <div
            className="p-4 rounded-lg animate-pulse"
            style={{ background: "var(--color-linear-bg-secondary)" }}
          >
            Loading habits tracker...
          </div>
        }
      >
        <div
          className="p-4 rounded-lg border"
          style={{
            background: "var(--color-linear-bg-secondary)",
            borderColor: "var(--color-linear-border-primary)",
          }}
        >
          <HabitsBlockComponent block={block} onChange={handleChange} />
        </div>
      </React.Suspense>
    </NodeViewWrapper>
  );
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    habitsBlock: {
      insertHabitsBlock: () => ReturnType;
    };
  }
}

export const HabitsBlockExtension = Node.create({
  name: "habitsBlock",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      habits: {
        default: [] as Habit[],
        parseHTML: (element) => {
          const data = element.getAttribute("data-habits");
          return data ? JSON.parse(data) : [];
        },
        renderHTML: (attributes) => ({
          "data-habits": JSON.stringify(attributes.habits),
        }),
      },
      startDate: {
        default: new Date().toISOString().split("T")[0],
        parseHTML: (element) =>
          element.getAttribute("data-start-date") ||
          new Date().toISOString().split("T")[0],
        renderHTML: (attributes) => ({
          "data-start-date": attributes.startDate,
        }),
      },
      viewMode: {
        default: "week" as "week" | "month",
        parseHTML: (element) =>
          (element.getAttribute("data-view-mode") as "week" | "month") ||
          "week",
        renderHTML: (attributes) => ({
          "data-view-mode": attributes.viewMode,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="habits-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "habits-block" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HabitsBlockView);
  },

  addCommands() {
    return {
      insertHabitsBlock:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              habits: [],
              startDate: new Date().toISOString().split("T")[0],
              viewMode: "week",
            },
          });
        },
    };
  },
});
