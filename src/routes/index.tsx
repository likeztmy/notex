import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#fafaf9" }}
    >
      <div className="w-full max-w-5xl px-8 py-20">
        {/* Main Content - Ultra Minimal */}
        <div className="text-center mb-20">
          <h1
            className="text-[72px] font-light tracking-[-0.02em] mb-6"
            style={{ color: "#1a1a1a", letterSpacing: "-0.03em" }}
          >
            notex
          </h1>
          <p
            className="text-lg font-light mb-16"
            style={{ color: "#666666", letterSpacing: "0.01em" }}
          >
            A thoughtful space for your ideas
          </p>

          {/* Simple Buttons */}
          <div className="flex justify-center gap-4 mb-32">
            <Link to="/content" className="muji-button-primary">
              Browse Docs
            </Link>
            <Link
              to="/editor"
              search={{ create: "true", mode: "doc" }}
              className="muji-button-secondary"
            >
              Create Document
            </Link>
            <Link
              to="/editor"
              search={{ create: "true", mode: "canvas" }}
              className="muji-button-secondary"
            >
              Create Canvas
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
          <div className="h-px w-full mb-8" style={{ background: "#e5e5e5" }} />
          <p
            className="text-xs font-light tracking-wider"
            style={{ color: "#999999" }}
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
        style={{ color: "#1a1a1a", letterSpacing: "0.05em" }}
      >
        {title}
      </h3>
      <p
        className="text-sm font-light leading-relaxed"
        style={{ color: "#737373", letterSpacing: "0.01em" }}
      >
        {description}
      </p>
    </div>
  );
}
