export interface BlockCommand {
  title: string;
  description: string;
  icon: string;
  category: string;
  shortcut: string;
  command: () => void;
}

export interface BlockCommandDef {
  title: string;
  description: string;
  icon: string;
  category: string;
  shortcut: string;
  run: (editor: { chain: () => any; view: { state: any } }) => void;
}

const COMMAND_DEFS: BlockCommandDef[] = [
  {
    title: "Text",
    description: "Start writing with plain text",
    icon: "T",
    category: "Writing",
    shortcut: "txt",
    run: (e) => e.chain().focus().setParagraph().run(),
  },
  {
    title: "Heading 1",
    description: "Primary section heading",
    icon: "H1",
    category: "Writing",
    shortcut: "h1",
    run: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "Section heading",
    icon: "H2",
    category: "Writing",
    shortcut: "h2",
    run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Subheading",
    icon: "H3",
    category: "Writing",
    shortcut: "h3",
    run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: "Quote",
    description: "Highlight a quote or key idea",
    icon: '"',
    category: "Writing",
    shortcut: "quote",
    run: (e) => e.chain().focus().toggleBlockquote().run(),
  },
  {
    title: "Callout",
    description: "Draw attention to a key note",
    icon: "💡",
    category: "Writing",
    shortcut: "callout",
    run: (e) => e.chain().focus().insertCalloutBlock().run(),
  },
  {
    title: "Section Outline",
    description: "Heading with supporting bullets",
    icon: "§",
    category: "Templates",
    shortcut: "outline",
    run: (e) =>
      e
        .chain()
        .focus()
        .insertContent([
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Section title" }],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Key point" }],
                  },
                ],
              },
            ],
          },
        ])
        .run(),
  },
  {
    title: "Pull Quote",
    description: "Large quote + attribution",
    icon: "❝",
    category: "Templates",
    shortcut: "pull",
    run: (e) =>
      e
        .chain()
        .focus()
        .insertContent([
          {
            type: "blockquote",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "A memorable line." }],
              },
            ],
          },
          {
            type: "paragraph",
            content: [{ type: "text", text: "— Author" }],
          },
        ])
        .run(),
  },
  {
    title: "Newsletter CTA",
    description: "Call to action block",
    icon: "✉️",
    category: "Templates",
    shortcut: "cta",
    run: (e) =>
      e
        .chain()
        .focus()
        .insertContent([
          {
            type: "calloutBlock",
            attrs: {
              calloutType: "info",
              title: "Stay in the loop",
              content:
                "Subscribe for weekly updates and behind-the-scenes notes.",
            },
          },
        ])
        .run(),
  },
  {
    title: "Bullet List",
    description: "Capture a quick list",
    icon: "•",
    category: "Structure",
    shortcut: "ul",
    run: (e) => e.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Numbered List",
    description: "Track steps in order",
    icon: "1.",
    category: "Structure",
    shortcut: "ol",
    run: (e) => e.chain().focus().toggleOrderedList().run(),
  },
  {
    title: "Task List",
    description: "Keep a checklist",
    icon: "✓",
    category: "Structure",
    shortcut: "todo",
    run: (e) => e.chain().focus().toggleTaskList().run(),
  },
  {
    title: "Divider",
    description: "Visually separate sections",
    icon: "—",
    category: "Structure",
    shortcut: "hr",
    run: (e) => e.chain().focus().setHorizontalRule().run(),
  },
  {
    title: "Code Block",
    description: "Capture a code snippet",
    icon: "</>",
    category: "Code & Media",
    shortcut: "code",
    run: (e) => e.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: "Embed",
    description: "Embed a link or media",
    icon: "🔗",
    category: "Code & Media",
    shortcut: "embed",
    run: (e) => e.chain().focus().insertEmbedBlock().run(),
  },
  // Advanced Blocks
  {
    title: "Tasks",
    description: "Task list with progress tracking",
    icon: "☑",
    category: "Advanced",
    shortcut: "tasks",
    run: (e) => e.chain().focus().insertTasksBlock().run(),
  },
  {
    title: "Habits Tracker",
    description: "Track habits in a calendar",
    icon: "📅",
    category: "Advanced",
    shortcut: "habits",
    run: (e) => e.chain().focus().insertHabitsBlock().run(),
  },
  {
    title: "Chart",
    description: "Add a data visualization",
    icon: "📊",
    category: "Advanced",
    shortcut: "chart",
    run: (e) => e.chain().focus().insertChartBlock().run(),
  },
  {
    title: "Mermaid Diagram",
    description: "Add a flowchart or diagram",
    icon: "🔀",
    category: "Advanced",
    shortcut: "mermaid",
    run: (e) => e.chain().focus().insertMermaidBlock().run(),
  },
  {
    title: "Card",
    description: "Create a styled note card",
    icon: "🃏",
    category: "Advanced",
    shortcut: "card",
    run: (e) => e.chain().focus().insertCardBlock().run(),
  },
];

/**
 * Build block commands with slash-query removal and menu close.
 */
export function buildBlockCommands(
  editor: { chain: () => any; view: { state: any } },
  onCloseMenu: () => void
): BlockCommand[] {
  return COMMAND_DEFS.map((def) => ({
    ...def,
    command: () => {
      const { state } = editor.view;
      const { selection } = state;
      const { $from } = selection;
      const currentLine = $from.parent.textContent || "";
      const cursorPos = $from.parentOffset;
      const slashIndex = currentLine.lastIndexOf("/", cursorPos);

      if (slashIndex !== -1) {
        const fromPos = $from.start() + slashIndex;
        const toPos = $from.start() + cursorPos;
        editor.chain().focus().deleteRange({ from: fromPos, to: toPos }).run();
      }

      onCloseMenu();
      def.run(editor);
    },
  }));
}

export function filterBlockCommands(
  commands: BlockCommand[],
  query: string
): BlockCommand[] {
  if (!query.trim()) return commands;
  const q = query.toLowerCase();
  return commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      cmd.shortcut.toLowerCase().includes(q)
  );
}
