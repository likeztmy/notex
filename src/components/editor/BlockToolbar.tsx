import * as React from "react";
import { Copy, Trash2 } from "lucide-react";

interface BlockToolbarProps {
  editor: any;
  node: any;
  getPos: (() => number) | number;
}

export function BlockToolbar({ editor, node, getPos }: BlockToolbarProps) {
  const resolvePos = React.useCallback(() => {
    return typeof getPos === "function" ? getPos() : getPos;
  }, [getPos]);

  const handleDelete = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const pos = resolvePos();
      if (typeof pos !== "number") return;
      editor
        ?.chain()
        .focus()
        .deleteRange({ from: pos, to: pos + node.nodeSize })
        .run();
    },
    [editor, node.nodeSize, resolvePos]
  );

  const handleDuplicate = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const pos = resolvePos();
      if (typeof pos !== "number") return;
      editor
        ?.chain()
        .focus()
        .insertContentAt(pos + node.nodeSize, {
          type: node.type.name,
          attrs: node.attrs,
        })
        .run();
    },
    [editor, node, resolvePos]
  );

  return (
    <div className="tiptap-block-toolbar">
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={handleDuplicate}
        title="Duplicate block"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={handleDelete}
        title="Delete block"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
