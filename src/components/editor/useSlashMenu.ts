import * as React from "react";
import type { VirtualElement, SlashMenuState } from "./types";

/** Refs passed to the keydown handler so it can trigger run-command without re-creating the handler. */
export interface SlashMenuHandlerRefs {
  onRunCommand: React.MutableRefObject<((index: number) => void) | null>;
}

export interface UseSlashMenuReturn {
  state: SlashMenuState;
  setShow: (show: boolean) => void;
  setReferenceElement: (element: VirtualElement | null) => void;
  setSearchQuery: (q: string) => void;
  setSelectedIndex: (index: number | ((prev: number) => number)) => void;
  getHandleKeyDown: (
    handlerRefs: SlashMenuHandlerRefs
  ) => (view: any, event: KeyboardEvent) => boolean;
}

export function useSlashMenu(): UseSlashMenuReturn {
  const [show, setShow] = React.useState(false);
  const [referenceElement, setReferenceElement] =
    React.useState<VirtualElement | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const showRef = React.useRef(false);
  const selectedIndexRef = React.useRef(0);

  React.useEffect(() => {
    showRef.current = show;
    selectedIndexRef.current = selectedIndex;
  });

  const setShowRef = React.useRef(setShow);
  const setReferenceElementRef = React.useRef(setReferenceElement);
  const setSelectedIndexRef = React.useRef(setSelectedIndex);
  const setSearchQueryRef = React.useRef(setSearchQuery);
  React.useEffect(() => {
    setShowRef.current = setShow;
    setReferenceElementRef.current = setReferenceElement;
    setSelectedIndexRef.current = setSelectedIndex;
    setSearchQueryRef.current = setSearchQuery;
  });

  const getHandleKeyDown = React.useCallback(
    (handlerRefs: SlashMenuHandlerRefs) =>
      (view: any, event: KeyboardEvent) => {
        const { state } = view;
        const { selection } = state;
        const { $from } = selection;

        if (event.key === "/" && !showRef.current) {
          showRef.current = true;
          setShowRef.current(true);
          setSelectedIndexRef.current(0);
          setSearchQueryRef.current("");
          setReferenceElementRef.current(null);
          return false;
        }

        if (!showRef.current) return false;

        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            setSelectedIndexRef.current((prev: number) => prev + 1);
            return true;
          case "ArrowUp":
            event.preventDefault();
            setSelectedIndexRef.current((prev: number) =>
              prev === 0 ? 0 : prev - 1
            );
            return true;
          case "Enter":
            event.preventDefault();
            handlerRefs.onRunCommand.current?.(selectedIndexRef.current);
            return true;
          case "Escape":
            event.preventDefault();
            const line = $from.parent.textContent || "";
            const cursorPos = $from.parentOffset;
            const slashIndex = line.lastIndexOf("/", cursorPos);
            if (slashIndex !== -1) {
              const fromPos = $from.start() + slashIndex;
              const toPos = $from.start() + cursorPos;
              view.dispatch(view.state.tr.delete(fromPos, toPos));
            }
            showRef.current = false;
            setShowRef.current(false);
            setSearchQueryRef.current("");
            setReferenceElementRef.current(null);
            return true;
          default:
            return false;
        }
      },
    []
  );

  return {
    state: { show, referenceElement, searchQuery, selectedIndex },
    setShow,
    setReferenceElement,
    setSearchQuery,
    setSelectedIndex,
    getHandleKeyDown,
  };
}
