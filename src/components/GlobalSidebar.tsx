import * as React from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  FileText,
  Clock,
  Star,
  Folder,
  Tag,
  Share2,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
import styles from "./GlobalSidebar.module.css";
export function GlobalSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const [foldersExpanded, setFoldersExpanded] = React.useState(true);
  const [tagsExpanded, setTagsExpanded] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleNewDocument = () => {
    navigate({
      to: "/editor",
      search: { create: "true" },
    });
  };

  return (
    <Sidebar className={styles.sidebar}>
      <SidebarHeader className={styles.header}>
        {/* Header with close button */}
        <div className={styles.headerTop}>
          <motion.div
            className={styles.spaceHeader}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.spaceIcon}>Ms</div>
            <span className={styles.spaceTitle}>My Space</span>
          </motion.div>

          <button
            onClick={toggleSidebar}
            className={styles.closeButton}
            title="Close sidebar (⌘B)"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        {/* New Document Button */}
        <motion.button
          onClick={handleNewDocument}
          className={styles.newDocButton}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus />
          <span>New Document</span>
        </motion.button>
      </SidebarHeader>

      <SidebarContent className={styles.content}>
        <SidebarMenu className={styles.menu}>
          {/* All Docs */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/content")}>
              <Link to="/content">
                <FileText className="h-4 w-4" />
                <span>All Docs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Recent */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/recent")}>
              <Link to="/recent">
                <Clock className="h-4 w-4" />
                <span>Recent</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Starred */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/starred")}>
              <Link to="/starred">
                <Star className="h-4 w-4" />
                <span>Starred</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Shared with Me */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/shared")}>
              <Link to="/shared">
                <Share2 className="h-4 w-4" />
                <span>Shared with Me</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Folders Section */}
        <div>
          <motion.button
            onClick={() => setFoldersExpanded(!foldersExpanded)}
            className={cn(
              styles.sectionHeader,
              foldersExpanded && styles.expanded,
            )}
            whileHover={{ x: 2 }}
          >
            <span>Folders</span>
            {foldersExpanded ? <ChevronDown /> : <ChevronRight />}
          </motion.button>

          <AnimatePresence>
            {foldersExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={styles.sectionContent}
              >
                <SidebarMenu className={styles.menu}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        to="/folders/$folderId"
                        params={{ folderId: "unsorted" }}
                      >
                        <Folder className="h-4 w-4" />
                        <span>Unsorted</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        to="/folders/$folderId"
                        params={{ folderId: "work" }}
                      >
                        <span className="text-sm ml-0.5">📁</span>
                        <span>How to use Craft</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        to="/folders/$folderId"
                        params={{ folderId: "videos" }}
                      >
                        <span className="text-sm ml-0.5">🎬</span>
                        <span>How To Videos</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        to="/folders/$folderId"
                        params={{ folderId: "handbook" }}
                      >
                        <span className="text-sm ml-0.5">📖</span>
                        <span>Craft Handbook</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        to="/folders/$folderId"
                        params={{ folderId: "getting-started" }}
                      >
                        <span className="text-sm ml-0.5">🚀</span>
                        <span>Getting Started</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Starred Section */}
        <div>
          <div className={styles.sectionHeader}>
            <span>Starred</span>
          </div>
          <div className={styles.hintText}>Star Docs to keep them close</div>
        </div>

        {/* Tags Section */}
        <div>
          <motion.button
            onClick={() => setTagsExpanded(!tagsExpanded)}
            className={cn(
              styles.sectionHeader,
              tagsExpanded && styles.expanded,
            )}
            whileHover={{ x: 2 }}
          >
            <span>Tags</span>
            {tagsExpanded ? <ChevronDown /> : <ChevronRight />}
          </motion.button>

          <AnimatePresence>
            {tagsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={styles.hintText}
              >
                Pin your key tags for quick access
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
