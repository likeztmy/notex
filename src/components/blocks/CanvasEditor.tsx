import * as React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import type { Block } from "~/types/block";
import { createBlock } from "~/types/block";
import { BlockRenderer } from "./BlockRenderer";
import { BlockPicker } from "./BlockPicker";

interface CanvasEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

function SortableBlock({
  block,
  onChange,
  onDelete,
  onDuplicate,
}: {
  block: Block;
  onChange: (blockId: string, updates: Partial<Block>) => void;
  onDelete: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get grid width class
  const getWidthClass = () => {
    switch (block.width) {
      case "half":
        return "md:col-span-6";
      case "third":
        return "md:col-span-4";
      case "two-thirds":
        return "md:col-span-8";
      case "full":
      default:
        return "md:col-span-12";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`col-span-12 ${getWidthClass()}`}
    >
      <BlockRenderer
        block={block}
        onChange={onChange}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}

export function CanvasEditor({ blocks, onChange }: CanvasEditorProps) {
  const [showBlockPicker, setShowBlockPicker] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const sortedBlocks = React.useMemo(() => {
    return [...blocks].sort((a, b) => a.order - b.order);
  }, [blocks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedBlocks.findIndex((b) => b.id === active.id);
      const newIndex = sortedBlocks.findIndex((b) => b.id === over.id);

      const moved = arrayMove(sortedBlocks, oldIndex, newIndex);
      // Update order property for each block
      moved.forEach((block, index) => {
        block.order = index;
      });

      // @ts-ignore - arrayMove preserves types correctly at runtime
      onChange(moved);
    }
  };

  const handleAddBlock = (type: Block["type"]) => {
    const newBlock = createBlock(type, { order: blocks.length });
    onChange([...blocks, newBlock]);
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<Block>) => {
    const updated = blocks.map((block) =>
      block.id === blockId
        ? { ...block, ...updates, updatedAt: Date.now() }
        : block,
    );
    // @ts-ignore - Type is correctly preserved at runtime
    onChange(updated);
  };

  const handleDeleteBlock = (blockId: string) => {
    onChange(blocks.filter((block) => block.id !== blockId));
  };

  const handleDuplicateBlock = (blockId: string) => {
    const blockToDuplicate = blocks.find((b) => b.id === blockId);
    if (!blockToDuplicate) return;

    const duplicated = {
      ...blockToDuplicate,
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      order: blocks.length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    onChange([...blocks, duplicated]);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-linear-bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Empty State */}
        {blocks.length === 0 ? (
          <div className="text-center py-20">
            <h2
              className="text-2xl font-semibold mb-4"
              style={{ color: "var(--color-linear-text-primary)" }}
            >
              Start building your canvas
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: "var(--color-linear-text-tertiary)" }}
            >
              Add blocks to create your document
            </p>
            <button
              onClick={() => setShowBlockPicker(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium"
              style={{
                background: "var(--color-linear-accent-primary)",
                color: "white",
              }}
            >
              <Plus className="w-5 h-5" />
              Add your first block
            </button>
          </div>
        ) : (
          <>
            {/* Grid Container */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedBlocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-12 gap-6 mb-6">
                  {sortedBlocks.map((block) => (
                    <SortableBlock
                      key={block.id}
                      block={block}
                      onChange={handleUpdateBlock}
                      onDelete={handleDeleteBlock}
                      onDuplicate={handleDuplicateBlock}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Add Block Button */}
            <button
              onClick={() => setShowBlockPicker(true)}
              className="w-full py-3 rounded-lg border-2 border-dashed hover:border-solid hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              style={{
                borderColor: "var(--color-linear-border-primary)",
                color: "var(--color-linear-text-tertiary)",
              }}
            >
              <Plus className="w-5 h-5" />
              Add block
            </button>
          </>
        )}
      </div>

      {/* Block Picker Modal */}
      {showBlockPicker && (
        <BlockPicker
          onSelect={handleAddBlock}
          onClose={() => setShowBlockPicker(false)}
        />
      )}
    </div>
  );
}
