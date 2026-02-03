import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--color-linear-bg-primary)" }}
    >
      <div className="w-full max-w-5xl px-8 py-20">
        {/* Main Content - Ultra Minimal */}
        <div className="text-center mb-20">
          <h1
            className="text-[72px] font-light tracking-[-0.02em] mb-6"
            style={{
              color: "var(--color-linear-text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            notex
          </h1>
          <p
            className="text-lg font-light mb-16"
            style={{
              color: "var(--color-linear-text-secondary)",
              letterSpacing: "0.01em",
            }}
          >
            A thoughtful space for your ideas
          </p>

          {/* Simple Buttons */}
          <div className="flex justify-center gap-4 mb-32">
            <Link
              to="/content"
              className="px-8 py-3 text-sm font-normal rounded transition-all"
              style={{
                background: "var(--color-linear-accent-primary)",
                color: "var(--color-linear-bg-primary)",
                letterSpacing: "0.01em",
              }}
            >
              Browse Docs
            </Link>
            <Link
              to="/editor"
              search={{ create: "true" }}
              className="px-8 py-3 text-sm font-normal rounded transition-all"
              style={{
                background: "transparent",
                color: "var(--color-linear-text-primary)",
                border: "1px solid var(--color-linear-border-hover)",
                letterSpacing: "0.01em",
              }}
            >
              Create Document
            </Link>
          </div>
        </div>

        {/* Features - Minimal Grid */}
        <div className="grid grid-cols-3 gap-12 mb-32">
          <FeatureCard
            title="Rich Editor"
            description="Write with a powerful block-based editor"
          />
          <FeatureCard
            title="Smart Organization"
            description="Organize documents with folders and tags"
          />
          <FeatureCard
            title="Fast & Local"
            description="Lightning-fast with local storage"
          />
        </div>

        {/* Minimal Footer */}
        <div className="text-center">
          <div
            className="h-px w-full mb-8"
            style={{ background: "var(--color-linear-border-primary)" }}
          />
          <p
            className="text-xs font-light tracking-wider"
            style={{ color: "var(--color-linear-text-tertiary)" }}
          >
            BUILT FOR CLARITY
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <h3
        className="text-sm font-normal mb-3 tracking-wide"
        style={{
          color: "var(--color-linear-text-primary)",
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </h3>
      <p
        className="text-sm font-light leading-relaxed"
        style={{
          color: "var(--color-linear-text-secondary)",
          letterSpacing: "0.01em",
        }}
      >
        {description}
      </p>
    </div>
  );
}
