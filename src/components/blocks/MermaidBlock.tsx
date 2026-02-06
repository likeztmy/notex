import * as React from "react";
import mermaid from "mermaid";
import type { MermaidBlock as MermaidBlockType } from "~/types/block";

interface MermaidBlockProps {
  block: MermaidBlockType;
  onChange: (updates: Partial<MermaidBlockType>) => void;
}

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
});

export function MermaidBlock({ block, onChange }: MermaidBlockProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const diagramRef = React.useRef<HTMLDivElement>(null);
  const mermaidId = React.useRef(`mermaid-${block.id}`);

  const renderDiagram = React.useCallback(async () => {
    if (!diagramRef.current || !block.diagram || isEditing) return;

    try {
      setError(null);
      // Clear previous content
      diagramRef.current.innerHTML = "";

      // Render new diagram
      const { svg } = await mermaid.render(mermaidId.current, block.diagram);
      diagramRef.current.innerHTML = svg;
    } catch (err: any) {
      console.error("Mermaid render error:", err);
      setError(err.message || "Failed to render diagram");
    }
  }, [block.diagram, isEditing, block.id]);

  React.useEffect(() => {
    if (!isEditing) {
      renderDiagram();
    }
  }, [isEditing, renderDiagram]);

  const EXAMPLE_DIAGRAMS = [
    {
      name: "Flowchart",
      code: `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`,
    },
    {
      name: "Sequence",
      code: `sequenceDiagram
    Alice->>Bob: Hello Bob
    Bob->>Alice: Hi Alice
    Alice->>Bob: How are you?
    Bob->>Alice: I'm good!`,
    },
    {
      name: "Class Diagram",
      code: `classDiagram
    Animal <|-- Dog
    Animal <|-- Cat
    Animal: +String name
    Animal: +makeSound()`,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={block.title || ""}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Diagram title"
            className="w-full text-sm font-semibold border-none outline-none bg-transparent"
            style={{ color: "var(--color-linear-text-primary)" }}
          />
          <div className="block-label">Mermaid</div>
        </div>
        <div
          className="flex gap-1 rounded-full p-1"
          style={{ background: "var(--color-linear-bg-tertiary)" }}
        >
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs px-3 py-1 rounded-full"
            style={{
              background: isEditing
                ? "var(--color-linear-bg-elevated)"
                : "transparent",
              color: "var(--color-linear-text-secondary)",
              boxShadow: isEditing ? "var(--shadow-linear-sm)" : "none",
            }}
          >
            Edit
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="text-xs px-3 py-1 rounded-full"
            style={{
              background: !isEditing
                ? "var(--color-linear-bg-elevated)"
                : "transparent",
              color: "var(--color-linear-text-secondary)",
              boxShadow: !isEditing ? "var(--shadow-linear-sm)" : "none",
            }}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Examples (only when editing) */}
      {isEditing && (
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-xs"
            style={{ color: "var(--color-linear-text-tertiary)" }}
          >
            Examples:
          </span>
          {EXAMPLE_DIAGRAMS.map((example) => (
            <button
              key={example.name}
              onClick={() => onChange({ diagram: example.code })}
              className="text-xs px-2 py-1 rounded-full"
              style={{
                color: "var(--color-linear-text-secondary)",
                background: "var(--color-linear-bg-tertiary)",
              }}
            >
              {example.name}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {isEditing ? (
        <textarea
          value={block.diagram}
          onChange={(e) => onChange({ diagram: e.target.value })}
          className="w-full h-64 p-4 font-mono text-sm border rounded-xl resize-none"
          style={{
            borderColor: "var(--color-linear-border-primary)",
            background: "var(--color-linear-bg-secondary)",
          }}
          placeholder="Enter Mermaid diagram syntax..."
        />
      ) : (
        <div
          className="p-6 rounded-xl border min-h-[200px] flex items-center justify-center"
          style={{
            borderColor: "var(--color-linear-border-primary)",
            background: "var(--color-linear-bg-secondary)",
          }}
        >
          {error ? (
            <div className="text-red-500 text-sm">
              <p className="font-semibold mb-2">Error rendering diagram:</p>
              <pre className="text-xs whitespace-pre-wrap">{error}</pre>
            </div>
          ) : (
            <div ref={diagramRef} className="mermaid-diagram" />
          )}
        </div>
      )}

      {/* Help Text */}
      <p
        className="text-xs"
        style={{ color: "var(--color-linear-text-tertiary)" }}
      >
        Learn Mermaid syntax at{" "}
        <a
          href="https://mermaid.js.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: "var(--color-linear-accent-primary)" }}
        >
          mermaid.js.org
        </a>
      </p>
    </div>
  );
}
