import * as React from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import type {
  ChartBlock as ChartBlockType,
  ChartDataPoint,
  ChartType,
} from "~/types/block";
import { BlockToolbar } from "~/components/editor/BlockToolbar";

// Lazy load the component (Recharts is heavy)
const ChartBlockComponent = React.lazy(() =>
  import("~/components/blocks/ChartBlock").then((m) => ({
    default: m.ChartBlock,
  }))
);

// NodeView component
function ChartBlockView({
  node,
  updateAttributes,
  editor,
  getPos,
}: NodeViewProps) {
  const block: ChartBlockType = {
    id: "",
    type: "chart",
    title: node.attrs.title || "",
    chartType: node.attrs.chartType || "bar",
    data: node.attrs.data || [],
    colors: node.attrs.colors || [],
    createdAt: 0,
    updatedAt: 0,
    order: 0,
  };

  const handleChange = React.useCallback(
    (updates: Partial<ChartBlockType>) => {
      updateAttributes(updates);
    },
    [updateAttributes]
  );

  return (
    <NodeViewWrapper
      className="tiptap-block-wrapper"
      data-type="chart-block"
      data-label="Chart"
    >
      <BlockToolbar editor={editor} node={node} getPos={getPos} />
      <React.Suspense
        fallback={
          <div
            className="p-4 rounded-lg animate-pulse h-64 flex items-center justify-center"
            style={{ background: "var(--color-linear-bg-secondary)" }}
          >
            Loading chart...
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
          <ChartBlockComponent block={block} onChange={handleChange} />
        </div>
      </React.Suspense>
    </NodeViewWrapper>
  );
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    chartBlock: {
      insertChartBlock: () => ReturnType;
    };
  }
}

export const ChartBlockExtension = Node.create({
  name: "chartBlock",
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
      chartType: {
        default: "bar" as ChartType,
        parseHTML: (element) =>
          (element.getAttribute("data-chart-type") as ChartType) || "bar",
        renderHTML: (attributes) => ({
          "data-chart-type": attributes.chartType,
        }),
      },
      data: {
        default: [] as ChartDataPoint[],
        parseHTML: (element) => {
          const data = element.getAttribute("data-chart-data");
          return data ? JSON.parse(data) : [];
        },
        renderHTML: (attributes) => ({
          "data-chart-data": JSON.stringify(attributes.data),
        }),
      },
      colors: {
        default: [] as string[],
        parseHTML: (element) => {
          const data = element.getAttribute("data-colors");
          return data ? JSON.parse(data) : [];
        },
        renderHTML: (attributes) => ({
          "data-colors": JSON.stringify(attributes.colors),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="chart-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "chart-block" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChartBlockView);
  },

  addCommands() {
    return {
      insertChartBlock:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              title: "",
              chartType: "bar",
              data: [],
              colors: [],
            },
          });
        },
    };
  },
});
