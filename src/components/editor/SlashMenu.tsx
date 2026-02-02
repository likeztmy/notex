import * as React from "react";
import { createPortal } from "react-dom";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
} from "@floating-ui/react";
import type { VirtualElement } from "./types";
import type { BlockCommand } from "./blockCommands";

const SLASH_MENU_CSS = `
.slash-menu-scroll::-webkit-scrollbar { width: 6px; }
.slash-menu-scroll::-webkit-scrollbar-track { background: transparent; }
.slash-menu-scroll::-webkit-scrollbar-thumb {
  background: var(--color-linear-border-primary);
  border-radius: 3px;
}
.slash-menu-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--color-linear-text-tertiary);
}
`;

export interface SlashMenuProps {
  referenceElement: VirtualElement | null;
  commands: BlockCommand[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onRunCommand: (index: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function SlashMenu({
  referenceElement,
  commands,
  selectedIndex,
  onSelectIndex,
  onRunCommand,
  onKeyDown,
}: SlashMenuProps) {
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    strategy: "fixed",
    middleware: [
      offset(8),
      flip({ fallbackPlacements: ["top-start", "bottom-end", "top-end"] }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: referenceElement ? autoUpdate : undefined,
  });

  // Virtual elements must be set via setPositionReference (Floating UI does not accept them as `reference` prop)
  React.useEffect(() => {
    refs.setPositionReference(referenceElement);
    return () => refs.setPositionReference(null);
  }, [referenceElement, refs]);

  React.useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [selectedIndex]);

  if (!referenceElement) return null;

  const menuContent = (
    <div
      ref={refs.setFloating}
      role="listbox"
      aria-activedescendant={
        commands[selectedIndex] ? `slash-item-${selectedIndex}` : undefined
      }
      className="fixed z-[100] rounded-xl overflow-hidden"
      style={{
        ...floatingStyles,
        width: 280,
        animation: "slideUpFade 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        background: "var(--color-linear-bg-elevated)",
        border: "1px solid var(--color-linear-border-primary)",
        boxShadow: "var(--shadow-linear-lg)",
      }}
      onKeyDown={onKeyDown}
    >
      <style>{SLASH_MENU_CSS}</style>
      <div className="max-h-[320px] overflow-y-auto slash-menu-scroll">
        {commands.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm" style={{ color: "var(--color-linear-text-tertiary)" }}>
            No matches
          </div>
        ) : (
          <div className="py-1">
            {commands.map((item, index) => (
              <SlashMenuItem
                key={index}
                item={item}
                index={index}
                isSelected={index === selectedIndex}
                itemRef={(el) => {
                  itemRefs.current[index] = el;
                }}
                onSelect={() => onSelectIndex(index)}
                onRun={() => onRunCommand(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(menuContent, document.body);
}

interface SlashMenuItemProps {
  item: BlockCommand;
  index: number;
  isSelected: boolean;
  itemRef: (el: HTMLButtonElement | null) => void;
  onSelect: () => void;
  onRun: () => void;
}

function SlashMenuItem({
  item,
  index,
  isSelected,
  itemRef,
  onSelect,
  onRun,
}: SlashMenuItemProps) {
  return (
    <button
      ref={itemRef}
      id={`slash-item-${index}`}
      role="option"
      aria-selected={isSelected}
      type="button"
      onClick={onRun}
      onMouseEnter={onSelect}
      className="w-full px-3 py-2 text-left transition-colors duration-150 flex items-center gap-2.5"
      style={{
        background: isSelected
          ? "var(--color-linear-bg-tertiary)"
          : "transparent",
        color: "var(--color-linear-text-primary)",
      }}
    >
      <span
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-xs rounded-md"
        style={{
          background: isSelected
            ? "var(--color-linear-accent-primary)"
            : "var(--color-linear-bg-tertiary)",
          color: isSelected
            ? "var(--color-linear-bg-elevated)"
            : "var(--color-linear-text-primary)",
        }}
      >
        {item.icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="text-sm font-normal block mb-0.5">{item.title}</span>
        <span
          className="text-xs leading-tight block"
          style={{ color: "var(--color-linear-text-secondary)" }}
        >
          {item.description}
        </span>
      </span>
    </button>
  );
}
