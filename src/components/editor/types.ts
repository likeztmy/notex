/**
 * Virtual element for Floating UI: provides getBoundingClientRect
 * so we can position the slash menu at the cursor (no DOM node).
 */
export interface VirtualElement {
  getBoundingClientRect: () => DOMRect;
}

export interface SlashMenuState {
  show: boolean;
  referenceElement: VirtualElement | null;
  searchQuery: string;
  selectedIndex: number;
}
