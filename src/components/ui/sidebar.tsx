import * as React from "react";
import { cn } from "#/utils/utils";

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  state: "expanded" | "collapsed";
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}

export function SidebarProvider({
  children,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  className,
}: React.PropsWithChildren<{
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}>) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (openProp === undefined) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange, openProp],
  );
  const toggleSidebar = React.useCallback(() => setOpen(!open), [open, setOpen]);
  const value = React.useMemo<SidebarContextValue>(
    () => ({
      open,
      setOpen,
      state: open ? "expanded" : "collapsed",
      toggleSidebar,
    }),
    [open, setOpen, toggleSidebar],
  );

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSidebar]);

  return (
    <SidebarContext.Provider value={value}>
      <div className={cn("group/sidebar-wrapper flex min-h-0 h-full", className)}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  const { open, state } = useSidebar();
  return (
    <aside
      data-sidebar="sidebar"
      data-state={state}
      aria-label="Cubic AI navigation"
      className={cn(
        "hidden md:flex h-full shrink-0 flex-col border-r border-[var(--oh-border)] bg-base text-white transition-[width] duration-200",
        open ? "w-[272px]" : "w-[68px]",
        className,
      )}
    >
      {children}
    </aside>
  );
}

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} data-sidebar="header" className={cn("p-3", className)} {...props} />,
);
SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} data-sidebar="content" className={cn("min-h-0 flex-1 overflow-y-auto px-2", className)} {...props} />,
);
SidebarContent.displayName = "SidebarContent";

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} data-sidebar="footer" className={cn("mt-auto border-t border-[var(--oh-border)] p-2", className)} {...props} />,
);
SidebarFooter.displayName = "SidebarFooter";

export const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <section ref={ref} data-sidebar="group" className={cn("py-2", className)} {...props} />,
);
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} data-sidebar="group-label" className={cn("px-2 pb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-white/40", className)} {...props} />,
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} data-sidebar="group-content" className={cn(className)} {...props} />,
);
SidebarGroupContent.displayName = "SidebarGroupContent";

export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => <ul ref={ref} data-sidebar="menu" className={cn("flex w-full flex-col gap-1", className)} {...props} />,
);
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => <li ref={ref} data-sidebar="menu-item" className={cn("relative", className)} {...props} />,
);
SidebarMenuItem.displayName = "SidebarMenuItem";

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }>(
  ({ className, isActive, ...props }, ref) => {
    const { open } = useSidebar();
    return (
      <button
        ref={ref}
        type="button"
        data-sidebar="menu-button"
        data-active={isActive ? "true" : "false"}
        title={!open && typeof props.children === "string" ? props.children : undefined}
        className={cn(
          "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
          isActive && "bg-white/[0.1] font-medium text-white",
          !open && "justify-center px-0",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();
    return <button ref={ref} type="button" aria-label="Toggle sidebar" className={cn("rounded-md p-2 text-white/60 hover:bg-white/[0.06] hover:text-white", className)} onClick={(event) => { onClick?.(event); toggleSidebar(); }} {...props} />;
  },
);
SidebarTrigger.displayName = "SidebarTrigger";
