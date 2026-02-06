import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  FileText,
  Maximize2,
  Minimize2,
  Palette,
  Share2,
  Search,
  Star,
} from "lucide-react";
import type { Content, StyleConfig } from "~/types/content";
import { DEFAULT_STYLE_CONFIG } from "~/types/content";
import { useContentStore } from "~/store/contentStore";
import { useSearchModalContext } from "~/routes/__root";
import { useSidebar } from "~/components/ui/sidebar";
import { StylePanel } from "./StylePanel";
import { TagInput } from "./TagInput";
import { PublishSheet } from "./PublishSheet";
import { getStyleVars, getContentWidthClass } from "~/utils/styleConfig";
import { getRecentContentFromList } from "~/utils/contentQuery";
import { getContentPreview } from "~/utils/contentText";
import {
  buildBlockCommands,
  filterBlockCommands,
  SlashMenu,
  BubbleMenuBar,
  useSlashMenu,
  getEditorExtensions,
  EDITOR_CONTENT_CLASS,
} from "./editor/index";

type EditorTemplate = {
  id: string;
  title: string;
  description: string;
  docContent: any;
};

const WRITING_TEMPLATES: EditorTemplate[] = [
  {
    id: "meeting-notes",
    title: "Meeting Notes",
    description: "Agenda, notes, and action items",
    docContent: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Attendees" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Name — role" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Agenda" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Agenda item" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Notes" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "" }],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Action Items" }],
        },
        {
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Owner — next step" }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "project-brief",
    title: "Project Brief",
    description: "Context, goals, and success criteria",
    docContent: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Context" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Why now? What prompted this work?" },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Goals" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Primary goal" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Non-goals" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "What we will not do" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Success Metrics" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Metric and target" }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "daily-journal",
    title: "Daily Journal",
    description: "Highlights, reflections, and next steps",
    docContent: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Highlights" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "A win from today" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Gratitude" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Something appreciated" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Tomorrow" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "One priority for tomorrow." }],
        },
      ],
    },
  },
  {
    id: "research-note",
    title: "Research Note",
    description: "Sources, insights, and follow-ups",
    docContent: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Question" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "What are we trying to learn?" }],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Sources" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Source title — link" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Key Insights" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Insight" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Next Steps" }],
        },
        {
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Follow-up task" }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "spec-draft",
    title: "Spec Draft",
    description: "Problem, proposal, and risks",
    docContent: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Problem" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "What needs to be solved?" }],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Proposal" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Proposed solution" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Risks" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Risk and mitigation" }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "weekly-review",
    title: "Weekly Review",
    description: "Wins, lessons, and priorities",
    docContent: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Wins" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "What went well" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Lessons" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "What I learned" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Next Week" }],
        },
        {
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Top priority" }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
];

function EditorClient({ documentId }: { documentId?: string }) {
  const [currentDoc, setCurrentDoc] = React.useState<Content | null>(null);
  const [showStylePanel, setShowStylePanel] = React.useState(false);
  const [showPublishSheet, setShowPublishSheet] = React.useState(false);
  const [Editor, setEditor] = React.useState<any>(null);
  const navigate = useNavigate();
  const content = useContentStore((state) => state.content);
  const isLoaded = useContentStore((state) => state.isLoaded);
  const updateContent = useContentStore((state) => state.updateContent);
  const series = useContentStore((state) => state.series);
  const createSeries = useContentStore((state) => state.createSeries);
  const updateSeries = useContentStore((state) => state.updateSeries);

  const loadedDoc = React.useMemo(
    () => (documentId ? content.find((doc) => doc.id === documentId) : null),
    [content, documentId]
  );

  React.useEffect(() => {
    if (!isLoaded) return;
    if (documentId) {
      if (loadedDoc) setCurrentDoc(loadedDoc);
      else navigate({ to: "/content" });
      return;
    }
    navigate({ to: "/content" });
  }, [documentId, navigate, isLoaded, loadedDoc]);

  React.useEffect(() => {
    Promise.all([
      import("@tiptap/react"),
      import("@tiptap/starter-kit"),
      import("@tiptap/extension-placeholder"),
      import("@tiptap/extension-typography"),
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
          TaskList,
          TaskItem,
          Highlight,
          CodeBlockLowlight,
          Markdown,
          lowlight,
        });
      }
    );
  }, []);

  const handleUpdateDoc = React.useCallback(
    (id: string, updates: Partial<Content>) => {
      try {
        const saved = updateContent(id, updates);
        if (saved) {
          setCurrentDoc((prev) =>
            prev ? { ...prev, ...updates, updatedAt: Date.now() } : null
          );
        }
        return saved;
      } catch (error) {
        console.error("Failed to update document:", error);
        return false;
      }
    },
    [updateContent]
  );

  if (!Editor || !currentDoc) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ background: "var(--color-linear-bg-primary)" }}
      >
        <div className="w-full max-w-3xl px-12 pt-16 pb-32">
          <div
            className="h-10 w-2/3 rounded animate-pulse"
            style={{ background: "var(--color-linear-bg-tertiary)" }}
          />
          <div
            className="mt-4 h-4 w-32 rounded animate-pulse"
            style={{ background: "var(--color-linear-bg-tertiary)" }}
          />
          <div className="mt-10 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-4 w-full rounded animate-pulse"
                style={{ background: "var(--color-linear-bg-tertiary)" }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <EditorInner
      Editor={Editor}
      document={currentDoc}
      onUpdateDoc={handleUpdateDoc}
      showStylePanel={showStylePanel}
      setShowStylePanel={setShowStylePanel}
      showPublishSheet={showPublishSheet}
      setShowPublishSheet={setShowPublishSheet}
      series={series}
      createSeries={createSeries}
      updateSeries={updateSeries}
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
  showStylePanel,
  setShowStylePanel,
  showPublishSheet,
  setShowPublishSheet,
  series,
  createSeries,
  updateSeries,
}: any) {
  const titleInputRef = React.useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = React.useState(document.title);
  const [styleConfig, setStyleConfig] = React.useState<StyleConfig>(
    document.styleConfig || DEFAULT_STYLE_CONFIG
  );
  const [saveState, setSaveState] = React.useState<
    "saved" | "saving" | "unsaved" | "error"
  >("saved");
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(
    new Date(document.updatedAt)
  );
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [showTemplates, setShowTemplates] = React.useState(false);
  const [showNewSeries, setShowNewSeries] = React.useState(false);
  const [newSeriesTitle, setNewSeriesTitle] = React.useState("");
  const [isFocusMode, setIsFocusMode] = React.useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("notex.focusMode") === "true";
    } catch {
      return false;
    }
  });
  const pendingUpdatesRef = React.useRef<Partial<Content> | null>(null);
  const saveTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const docDirtyRef = React.useRef(false);
  const titleRef = React.useRef(title);
  const navigate = useNavigate();
  const searchModal = useSearchModalContext();
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  const contentList = useContentStore((state) => state.content);
  const recentDocs = React.useMemo(() => {
    return getRecentContentFromList(contentList, 4).filter(
      (item) => item.id !== document.id
    );
  }, [contentList, document.id]);
  const setOpenRef = React.useRef(setOpen);
  const setOpenMobileRef = React.useRef(setOpenMobile);

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
    []
  );

  const editor = useEditor({
    extensions: getEditorExtensions({
      StarterKit,
      CodeBlockLowlight,
      Typography,
      TaskList,
      TaskItem,
      Highlight,
      Markdown,
      Placeholder,
      lowlight,
      enableDragHandle: true,
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
    if (document.docContent) {
      editor.commands.setContent(document.docContent, false);
    }
    setSaveState("saved");
    setLastSavedAt(new Date(document.updatedAt));
    setSaveError(null);
    pendingUpdatesRef.current = null;
    setShowTemplates(editor.isEmpty && !document.title.trim());
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, [document.id, editor]);

  React.useEffect(() => {
    if (!titleInputRef.current) return;
    if (document.title.trim() === "") {
      setTimeout(() => titleInputRef.current?.focus(), 50);
    }
  }, [document.id, document.title]);

  React.useEffect(() => {
    titleRef.current = title;
  }, [title]);

  const scheduleSave = React.useCallback(
    (
      updates: Partial<Content>,
      options: { includeDocContent?: boolean } = {}
    ) => {
      if (options.includeDocContent) {
        docDirtyRef.current = true;
      }
      pendingUpdatesRef.current = {
        ...(pendingUpdatesRef.current || {}),
        ...updates,
      };
      setSaveState("unsaved");
      setSaveError(null);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        const payload = pendingUpdatesRef.current;
        pendingUpdatesRef.current = null;
        if (!payload) return;
        if (docDirtyRef.current && editor) {
          payload.docContent = editor.getJSON();
          docDirtyRef.current = false;
        }
        if (Object.keys(payload).length === 0) return;
        setSaveState("saving");
        const saved = onUpdateDoc(document.id, payload);
        if (saved) {
          setSaveState("saved");
          setLastSavedAt(new Date());
          setSaveError(null);
        } else {
          setSaveState("error");
          setSaveError("Failed to save. Changes kept locally.");
        }
      }, 600);
    },
    [document.id, onUpdateDoc, editor]
  );

  React.useEffect(() => {
    const normalizedTitle = title.trim();
    const currentTitle = document.title.trim();
    if (normalizedTitle === currentTitle) return;
    if (!normalizedTitle && !currentTitle) return;
    scheduleSave({ title: normalizedTitle });
  }, [title, document.title, scheduleSave]);

  // Save style config changes
  const handleStyleChange = React.useCallback(
    (newConfig: Partial<StyleConfig>) => {
      const updatedConfig = { ...styleConfig, ...newConfig };
      setStyleConfig(updatedConfig);
      scheduleSave({ styleConfig: updatedConfig });
    },
    [styleConfig, scheduleSave]
  );

  React.useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.style.height = "auto";
      titleInputRef.current.style.height =
        titleInputRef.current.scrollHeight + "px";
    }
  }, [title]);

  React.useEffect(() => {
    if (!editor) return;
    setShowTemplates(editor.isEmpty && !title.trim());
  }, [editor, title]);

  React.useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

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
            { toJSON: () => ({}) }
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
    const handleUpdate = () => {
      scheduleSave({}, { includeDocContent: true });
      setShowTemplates(editor.isEmpty && !titleRef.current.trim());
    };
    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, scheduleSave]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === "f"
      ) {
        event.preventDefault();
        setIsFocusMode((prev) => !prev);
      }
      if (event.key === "Escape" && isFocusMode) {
        event.preventDefault();
        setIsFocusMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocusMode]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("notex.focusMode", String(isFocusMode));
    } catch {
      // ignore persistence errors
    }
  }, [isFocusMode]);

  React.useEffect(() => {
    setOpenRef.current = setOpen;
    setOpenMobileRef.current = setOpenMobile;
  }, [setOpen, setOpenMobile]);

  React.useEffect(() => {
    if (typeof document === "undefined" || !document.documentElement) {
      return;
    }
    const root = document.documentElement;
    if (isFocusMode) {
      root.classList.add("focus-mode");
    } else {
      root.classList.remove("focus-mode");
    }
    return () => root.classList.remove("focus-mode");
  }, [isFocusMode]);

  React.useEffect(() => {
    if (isMobile) {
      setOpenMobileRef.current(!isFocusMode);
    } else {
      setOpenRef.current(!isFocusMode);
    }
  }, [isFocusMode, isMobile]);

  if (!editor) return null;

  const closeSlashMenu = React.useCallback(() => {
    setShowSlashMenu(false);
    setReferenceElement(null);
  }, [setShowSlashMenu, setReferenceElement]);

  React.useEffect(() => {
    closeSlashMenu();
    setSearchQuery("");
  }, [document.id, closeSlashMenu, setSearchQuery]);

  const blockCommands = React.useMemo(
    () => buildBlockCommands(editor, closeSlashMenu),
    [editor, closeSlashMenu]
  );

  const filteredCommands = React.useMemo(
    () => filterBlockCommands(blockCommands, slashState.searchQuery),
    [blockCommands, slashState.searchQuery]
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
        prev >= filteredCommands.length - 1 ? 0 : prev + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? filteredCommands.length - 1 : prev - 1
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
  const saveLabel = React.useMemo(() => {
    if (saveState === "saving") return "Saving...";
    if (saveState === "unsaved") return "Editing...";
    if (saveState === "error") return "Save failed";
    if (lastSavedAt) {
      const time = lastSavedAt.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
      return `Saved · ${time}`;
    }
    return "Saved";
  }, [saveState, lastSavedAt]);

  const handleApplyTemplate = React.useCallback(
    (template: EditorTemplate) => {
      if (!editor) return;
      const nextTitle = titleRef.current.trim() || template.title;
      editor.commands.setContent(template.docContent, false);
      editor.commands.focus("start");
      setTitle(nextTitle);
      scheduleSave({
        title: nextTitle,
        docContent: template.docContent,
      });
      setShowTemplates(false);
    },
    [editor, scheduleSave]
  );

  const handleStartBlank = React.useCallback(() => {
    setShowTemplates(false);
    editor?.commands.focus("start");
  }, [editor]);

  const handleSeriesChange = React.useCallback(
    (nextSeriesId: string | null) => {
      const prevSeriesId = document.seriesId;
      if (prevSeriesId && prevSeriesId !== nextSeriesId) {
        const prevSeries = series.find((item) => item.id === prevSeriesId);
        if (prevSeries) {
          updateSeries(prevSeriesId, {
            contentIds: prevSeries.contentIds.filter(
              (id) => id !== document.id
            ),
          });
        }
      }
      if (nextSeriesId) {
        const nextSeries = series.find((item) => item.id === nextSeriesId);
        if (nextSeries && !nextSeries.contentIds.includes(document.id)) {
          updateSeries(nextSeriesId, {
            contentIds: [...nextSeries.contentIds, document.id],
          });
        }
      }
      scheduleSave({ seriesId: nextSeriesId || undefined });
    },
    [document.id, document.seriesId, scheduleSave, series, updateSeries]
  );

  const handleCreateSeries = React.useCallback(() => {
    const title = newSeriesTitle.trim();
    if (!title) return;
    const created = createSeries(title);
    updateSeries(created.id, { contentIds: [document.id] });
    scheduleSave({ seriesId: created.id });
    setNewSeriesTitle("");
    setShowNewSeries(false);
  }, [createSeries, document.id, newSeriesTitle, scheduleSave, updateSeries]);

  return (
    <div
      className="h-full flex flex-col relative"
      style={{ background: "var(--color-linear-bg-primary)" }}
      data-editor-shell
    >
      <div
        className="sticky top-0 z-30 border-b backdrop-blur-md"
        data-editor-topbar
        style={{
          background: "var(--color-linear-bg-elevated)",
          borderColor: "var(--color-linear-border-primary)",
          boxShadow: "var(--shadow-linear-sm)",
        }}
      >
        <div className="flex items-center justify-between px-8 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/content" })}
              className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-md transition-colors"
              style={{
                color: "var(--color-linear-text-secondary)",
                background: "var(--color-linear-bg-tertiary)",
              }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>All Docs</span>
            </button>
            <span
              className="text-xs"
              style={{ color: "var(--color-linear-text-tertiary)" }}
            >
              {saveLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <EditorActionButton
              icon={Search}
              label="Quick switcher"
              hint="⌘K"
              onClick={() => searchModal?.open()}
            />
            <EditorActionButton
              icon={Star}
              label={document.starred ? "Starred" : "Star"}
              onClick={() =>
                onUpdateDoc(document.id, { starred: !document.starred })
              }
              active={Boolean(document.starred)}
            />
            <EditorActionButton
              icon={isFocusMode ? Minimize2 : Maximize2}
              label={isFocusMode ? "Exit focus" : "Focus"}
              hint="⌘⇧F"
              onClick={() => setIsFocusMode((prev) => !prev)}
              active={isFocusMode}
            />
            <EditorActionButton
              icon={Palette}
              label="Format"
              onClick={() => setShowStylePanel(true)}
            />
            <EditorActionButton
              icon={Share2}
              label="Publish"
              onClick={() => setShowPublishSheet(true)}
            />
          </div>
        </div>
      </div>

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

      {showStylePanel && (
        <StylePanel
          styleConfig={styleConfig}
          publicTheme={document.publish?.theme}
          onPublicThemeChange={(theme) =>
            scheduleSave({
              publish: {
                ...(document.publish || { isPublic: false, theme: "minimal" }),
                theme,
              },
            })
          }
          onStyleChange={handleStyleChange}
          onClose={() => setShowStylePanel(false)}
        />
      )}

      <PublishSheet
        document={document}
        open={showPublishSheet}
        onOpenChange={setShowPublishSheet}
        onUpdateDoc={onUpdateDoc}
      />

      <div className="flex-1 overflow-auto" style={styleVars}>
        <div
          className={`${contentWidthClass} mx-auto px-12 pt-12 pb-32 animate-fadeInUp`}
          style={{ animationDelay: "0.05s" }}
        >
          <div className="flex items-start gap-10">
            <div className="flex-1 min-w-0">
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
                  fontFamily: "var(--editor-font-family)",
                }}
                rows={1}
              />
              <div className="mb-10 text-xs flex items-center gap-3">
                <span style={{ color: "var(--color-linear-text-tertiary)" }}>
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span style={{ color: "var(--color-linear-border-primary)" }}>
                  •
                </span>
                <span
                  style={{
                    color:
                      saveState === "error"
                        ? "#c23b3b"
                        : saveState === "saving"
                        ? "var(--color-linear-text-secondary)"
                        : "var(--color-linear-text-tertiary)",
                  }}
                >
                  {saveLabel}
                </span>
                {saveError && (
                  <span style={{ color: "#c23b3b" }}>{saveError}</span>
                )}
              </div>
              <div className="mb-8 flex items-center gap-2 text-xs">
                <span style={{ color: "var(--color-linear-text-tertiary)" }}>
                  Tags
                </span>
                <TagInput contentId={document.id} currentTags={document.tags} />
              </div>
              <div className="mb-10 flex items-center gap-3 text-xs flex-wrap">
                <span style={{ color: "var(--color-linear-text-tertiary)" }}>
                  Series
                </span>
                <select
                  className="px-2 py-1 rounded-md border bg-transparent text-xs"
                  style={{
                    borderColor: "var(--color-linear-border-primary)",
                    color: "var(--color-linear-text-secondary)",
                  }}
                  value={document.seriesId || ""}
                  onChange={(e) => handleSeriesChange(e.target.value || null)}
                >
                  <option value="">None</option>
                  {series.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowNewSeries((prev) => !prev)}
                  className="px-2 py-1 rounded-md border"
                  style={{
                    borderColor: "var(--color-linear-border-primary)",
                    color: "var(--color-linear-text-secondary)",
                  }}
                >
                  New series
                </button>
                {showNewSeries && (
                  <div className="flex items-center gap-2">
                    <input
                      value={newSeriesTitle}
                      onChange={(e) => setNewSeriesTitle(e.target.value)}
                      placeholder="Series title"
                      className="px-2 py-1 rounded-md border bg-transparent text-xs"
                      style={{
                        borderColor: "var(--color-linear-border-primary)",
                        color: "var(--color-linear-text-secondary)",
                      }}
                    />
                    <button
                      onClick={handleCreateSeries}
                      className="px-2 py-1 rounded-md border"
                      style={{
                        borderColor: "var(--color-linear-border-primary)",
                        color: "var(--color-linear-text-secondary)",
                      }}
                    >
                      Create
                    </button>
                  </div>
                )}
              </div>
              {showTemplates && (
                <div
                  className="mb-10 rounded-2xl border p-5"
                  style={{
                    background: "var(--color-linear-bg-secondary)",
                    borderColor: "var(--color-linear-border-primary)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div
                        className="text-sm font-medium"
                        style={{ color: "var(--color-linear-text-primary)" }}
                      >
                        Start with a writing template
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--color-linear-text-tertiary)" }}
                      >
                        Choose a structure to stay in flow.
                      </div>
                    </div>
                    <button
                      onClick={handleStartBlank}
                      className="text-xs px-2.5 py-1.5 rounded-md transition-colors"
                      style={{
                        background: "var(--color-linear-bg-tertiary)",
                        color: "var(--color-linear-text-secondary)",
                      }}
                    >
                      Start blank
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {WRITING_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleApplyTemplate(template)}
                        className="text-left rounded-xl border p-4 transition-all hover:shadow-sm"
                        style={{
                          background: "var(--color-linear-bg-elevated)",
                          borderColor: "var(--color-linear-border-primary)",
                        }}
                      >
                        <div
                          className="text-sm font-medium mb-1"
                          style={{ color: "var(--color-linear-text-primary)" }}
                        >
                          {template.title}
                        </div>
                        <div
                          className="text-xs leading-relaxed"
                          style={{ color: "var(--color-linear-text-tertiary)" }}
                        >
                          {template.description}
                        </div>
                      </button>
                    ))}
                  </div>
                  {recentDocs.length > 0 && (
                    <div className="mt-6">
                      <div
                        className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"
                        style={{ color: "var(--color-linear-text-tertiary)" }}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        Recent drafts
                      </div>
                      <div className="grid gap-2">
                        {recentDocs.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() =>
                              navigate({
                                to: "/editor",
                                search: { id: doc.id },
                              })
                            }
                            className="w-full text-left rounded-xl border px-3 py-2 transition-colors"
                            style={{
                              background: "var(--color-linear-bg-elevated)",
                              borderColor: "var(--color-linear-border-primary)",
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-7 w-7 rounded-md flex items-center justify-center"
                                style={{
                                  background: "var(--color-linear-bg-tertiary)",
                                  color: "var(--color-linear-text-secondary)",
                                }}
                              >
                                <FileText className="h-3.5 w-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div
                                  className="text-sm font-medium truncate"
                                  style={{
                                    color: "var(--color-linear-text-primary)",
                                  }}
                                >
                                  {doc.title || "Untitled"}
                                </div>
                                <div
                                  className="text-xs truncate"
                                  style={{
                                    color: "var(--color-linear-text-tertiary)",
                                  }}
                                >
                                  {getContentPreview(doc, 80, "Empty document")}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <EditorContent editor={editor} className={EDITOR_CONTENT_CLASS} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditorActionButton({
  icon: Icon,
  label,
  hint,
  onClick,
  active = false,
  disabled = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint?: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-md transition-colors"
      style={{
        background: active
          ? "var(--color-linear-bg-tertiary)"
          : "var(--color-linear-bg-elevated)",
        border: "1px solid var(--color-linear-border-primary)",
        color: "var(--color-linear-text-secondary)",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      title={hint ? `${label} (${hint})` : label}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{label}</span>
      {hint ? (
        <span
          className="text-[10px] px-1.5 py-0.5 rounded"
          style={{
            background: "var(--color-linear-bg-secondary)",
            color: "var(--color-linear-text-tertiary)",
          }}
        >
          {hint}
        </span>
      ) : null}
    </button>
  );
}

export function Editor({ documentId }: { documentId?: string }) {
  if (typeof window === "undefined") {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ background: "var(--color-linear-bg-primary)" }}
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
  return <EditorClient documentId={documentId} />;
}
