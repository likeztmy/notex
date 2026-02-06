/// <reference types="vite/client" />
import {
  HeadContent,
  createRootRoute,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import { PageHeaderProvider } from "~/components/PageHeader";
import { SearchModal, useSearchModal } from "~/components/SearchModal";
import { ThemeProvider } from "~/components/ThemeProvider";
import { useContentStore } from "~/store/contentStore";
import { seo } from "~/utils/seo";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "notex - Think, Write, Create",
        description:
          "A thoughtful space for your ideas to flourish. Distraction-free editor for capturing thoughts, organizing knowledge, and discovering connections.",
      }),
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  component: RootLayout,
});

function RootLayout() {
  const location = useLocation();

  // Pages that don't need sidebar (homepage and board)
  const noSidebarPaths = ["/", "/board"];
  const shouldShowSidebar =
    !noSidebarPaths.includes(location.pathname) &&
    !location.pathname.startsWith("/public");

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RootDocument>
        {shouldShowSidebar ? <LayoutWithSidebar /> : <Outlet />}
      </RootDocument>
    </ThemeProvider>
  );
}

function LayoutWithSidebar() {
  // Dynamically import sidebar components to avoid SSR issues
  const [SidebarComponents, setSidebarComponents] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      import("~/components/ui/sidebar"),
      import("~/components/GlobalSidebar"),
    ]).then(([sidebarModule, globalSidebarModule]) => {
      setSidebarComponents({
        SidebarProvider: sidebarModule.SidebarProvider,
        SidebarInset: sidebarModule.SidebarInset,
        GlobalSidebar: globalSidebarModule.GlobalSidebar,
      });
      // Small delay to ensure smooth transition
      setTimeout(() => setIsLoading(false), 50);
    });
  }, []);

  if (!SidebarComponents || isLoading) {
    return (
      <div
        className="flex h-screen"
        style={{ background: "var(--color-linear-bg-primary)" }}
      >
        {/* Sidebar Skeleton */}
        <motion.div
          className="w-64 border-r flex-shrink-0"
          style={{
            background: "var(--color-linear-bg-primary)",
            borderColor: "var(--color-linear-border-primary)",
          }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, ease: "linear" }}
        >
          <div className="p-4 space-y-4">
            {/* Header skeleton */}
            <div className="space-y-3">
              <motion.div
                className="h-10 rounded"
                style={{ background: "var(--color-linear-bg-tertiary)" }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="h-9 rounded"
                style={{ background: "var(--color-linear-bg-tertiary)" }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.1,
                }}
              />
            </div>
            {/* Menu items skeleton */}
            <div className="space-y-2 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="h-8 rounded"
                  style={{ background: "var(--color-linear-bg-tertiary)" }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2 + i * 0.1,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content area skeleton */}
        <motion.div
          className="flex-1 flex items-center justify-center"
          style={{ background: "var(--color-linear-bg-secondary)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.05, ease: "linear" }}
        >
          <motion.div
            style={{ color: "var(--color-linear-text-tertiary)" }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const { SidebarProvider, SidebarInset, GlobalSidebar } = SidebarComponents;

  return (
    <PageHeaderProvider>
      <SidebarProvider defaultOpen={true}>
        <GlobalSidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </PageHeaderProvider>
  );
}

// Search Modal Context
const SearchModalContext = React.createContext<{
  open: () => void;
} | null>(null);

export function useSearchModalContext() {
  return React.useContext(SearchModalContext);
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const searchModal = useSearchModal();
  const loadContent = useContentStore((state) => state.load);

  React.useEffect(() => {
    loadContent();
  }, [loadContent]);

  return (
    <SearchModalContext.Provider value={{ open: searchModal.open }}>
      <HeadContent />
      {children}
      <SearchModal isOpen={searchModal.isOpen} onClose={searchModal.close} />
      <TanStackRouterDevtools position="bottom-right" />
    </SearchModalContext.Provider>
  );
}
