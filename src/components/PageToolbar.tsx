import * as React from "react";
import { PanelLeft } from "lucide-react";
import { useSidebar } from "~/components/ui/sidebar";
import styles from "./PageToolbar.module.css";

interface PageToolbarProps {
  title: React.ReactNode;
  children?: React.ReactNode;
  center?: React.ReactNode;
}

export function PageToolbar({ title, children, center }: PageToolbarProps) {
  const { open, toggleSidebar } = useSidebar();

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarInner}>
        <div className={styles.left}>
          {/* Sidebar trigger - only show when sidebar is closed */}
          {!open && (
            <button
              onClick={toggleSidebar}
              className={styles.sidebarTrigger}
              aria-label="Open sidebar"
              title="Open sidebar (⌘B)"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}

          <h1 className={styles.title}>{title}</h1>
        </div>

        {/* Center content (Search bar) */}
        {center && <div className={styles.center}>{center}</div>}

        {/* Right side - action buttons */}
        {children && <div className={styles.actions}>{children}</div>}
      </div>
    </div>
  );
}
