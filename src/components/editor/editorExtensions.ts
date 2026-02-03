import {
  TasksBlockExtension,
  HabitsBlockExtension,
  ChartBlockExtension,
  MermaidBlockExtension,
  CalloutBlockExtension,
  EmbedBlockExtension,
  CardBlockExtension,
} from "./extensions";

/**
 * TipTap editor extensions config.
 * Used when creating the editor instance.
 */
export function getEditorExtensions(deps: {
  StarterKit: any;
  CodeBlockLowlight: any;
  Typography: any;
  Link: any;
  TaskList: any;
  TaskItem: any;
  Highlight: any;
  Markdown: any;
  Placeholder: any;
  lowlight: any;
}) {
  const {
    StarterKit,
    CodeBlockLowlight,
    Typography,
    Link,
    TaskList,
    TaskItem,
    Highlight,
    Markdown,
    Placeholder,
    lowlight,
  } = deps;

  return [
    StarterKit.configure({
      codeBlock: false,
      heading: { levels: [1, 2, 3, 4, 5, 6] },
      blockquote: {
        HTMLAttributes: { class: "border-l-4 pl-4 italic opacity-80" },
      },
    }),
    CodeBlockLowlight.configure({
      lowlight,
      HTMLAttributes: { class: "rounded-lg p-4 font-mono text-sm my-4" },
    }),
    Typography,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { class: "underline cursor-pointer" },
    }),
    TaskList.configure({ HTMLAttributes: { class: "list-none pl-0" } }),
    TaskItem.configure({
      HTMLAttributes: { class: "flex items-start gap-2 mb-2" },
      nested: true,
    }),
    Highlight.configure({
      HTMLAttributes: {
        class: "bg-yellow-200 dark:bg-yellow-800 rounded px-1",
      },
    }),
    Markdown.configure({
      html: true,
      tightLists: true,
      bulletListMarker: "-",
      linkify: true,
      breaks: false,
      transformPastedText: true,
      transformCopiedText: false,
    }),
    Placeholder.configure({
      placeholder: ({ node }: { node: any }) =>
        node.type.name === "heading"
          ? `Heading ${node.attrs.level}`
          : 'Type "/" for commands...',
    }),
    // Advanced Block Extensions
    TasksBlockExtension,
    HabitsBlockExtension,
    ChartBlockExtension,
    MermaidBlockExtension,
    CalloutBlockExtension,
    EmbedBlockExtension,
    CardBlockExtension,
  ];
}

export const EDITOR_CONTENT_CLASS =
  "prose prose-lg max-w-none [&_.ProseMirror]:min-h-[70vh] [&_.ProseMirror]:p-0 [&_.ProseMirror_h1]:text-4xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mt-8 [&_.ProseMirror_h1]:mb-4 [&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mt-6 [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h3]:text-2xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-5 [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-4 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-4 [&_.ProseMirror_pre]:my-4 [&_.ProseMirror_blockquote]:my-4 [&_.ProseMirror_hr]:my-8 [&_.ProseMirror_hr]:border-t [&_.ProseMirror_hr]:opacity-20";
