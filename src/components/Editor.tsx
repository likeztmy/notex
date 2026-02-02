import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { Palette } from "lucide-react";
import { getContentById, updateContent } from "~/utils/contentStorage";
import type { Content, StyleConfig } from "~/types/content";
import { DEFAULT_STYLE_CONFIG } from "~/types/content";
import { StylePanel } from "./StylePanel";
import { getStyleVars, getContentWidthClass } from "~/utils/styleConfig";
import {
  buildBlockCommands,
  filterBlockCommands,
  SlashMenu,
  BubbleMenuBar,
  ShortcutsPanel,
  useSlashMenu,
  getEditorExtensions,
  EDITOR_CONTENT_CLASS,
} from "./editor/index";

function EditorClient({
  documentId,
  createNew,
}: {
  documentId?: string;
  createNew?: boolean;
}) {
  const [currentDoc, setCurrentDoc] = React.useState<Content | null>(null);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const [showShortcuts, setShowShortcuts] = React.useState(false);
  const [showStylePanel, setShowStylePanel] = React.useState(false);
  const [Editor, setEditor] = React.useState<any>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (documentId) {
      const doc = getContentById(documentId);
      if (doc) setCurrentDoc(doc);
      else navigate({ to: "/content" });
    } else {
      navigate({ to: "/content" });
    }

    Promise.all([
      import("@tiptap/react"),
      import("@tiptap/starter-kit"),
      import("@tiptap/extension-placeholder"),
      import("@tiptap/extension-typography"),
      import("@tiptap/extension-link"),
      import("@tiptap/extension-task-list"),
      import("@tiptap/extension-task-item"),
      import("@tiptap/extension-highlight"),
      import("@tiptap/extension-code-block-lowlight"),
      import("tiptap-markdown"),
      import("lowlight"),
    ]).then(
      ([
        tiptapReact,
        { default: StarterKit },
        { default: Placeholder },
        { default: Typography },
        { default: Link },
        { default: TaskList },
        { default: TaskItem },
        { default: Highlight },
        { default: CodeBlockLowlight },
        { Markdown },
        { common, createLowlight },
      ]) => {
        const { useEditor, EditorContent, BubbleMenu } = tiptapReact as any;
        const lowlight = createLowlight(common);
        setEditor({
          useEditor,
          EditorContent,
          BubbleMenu,
          StarterKit,
          Placeholder,
          Typography,
          Link,
          TaskList,
          TaskItem,
          Highlight,
          CodeBlockLowlight,
          Markdown,
          lowlight,
        });
      },
    );
  }, [documentId, createNew, navigate]);

  const handleUpdateDoc = React.useCallback(
    (id: string, updates: Partial<Content>) => {
      updateContent(id, updates);
      setCurrentDoc((prev) =>
        prev ? { ...prev, ...updates, updatedAt: Date.now() } : null,
      );
      setLastSaved(new Date());
    },
    [],
  );

  if (!Editor || !currentDoc) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ background: "white" }}
      >
        <div
          className="text-sm animate-pulse"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <EditorInner
      Editor={Editor}
      document={currentDoc}
      onUpdateDoc={handleUpdateDoc}
      showShortcuts={showShortcuts}
      setShowShortcuts={setShowShortcuts}
      showStylePanel={showStylePanel}
      setShowStylePanel={setShowStylePanel}
    />
  );
}

function EditorInner({
  Editor: {
    useEditor,
    EditorContent,
    BubbleMenu,
    StarterKit,
    Placeholder,
    Typography,
    Link,
    TaskList,
    TaskItem,
    Highlight,
    CodeBlockLowlight,
    Markdown,
    lowlight,
  },
  document,
  onUpdateDoc,
  showShortcuts,
  setShowShortcuts,
  showStylePanel,
  setShowStylePanel,
}: any) {
  const titleInputRef = React.useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = React.useState(document.title);
  const [styleConfig, setStyleConfig] = React.useState<StyleConfig>(
    document.styleConfig || DEFAULT_STYLE_CONFIG
  );

  const slashMenu = useSlashMenu();
  const {
    state: slashState,
    setShow: setShowSlashMenu,
    setReferenceElement,
    setSearchQuery,
    setSelectedIndex,
    getHandleKeyDown,
  } = slashMenu;

  const onRunCommandRef = React.useRef<((index: number) => void) | null>(null);
  const slashHandlerRefs = React.useMemo(
    () => ({ onRunCommand: onRunCommandRef }),
    [],
  );

  const editor = useEditor({
    extensions: getEditorExtensions({
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
    }),
    content: document.docContent,
    editorProps: {
      attributes: { class: "focus:outline-none min-h-[70vh]" },
      handleKeyDown: getHandleKeyDown(slashHandlerRefs),
    },
  });

  React.useEffect(() => {
    if (!editor) return;
    setTitle(document.title);
    setStyleConfig(document.styleConfig || DEFAULT_STYLE_CONFIG);
    editor.commands.setContent(document.docContent);
  }, [document.id, editor]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      if (title !== document.title) onUpdateDoc(document.id, { title });
    }, 500);
    return () => clearTimeout(t);
  }, [title, document.id, document.title, onUpdateDoc]);

  // Save style config changes
  const handleStyleChange = React.useCallback(
    (newConfig: Partial<StyleConfig>) => {
      const updatedConfig = { ...styleConfig, ...newConfig };
      setStyleConfig(updatedConfig);
      onUpdateDoc(document.id, { styleConfig: updatedConfig });
    },
    [styleConfig, document.id, onUpdateDoc]
  );

  React.useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.style.height = "auto";
      titleInputRef.current.style.height =
        titleInputRef.current.scrollHeight + "px";
    }
  }, [title]);

  // Sync search query and reference position while slash menu is open
  React.useEffect(() => {
    if (!slashState.show || !editor) return;
    const syncSlashPosition = () => {
      const { state } = editor.view;
      const { $from } = state.selection;
      const line = $from.parent.textContent || "";
      const cursorPos = $from.parentOffset;
      const slashIndex = line.lastIndexOf("/", cursorPos);
      if (slashIndex === -1) return;
      setSearchQuery(line.substring(slashIndex + 1, cursorPos));
      const coords = editor.view.coordsAtPos($from.pos);
      setReferenceElement({
        getBoundingClientRect: () =>
          Object.assign(
            {
              width: 0,
              height: 0,
              x: coords.left,
              y: coords.top,
              top: coords.top,
              left: coords.left,
              right: coords.left,
              bottom: coords.top,
            },
            { toJSON: () => ({}) },
          ) as DOMRect,
      });
    };
    const timeoutId = setTimeout(() => {
      editor.on("update", syncSlashPosition);
      setTimeout(syncSlashPosition, 50);
    }, 10);
    return () => {
      clearTimeout(timeoutId);
      editor.off("update", syncSlashPosition);
    };
  }, [slashState.show, editor, setSearchQuery, setReferenceElement]);

  // Save content with debounce
  React.useEffect(() => {
    if (!editor) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onUpdateDoc(document.id, { docContent: editor.getJSON() });
      }, 500);
    };
    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
      clearTimeout(timeoutId);
    };
  }, [editor, document.id, onUpdateDoc]);

  if (!editor) return null;

  const closeSlashMenu = React.useCallback(() => {
    setShowSlashMenu(false);
    setReferenceElement(null);
  }, [setShowSlashMenu, setReferenceElement]);

  const blockCommands = React.useMemo(
    () => buildBlockCommands(editor, closeSlashMenu),
    [editor, closeSlashMenu],
  );

  const filteredCommands = React.useMemo(
    () => filterBlockCommands(blockCommands, slashState.searchQuery),
    [blockCommands, slashState.searchQuery],
  );

  React.useEffect(() => {
    onRunCommandRef.current = (index: number) => {
      filteredCommands[index]?.command();
    };
    return () => {
      onRunCommandRef.current = null;
    };
  }, [filteredCommands]);

  React.useEffect(() => {
    if (
      filteredCommands.length > 0 &&
      slashState.selectedIndex >= filteredCommands.length
    ) {
      setSelectedIndex(0);
    }
  }, [filteredCommands.length, slashState.selectedIndex, setSelectedIndex]);

  const handleSlashMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev >= filteredCommands.length - 1 ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? filteredCommands.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      filteredCommands[slashState.selectedIndex]?.command();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowSlashMenu(false);
      setSearchQuery("");
      setReferenceElement(null);
    }
  };

  const contentWidthClass = getContentWidthClass(styleConfig.contentWidth);
  const styleVars = getStyleVars(styleConfig);

  return (
    <div className="h-full flex flex-col relative" style={{ background: "white" }}>
      {/* Floating Style Button */}
      <button
        onClick={() => setShowStylePanel(true)}
        className="fixed top-6 right-6 z-40 p-3 rounded-lg shadow-lg transition-all hover:scale-105"
        style={{
          background: "white",
          border: "1px solid var(--color-linear-border-primary)",
        }}
        title="Document Style"
      >
        <Palette className="w-5 h-5" style={{ color: "var(--color-linear-text-secondary)" }} />
      </button>

      {slashState.show && editor && slashState.referenceElement && (
        <SlashMenu
          referenceElement={slashState.referenceElement}
          commands={filteredCommands}
          selectedIndex={slashState.selectedIndex}
          onSelectIndex={setSelectedIndex}
          onRunCommand={(index) => filteredCommands[index]?.command()}
          onKeyDown={handleSlashMenuKeyDown}
        />
      )}

      {editor && BubbleMenu && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 150 }}>
          <BubbleMenuBar editor={editor} />
        </BubbleMenu>
      )}

      {showShortcuts && (
        <ShortcutsPanel onClose={() => setShowShortcuts(false)} />
      )}

      {showStylePanel && (
        <StylePanel
          styleConfig={styleConfig}
          onStyleChange={handleStyleChange}
          onClose={() => setShowStylePanel(false)}
        />
      )}

      <div className="flex-1 overflow-auto" style={styleVars}>
        <div
          className={`${contentWidthClass} mx-auto px-12 pt-16 pb-32 animate-fadeInUp`}
          style={{ animationDelay: "0.05s" }}
        >
          <textarea
            ref={titleInputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="w-full resize-none border-none outline-none bg-transparent text-4xl font-semibold mb-2 leading-tight overflow-hidden"
            style={{
              color: "var(--color-linear-text-primary)",
              caretColor: "var(--color-linear-accent-primary)",
              letterSpacing: "-0.022em",
            }}
            rows={1}
          />
          <div
            className="mb-10 text-xs"
            style={{ color: "var(--color-linear-text-tertiary)" }}
          >
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <EditorContent editor={editor} className={EDITOR_CONTENT_CLASS} />
        </div>
      </div>
    </div>
  );
}

export function Editor({
  documentId,
  createNew,
}: {
  documentId?: string;
  createNew?: boolean;
}) {
  if (typeof window === "undefined") {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ background: "white" }}
      >
        <div
          className="text-sm animate-pulse"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        >
          Loading notex...
        </div>
      </div>
    );
  }
  return <EditorClient documentId={documentId} createNew={createNew} />;
}
