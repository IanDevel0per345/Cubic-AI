import {
  CalendarDays,
  FileText,
  Home,
  Inbox,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { OpenHandsLogoButton } from "#/components/shared/buttons/openhands-logo-button";
import {
  Sidebar as SidebarShell,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "#/components/ui/sidebar";
import { useNavigation } from "#/context/navigation-context";
import { useSidebarStore } from "#/stores/sidebar-store";
import { cn } from "#/utils/utils";
import { useSidebarMobileNav } from "./sidebar-mobile-nav-context";

const menuItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Matters", path: "/conversations", icon: Inbox },
  { label: "Documents", path: "/customize", icon: FileText },
  { label: "Calendar", path: "/conversations", icon: CalendarDays },
  { label: "Search", path: "/conversations", icon: Search },
] as const;

export function Sidebar() {
  const { currentPath, navigate } = useNavigation();
  const collapsed = useSidebarStore((state) => state.collapsed);
  const setCollapsed = useSidebarStore((state) => state.setCollapsed);
  const { t } = useTranslation("openhands");
  const { isOpen: mobileNavOpen, close: closeMobileNav } = useSidebarMobileNav();
  const isCollapsed = mobileNavOpen ? false : collapsed;

  const isActive = (path: string) =>
    path === "/"
      ? currentPath === "/"
      : currentPath === path || currentPath.startsWith(`${path}/`);

  return (
    <SidebarProvider
      open={!isCollapsed}
      onOpenChange={(open) => setCollapsed(!open)}
      className="h-0 shrink-0 md:h-full"
    >
      <SidebarShell
        className={cn(
          "md:relative",
          mobileNavOpen &&
            "fixed inset-y-0 left-0 z-50 !flex !w-[272px] shadow-2xl md:static md:!w-auto md:shadow-none",
        )}
      >
        <SidebarHeader>
          <div
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "justify-between gap-2",
            )}
          >
            <OpenHandsLogoButton
              showWordmark={!isCollapsed}
              logoWidth={isCollapsed ? 42 : 52}
              logoHeight={isCollapsed ? 28 : 34}
              className="flex min-w-0 items-center gap-2"
              logoClassName="max-w-none"
            />
            {mobileNavOpen ? (
              <button
                type="button"
                aria-label="Close navigation"
                onClick={closeMobileNav}
                className="rounded-md p-2 text-white/60 hover:bg-white/[0.06] hover:text-white md:hidden"
              >
                ×
              </button>
            ) : !isCollapsed ? (
              <SidebarTrigger aria-label="Collapse sidebar">×</SidebarTrigger>
            ) : null}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            {!isCollapsed ? <SidebarGroupLabel>Workspace</SidebarGroupLabel> : null}
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        isActive={isActive(item.path)}
                        onClick={() => {
                          navigate(item.path);
                          if (mobileNavOpen) closeMobileNav();
                        }}
                        aria-label={item.label}
                      >
                        <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                        {!isCollapsed ? <span>{item.label}</span> : null}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!isCollapsed ? <SidebarGroupLabel>Account</SidebarGroupLabel> : null}
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={currentPath.startsWith("/settings")}
                    onClick={() => {
                      navigate("/settings");
                      if (mobileNavOpen) closeMobileNav();
                    }}
                    aria-label={t("SIDEBAR$SETTINGS", "Settings")}
                  >
                    <Settings className="size-[18px] shrink-0" aria-hidden="true" />
                    {!isCollapsed ? <span>Settings</span> : null}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenuButton
            className={cn(
              "h-12",
              isCollapsed ? "justify-center" : "justify-start",
            )}
            aria-label="Cubic AI account"
          >
            <UserRound className="size-[18px] shrink-0" aria-hidden="true" />
            {!isCollapsed ? (
              <span className="flex min-w-0 flex-col items-start leading-tight">
                <span className="truncate text-sm font-medium text-white">
                  Cubic AI
                </span>
                <span className="truncate text-xs text-white/45">
                  Legal workspace
                </span>
              </span>
            ) : null}
          </SidebarMenuButton>
        </SidebarFooter>
      </SidebarShell>
    </SidebarProvider>
  );
}
