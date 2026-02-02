import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "min-h-[400px]",
        "text-center px-4",
        className
      )}
    >
      {Icon && (
        <Icon className="h-12 w-12 text-[--color-linear-text-placeholder] mb-4" />
      )}
      <h3 className="text-lg font-semibold text-[--color-linear-text-primary] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[--color-linear-text-tertiary] mb-6 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            "px-4 py-2 rounded-lg",
            "text-sm font-medium",
            "bg-[--color-linear-accent-primary] text-white",
            "transition-all duration-150",
            "hover:opacity-90",
            "active:scale-[0.98]"
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
