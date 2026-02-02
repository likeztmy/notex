import * as React from "react";
import styles from "./ToolbarButton.module.css";
import { cn } from "~/lib/utils";

interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
}

export function ToolbarButton({
  active = false,
  icon,
  children,
  className,
  ...props
}: ToolbarButtonProps) {
  return (
    <button
      className={cn(styles.button, active && styles.active, className)}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
