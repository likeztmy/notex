import * as React from "react";
import { SearchIcon, LayoutGridIcon, ListIcon, SlidersIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  itemCount?: number;
  showViewToggle?: boolean;
  view?: "grid" | "list";
  onViewChange?: (view: "grid" | "list") => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  itemCount,
  showViewToggle = false,
  view = "list",
  onViewChange,
  showSearch = false,
  searchPlaceholder = "Search...",
  onSearch,
  actions,
  className,
}: PageHeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <header
      className={cn(
        "flex flex-col gap-4 px-8 py-6",
        "border-b border-[--color-linear-border-primary]",
        "bg-[--color-linear-bg-primary]",
        className
      )}
    >
      {/* Top Row: Title + Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-2xl font-semibold text-[--color-linear-text-primary] truncate">
            {title}
          </h1>
          {itemCount !== undefined && (
            <span className="text-xs px-2 py-1 rounded-full bg-[--color-linear-bg-tertiary] text-[--color-linear-text-secondary] font-medium whitespace-nowrap">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* View Toggle */}
          {showViewToggle && (
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[--color-linear-bg-secondary]">
              <button
                onClick={() => onViewChange?.("grid")}
                className={cn(
                  "p-1.5 rounded transition-colors duration-150",
                  view === "grid"
                    ? "bg-[--color-linear-bg-primary] text-[--color-linear-text-primary]"
                    : "text-[--color-linear-text-tertiary] hover:text-[--color-linear-text-secondary]"
                )}
                aria-label="Grid view"
              >
                <LayoutGridIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewChange?.("list")}
                className={cn(
                  "p-1.5 rounded transition-colors duration-150",
                  view === "list"
                    ? "bg-[--color-linear-bg-primary] text-[--color-linear-text-primary]"
                    : "text-[--color-linear-text-tertiary] hover:text-[--color-linear-text-secondary]"
                )}
                aria-label="List view"
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Custom Actions */}
          {actions}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-[--color-linear-text-secondary] leading-relaxed">
          {description}
        </p>
      )}

      {/* Bottom Row: Search */}
      {showSearch && (
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--color-linear-text-tertiary]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            className={cn(
              "w-full pl-10 pr-4 py-2",
              "text-sm",
              "bg-[--color-linear-bg-secondary]",
              "border border-[--color-linear-border-primary]",
              "rounded-lg",
              "transition-all duration-150",
              "placeholder:text-[--color-linear-text-placeholder]",
              "focus:outline-none",
              "focus:border-[--color-linear-border-focus]",
              "focus:bg-[--color-linear-bg-primary]"
            )}
          />
        </div>
      )}
    </header>
  );
}

export function PageHeaderAction({
  children,
  onClick,
  variant = "ghost",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "ghost" | "primary" | "secondary";
  className?: string;
}) {
  const variantStyles = {
    ghost:
      "text-[--color-linear-text-secondary] hover:bg-[--color-linear-bg-hover]",
    primary:
      "bg-[--color-linear-accent-primary] text-white hover:opacity-90",
    secondary:
      "bg-[--color-linear-bg-tertiary] text-[--color-linear-text-primary] hover:opacity-90",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5",
        "text-sm font-medium",
        "rounded-lg",
        "transition-all duration-150",
        "active:scale-[0.98]",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </button>
  );
}
