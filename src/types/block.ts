// Block System Types for Canvas Editor

/**
 * Available block types
 */
export type BlockType =
  | "text" // Rich text block
  | "heading" // Heading block
  | "tasks" // Task list with checkboxes
  | "habits" // Habit tracker grid
  | "chart" // Chart visualization
  | "code" // Code block with syntax highlighting
  | "card" // Note/Inspiration card
  | "mermaid" // Mermaid diagram
  | "embed" // External embed (YouTube, etc.)
  | "image" // Image block
  | "divider" // Horizontal divider
  | "callout"; // Callout/alert box

/**
 * Base interface for all blocks
 */
export interface BaseBlock {
  id: string;
  type: BlockType;
  createdAt: number;
  updatedAt: number;

  // Grid layout properties
  order: number; // Position in the grid
  width?: "full" | "half" | "third" | "two-thirds"; // Grid width
}

/**
 * Text Block - Rich text content
 */
export interface TextBlock extends BaseBlock {
  type: "text";
  content: string;
}

/**
 * Heading Block
 */
export interface HeadingBlock extends BaseBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content: string;
}

/**
 * Task Item
 */
export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

/**
 * Tasks Block - Task list with progress tracking
 */
export interface TasksBlock extends BaseBlock {
  type: "tasks";
  title?: string;
  tasks: TaskItem[];
  showProgress?: boolean;
}

/**
 * Habit Tracker Block - Calendar grid for habit tracking
 */
export interface HabitEntry {
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  emoji?: string;
  entries: HabitEntry[];
}

export interface HabitsBlock extends BaseBlock {
  type: "habits";
  habits: Habit[];
  startDate: string; // YYYY-MM-DD
  viewMode?: "week" | "month";
}

/**
 * Chart Block - Data visualization
 */
export type ChartType = "line" | "bar" | "pie" | "area" | "radar";

export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: any;
}

export interface ChartBlock extends BaseBlock {
  type: "chart";
  title?: string;
  chartType: ChartType;
  data: ChartDataPoint[];
  xAxisKey?: string;
  yAxisKey?: string;
  colors?: string[];
}

/**
 * Code Block - Syntax highlighted code
 */
export type CodeLanguage =
  | "javascript"
  | "typescript"
  | "jsx"
  | "tsx"
  | "python"
  | "java"
  | "go"
  | "rust"
  | "html"
  | "css"
  | "json"
  | "yaml"
  | "bash"
  | "sql"
  | "markdown";

export interface CodeBlock extends BaseBlock {
  type: "code";
  language: CodeLanguage;
  code: string;
  title?: string;
  showLineNumbers?: boolean;
  wrapLines?: boolean;
}

/**
 * Card Block - Note/Inspiration card
 */
export type CardStyle = "default" | "gradient" | "minimal" | "bordered";

export interface CardBlock extends BaseBlock {
  type: "card";
  title?: string;
  content: string;
  emoji?: string;
  cardStyle?: CardStyle;
  bgColor?: string;
}

/**
 * Mermaid Block - Diagram/flowchart
 */
export interface MermaidBlock extends BaseBlock {
  type: "mermaid";
  title?: string;
  diagram: string;
}

/**
 * Embed Block - External content embed
 */
export type EmbedProvider = "youtube" | "figma" | "link" | "custom";

export interface EmbedBlock extends BaseBlock {
  type: "embed";
  provider: EmbedProvider;
  url: string;
  title?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1";
}

/**
 * Image Block
 */
export interface ImageBlock extends BaseBlock {
  type: "image";
  url: string;
  alt?: string;
  caption?: string;
}

/**
 * Divider Block
 */
export interface DividerBlock extends BaseBlock {
  type: "divider";
  style?: "solid" | "dashed" | "dotted";
}

/**
 * Callout Block
 */
export type CalloutType = "info" | "warning" | "success" | "error";

export interface CalloutBlock extends BaseBlock {
  type: "callout";
  calloutType: CalloutType;
  title?: string;
  content: string;
  emoji?: string;
}

/**
 * Union type for all blocks
 */
export type Block =
  | TextBlock
  | HeadingBlock
  | TasksBlock
  | HabitsBlock
  | ChartBlock
  | CodeBlock
  | CardBlock
  | MermaidBlock
  | EmbedBlock
  | ImageBlock
  | DividerBlock
  | CalloutBlock;

/**
 * Helper function to create a new block
 */
export function createBlock(type: BlockType, data?: Partial<Block>): Block {
  const now = Date.now();
  const id = `block_${now}_${Math.random().toString(36).substr(2, 9)}`;

  const baseBlock = {
    id,
    createdAt: now,
    updatedAt: now,
    order: data?.order ?? 0,
    width: data?.width ?? "full",
  };

  switch (type) {
    case "text":
      return { ...baseBlock, type: "text", content: "" } as TextBlock;
    case "heading":
      return {
        ...baseBlock,
        type: "heading",
        level: 2,
        content: "",
      } as HeadingBlock;
    case "tasks":
      return {
        ...baseBlock,
        type: "tasks",
        tasks: [],
        showProgress: true,
      } as TasksBlock;
    case "habits":
      return {
        ...baseBlock,
        type: "habits",
        habits: [],
        startDate: new Date().toISOString().split("T")[0],
        viewMode: "week",
      } as HabitsBlock;
    case "chart":
      return {
        ...baseBlock,
        type: "chart",
        chartType: "bar",
        data: [],
      } as ChartBlock;
    case "code":
      return {
        ...baseBlock,
        type: "code",
        language: "javascript",
        code: "",
        showLineNumbers: true,
        wrapLines: false,
      } as CodeBlock;
    case "card":
      return {
        ...baseBlock,
        type: "card",
        content: "",
        cardStyle: "default",
      } as CardBlock;
    case "mermaid":
      return {
        ...baseBlock,
        type: "mermaid",
        diagram: "graph TD\n  A[Start] --> B[End]",
      } as MermaidBlock;
    case "embed":
      return {
        ...baseBlock,
        type: "embed",
        provider: "youtube",
        url: "",
        aspectRatio: "16:9",
      } as EmbedBlock;
    case "image":
      return { ...baseBlock, type: "image", url: "" } as ImageBlock;
    case "divider":
      return { ...baseBlock, type: "divider", style: "solid" } as DividerBlock;
    case "callout":
      return {
        ...baseBlock,
        type: "callout",
        calloutType: "info",
        content: "",
      } as CalloutBlock;
    default:
      throw new Error(`Unknown block type: ${type}`);
  }
}
