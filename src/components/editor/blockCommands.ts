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
    description: "Just start typing with plain text",
    icon: "T",
    category: "Basic Blocks",
    shortcut: "txt",
    run: (e) => e.chain().focus().setParagraph().run(),
  },
  {
    title: "Heading 1",
    description: "Big section heading",
    icon: "H1",
    category: "Headings",
    shortcut: "h1",
    run: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: "H2",
    category: "Headings",
    shortcut: "h2",
    run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: "H3",
    category: "Headings",
    shortcut: "h3",
    run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list",
    icon: "•",
    category: "Lists",
    shortcut: "ul",
    run: (e) => e.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering",
    icon: "1.",
    category: "Lists",
    shortcut: "ol",
    run: (e) => e.chain().focus().toggleOrderedList().run(),
  },
  {
    title: "Task List",
    description: "Track tasks with a checklist",
    icon: "✓",
    category: "Lists",
    shortcut: "todo",
    run: (e) => e.chain().focus().toggleTaskList().run(),
  },
  {
    title: "Code Block",
    description: "Capture a code snippet",
    icon: "</>",
    category: "Advanced",
    shortcut: "code",
    run: (e) => e.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: "Quote",
    description: "Capture a quote",
    icon: '"',
    category: "Basic Blocks",
    shortcut: "quote",
    run: (e) => e.chain().focus().toggleBlockquote().run(),
  },
  {
    title: "Divider",
    description: "Visually divide blocks",
    icon: "—",
    category: "Basic Blocks",
    shortcut: "hr",
    run: (e) => e.chain().focus().setHorizontalRule().run(),
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
