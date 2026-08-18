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

  const isActive = (path: string) =>
    path === "/"
      ? currentPath === "/"
      : currentPath === path || currentPath.startsWith(`${path}/`);

  return (
    <SidebarProvider
      open={!collapsed}
      onOpenChange={(open) => setCollapsed(!open)}
      className="shrink-0"
    >
      <SidebarShell>
        <SidebarHeader>
          <div
            className={cn(
              "flex items-center",
              collapsed ? "justify-center" : "justify-between gap-2",
            )}
          >
            <OpenHandsLogoButton
              showWordmark={!collapsed}
              logoWidth={collapsed ? 42 : 52}
              logoHeight={collapsed ? 28 : 34}
              className="flex min-w-0 items-center gap-2"
              logoClassName="max-w-none"
            />
            {!collapsed ? (
              <SidebarTrigger aria-label="Collapse sidebar">×</SidebarTrigger>
            ) : null}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            {!collapsed ? <SidebarGroupLabel>Workspace</SidebarGroupLabel> : null}
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        isActive={isActive(item.path)}
                        onClick={() => navigate(item.path)}
                        aria-label={item.label}
                      >
                        <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                        {!collapsed ? <span>{item.label}</span> : null}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!collapsed ? <SidebarGroupLabel>Account</SidebarGroupLabel> : null}
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={currentPath.startsWith("/settings")}
                    onClick={() => navigate("/settings")}
                    aria-label={t("SIDEBAR$SETTINGS", "Settings")}
                  >
                    <Settings className="size-[18px] shrink-0" aria-hidden="true" />
                    {!collapsed ? <span>Settings</span> : null}
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
              collapsed ? "justify-center" : "justify-start",
            )}
            aria-label="Cubic AI account"
          >
            <UserRound className="size-[18px] shrink-0" aria-hidden="true" />
            {!collapsed ? (
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
