import * as React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import type { CodeBlock as CodeBlockType, CodeLanguage } from "~/types/block";

interface CodeBlockProps {
  block: CodeBlockType;
  onChange: (updates: Partial<CodeBlockType>) => void;
}

const LANGUAGES: CodeLanguage[] = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "python",
  "java",
  "go",
  "rust",
  "html",
  "css",
  "json",
  "yaml",
  "bash",
  "sql",
  "markdown",
];

export function CodeBlock({ block, onChange }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(block.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={block.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Code snippet title"
          className="text-sm font-medium border-none outline-none bg-transparent"
          style={{ color: "var(--color-linear-text-primary)" }}
        />
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <select
            value={block.language}
            onChange={(e) =>
              onChange({ language: e.target.value as CodeLanguage })
            }
            className="text-xs px-2 py-1 rounded border"
            style={{
              borderColor: "var(--color-linear-border-primary)",
              color: "var(--color-linear-text-secondary)",
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          {/* Copy Button */}
          <button
            onClick={copyCode}
            className="text-xs px-2 py-1 rounded flex items-center gap-1"
            style={{
              background: "var(--color-linear-bg-secondary)",
              color: "var(--color-linear-text-secondary)",
            }}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      {isEditing ? (
        <textarea
          value={block.code}
          onChange={(e) => onChange({ code: e.target.value })}
          onBlur={() => setIsEditing(false)}
          autoFocus
          className="w-full h-64 p-4 font-mono text-sm border rounded resize-none"
          style={{
            borderColor: "var(--color-linear-border-primary)",
            background: "#1e1e1e",
            color: "#d4d4d4",
          }}
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="cursor-text overflow-hidden rounded"
        >
          {block.code ? (
            <SyntaxHighlighter
              language={block.language}
              style={vscDarkPlus}
              showLineNumbers={block.showLineNumbers}
              customStyle={{
                margin: 0,
                padding: "16px",
                fontSize: "14px",
              }}
            >
              {block.code}
            </SyntaxHighlighter>
          ) : (
            <div
              className="h-32 flex items-center justify-center border-2 border-dashed rounded"
              style={{ borderColor: "var(--color-linear-border-primary)" }}
            >
              <p
                className="text-sm"
                style={{ color: "var(--color-linear-text-tertiary)" }}
              >
                Click to add code
              </p>
            </div>
          )}
        </div>
      )}

      {/* Options */}
      <label
        className="flex items-center gap-2 text-xs"
        style={{ color: "var(--color-linear-text-secondary)" }}
      >
        <input
          type="checkbox"
          checked={block.showLineNumbers}
          onChange={(e) => onChange({ showLineNumbers: e.target.checked })}
          className="rounded"
        />
        Show line numbers
      </label>
    </div>
  );
}
