import * as React from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import type { TasksBlock as TasksBlockType, TaskItem } from "~/types/block";

// Lazy load the component to reduce initial bundle size
const TasksBlockComponent = React.lazy(() =>
  import("~/components/blocks/TasksBlock").then((m) => ({
    default: m.TasksBlock,
  }))
);

// NodeView component that bridges TipTap and the TasksBlock component
function TasksBlockView({ node, updateAttributes }: NodeViewProps) {
  const block: TasksBlockType = {
    id: "",
    type: "tasks",
    title: node.attrs.title || "",
    tasks: node.attrs.tasks || [],
    showProgress: node.attrs.showProgress ?? true,
    createdAt: 0,
    updatedAt: 0,
    order: 0,
  };

  const handleChange = React.useCallback(
    (updates: Partial<TasksBlockType>) => {
      updateAttributes(updates);
    },
    [updateAttributes]
  );

  return (
    <NodeViewWrapper className="tiptap-block-wrapper" data-type="tasks-block">
      <React.Suspense
        fallback={
          <div
            className="p-4 rounded-lg animate-pulse"
            style={{ background: "var(--color-linear-bg-secondary)" }}
          >
            Loading tasks...
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
          <TasksBlockComponent block={block} onChange={handleChange} />
        </div>
      </React.Suspense>
    </NodeViewWrapper>
  );
}

// TipTap command type declaration
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tasksBlock: {
      insertTasksBlock: () => ReturnType;
    };
  }
}

// The TipTap Node Extension
export const TasksBlockExtension = Node.create({
  name: "tasksBlock",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      title: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-title") || "",
        renderHTML: (attributes) => ({
          "data-title": attributes.title,
        }),
      },
      tasks: {
        default: [] as TaskItem[],
        parseHTML: (element) => {
          const data = element.getAttribute("data-tasks");
          return data ? JSON.parse(data) : [];
        },
        renderHTML: (attributes) => ({
          "data-tasks": JSON.stringify(attributes.tasks),
        }),
      },
      showProgress: {
        default: true,
        parseHTML: (element) =>
          element.getAttribute("data-show-progress") !== "false",
        renderHTML: (attributes) => ({
          "data-show-progress": String(attributes.showProgress),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="tasks-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "tasks-block" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TasksBlockView);
  },

  addCommands() {
    return {
      insertTasksBlock:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              title: "",
              tasks: [],
              showProgress: true,
            },
          });
        },
    };
  },
});
