import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { motion } from "framer-motion";

const DocumentList = React.lazy(() =>
  import("~/components/DocumentList").then((mod) => ({
    default: mod.DocumentList,
  })),
);

export const Route = createFileRoute("/docs")({
  component: DocsPage,
});

function DocsPage() {
  const navigate = useNavigate();

  const handleSelectDoc = (id: string) => {
    navigate({ to: "/editor", search: { id } });
  };

  return (
    <React.Suspense
      fallback={
        <div
          className="min-h-screen flex flex-col"
          style={{ background: "var(--color-linear-bg-secondary)" }}
        >
          {/* Header skeleton */}
          <div className="flex items-center justify-between px-6 py-4">
            <motion.div
              className="h-7 w-32 rounded"
              style={{ background: "var(--color-linear-bg-tertiary)" }}
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="h-8 w-8 rounded"
                  style={{ background: "var(--color-linear-bg-tertiary)" }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.08,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Content skeleton */}
          <div className="px-6 space-y-3 mt-2">
            <motion.div
              className="h-6 rounded"
              style={{ background: "var(--color-linear-bg-tertiary)" }}
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.16,
              }}
            />
            <motion.div
              className="h-10 rounded border-t border-b"
              style={{
                background: "var(--color-linear-bg-tertiary)",
                borderColor: "var(--color-linear-border-primary)",
              }}
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.24,
              }}
            />
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div
                key={i}
                className="h-14 rounded"
                style={{ background: "var(--color-linear-bg-tertiary)" }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.32 + i * 0.04,
                }}
              />
            ))}
          </div>
        </div>
      }
    >
      <DocumentList onSelectDoc={handleSelectDoc} />
    </React.Suspense>
  );
}
