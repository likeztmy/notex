import * as React from "react";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import tsx from "highlight.js/lib/languages/tsx";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import { Copy, Check, PencilLine, Eye } from "lucide-react";
import type { CodeBlock as CodeBlockType, CodeLanguage } from "~/types/block";
import styles from "./CodeBlock.module.css";

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

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("css", css);
hljs.registerLanguage("go", go);
hljs.registerLanguage("java", java);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("python", python);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("tsx", tsx);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("yaml", yaml);

export function CodeBlock({ block, onChange }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const showLineNumbers = block.showLineNumbers ?? true;
  const wrapLines = block.wrapLines ?? false;
  const highlighted = React.useMemo(() => {
    if (!block.code) return "";
    if (hljs.getLanguage(block.language)) {
      return hljs.highlight(block.code, { language: block.language }).value;
    }
    return hljs.highlightAuto(block.code).value;
  }, [block.code, block.language]);
  const highlightedLines = React.useMemo(
    () => highlighted.split("\n"),
    [highlighted]
  );

  const copyCode = async () => {
    await navigator.clipboard.writeText(block.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditorKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const target = event.currentTarget;
      const start = target.selectionStart || 0;
      const end = target.selectionEnd || 0;
      const value = block.code || "";
      const insert = "  ";
      const nextValue = `${value.slice(0, start)}${insert}${value.slice(end)}`;
      onChange({ code: nextValue });
      requestAnimationFrame(() => {
        target.selectionStart = start + insert.length;
        target.selectionEnd = start + insert.length;
      });
    }
  };

  return (
    <div className={styles.shell}>
      {/* Header */}
      <div className={styles.header}>
        <input
          type="text"
          value={block.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Code snippet title"
          className={styles.title}
        />
        <div className={styles.controls}>
          {/* Language Selector */}
          <select
            value={block.language}
            onChange={(e) =>
              onChange({ language: e.target.value as CodeLanguage })
            }
            className={styles.pill}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className={styles.pill}
          >
            {isEditing ? (
              <Eye className="w-3 h-3" />
            ) : (
              <PencilLine className="w-3 h-3" />
            )}
            {isEditing ? "Preview" : "Edit"}
          </button>

          {/* Copy Button */}
          <button onClick={copyCode} className={styles.pill}>
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
      <div className={styles.body}>
        {isEditing ? (
          <textarea
            value={block.code}
            onChange={(e) => onChange({ code: e.target.value })}
            autoFocus
            onKeyDown={handleEditorKeyDown}
            className={styles.editor}
          />
        ) : (
          <div onClick={() => setIsEditing(true)} className={styles.preview}>
            {block.code ? (
              <div
                className={`${styles.lines} hljs ${
                  wrapLines ? styles.isWrapped : ""
                }`}
                style={{ maxHeight: isExpanded ? "none" : "320px" }}
              >
                {highlightedLines.map((line, index) => (
                  <div key={index} className={styles.line}>
                    {showLineNumbers && (
                      <span className={styles.lineNumber}>{index + 1}</span>
                    )}
                    <span
                      className={styles.lineContent}
                      dangerouslySetInnerHTML={{
                        __html: line || "&nbsp;",
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <p>Click to add code</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Options */}
      <div className={styles.footer}>
        <label className={styles.optionLabel}>
          <input
            type="checkbox"
            checked={showLineNumbers}
            onChange={(e) => onChange({ showLineNumbers: e.target.checked })}
            className="rounded"
          />
          Show line numbers
        </label>
        <label className={styles.optionLabel}>
          <input
            type="checkbox"
            checked={wrapLines}
            onChange={(e) => onChange({ wrapLines: e.target.checked })}
            className="rounded"
          />
          Wrap lines
        </label>
        {block.code && (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className={styles.pill}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        )}
      </div>
    </div>
  );
}
