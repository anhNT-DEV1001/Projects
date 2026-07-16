"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import * as LucideIcons from "lucide-react";
import {
  Bell,
  CalendarClock,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getApiErrorMessage, getPublicAssetUrl, logout } from "@/lib";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useGetListMenus } from "@/modules/menus/useMenus";
import type { Menu } from "@/modules/menus/menus.type";

function getIconComponent(iconName?: string | null) {
  if (!iconName) return LucideIcons.Menu;

  const pascalName = iconName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const Icon = (LucideIcons as any)[pascalName] || (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Menu;
}


function getInitials(name?: string | null) {
  if (!name) {
    return "U";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function UserAvatar({
  avatar,
  name,
  className,
}: {
  avatar?: string | null;
  name?: string | null;
  className?: string;
}) {
  const avatarUrl = getPublicAssetUrl(avatar);

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name ? `Avatar của ${name}` : "Avatar người dùng"}
        className={cn("size-9 rounded-lg object-cover", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground",
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}

function SidebarMenuItem({
  item,
  collapsed,
  onNavigate,
  pathname,
}: {
  item: any;
  collapsed: boolean;
  onNavigate?: () => void;
  pathname: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = getIconComponent(item.icon);
  const hasChildren = item.children && item.children.length > 0;

  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  if (hasChildren) {
    return (
      <div className="flex flex-col gap-1 w-full">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-left",
            collapsed && "justify-center px-0",
          )}
          title={collapsed ? item.title : undefined}
        >
          <Icon className="size-4 shrink-0" />
          {!collapsed ? (
            <>
              <span className="flex-1 truncate">{item.title}</span>
              <ChevronRight
                className={cn(
                  "size-4 transition-transform duration-200",
                  expanded && "rotate-90"
                )}
              />
            </>
          ) : null}
        </button>
        {expanded && !collapsed ? (
          <div className="ml-6 flex flex-col gap-1 border-l border-sidebar-border pl-3">
            {item.children.map((child: any) => {
              const ChildIcon = getIconComponent(child.icon);
              const isChildActive = child.href === "/" ? pathname === "/" : pathname.startsWith(child.href);
              return (
                <Link
                  key={child.id}
                  href={child.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isChildActive && "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
                  )}
                >
                  <ChildIcon className="size-3.5 shrink-0" />
                  <span className="truncate">{child.title}</span>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive &&
        "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
        collapsed && "justify-center px-0",
      )}
      title={collapsed ? item.title : undefined}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed ? <span>{item.title}</span> : null}
    </Link>
  );
}

function SidebarNavigation({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { data: menus, isLoading } = useGetListMenus();

  const displayMenus = useMemo(() => {
    if (menus && menus.length > 0) {
      return menus;
    }
    return [
      {
        id: -1,
        title: "Tổng quan",
        href: "/",
        icon: "LayoutDashboard",
      },
      {
        id: -2,
        title: "Menus Page",
        href: "/menus",
        icon: "Menu",
      },
      {
        id: -3,
        title: "Master Data",
        href: "/masterdata",
        icon: "CalendarClock",
      },
      {
        id: -4,
        title: "Tài khoản",
        href: "/profile",
        icon: "UserRound",
      },
      {
        id: -5,
        title: "Cài đặt",
        href: "/settings",
        icon: "Settings",
      },
    ];
  }, [menus]);

  if (isLoading) {
    return (
      <nav className="flex flex-1 flex-col gap-2 px-3 py-3 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={cn("h-10 rounded-lg bg-sidebar-accent/50", collapsed ? "w-10 mx-auto" : "w-full")} />
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-3 overflow-y-auto w-full">
      {displayMenus.map((item) => (
        <SidebarMenuItem
          key={item.id}
          item={item}
          collapsed={collapsed}
          onNavigate={onNavigate}
          pathname={pathname}
        />
      ))}
    </nav>
  );
}


function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const user = useAuthStore((state) => state.user);

  return (
    <aside
      className={cn(
        "hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:flex lg:min-h-screen lg:flex-col",
        collapsed ? "lg:w-20" : "lg:w-72",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border",
          collapsed ? "justify-center px-2" : "gap-3 px-4",
        )}
      >
        {collapsed ? null : (
          <div className="flex size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
        )}
        {!collapsed ? (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Workhub</p>
            <p className="truncate text-xs text-sidebar-foreground/55">
              Quản trị hệ thống
            </p>
          </div>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={cn(collapsed ? "size-9" : "ml-auto")}
          onClick={onToggle}
          aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </Button>
      </div>

      <SidebarNavigation collapsed={collapsed} />

      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2",
            collapsed && "justify-center px-2",
          )}
        >
          <UserAvatar
            avatar={user?.avatar}
            name={user?.fullName || user?.username}
            className="size-8 rounded-md"
          />
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {user?.fullName || "Người dùng"}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/55">
                {user?.email || user?.username || "Đang đồng bộ"}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-foreground/25 transition-opacity",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute inset-y-0 left-0 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Workhub</p>
            <p className="truncate text-xs text-sidebar-foreground/55">
              Quản trị hệ thống
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Đóng sidebar"
          >
            <X className="size-4" />
          </Button>
        </div>
        <SidebarNavigation collapsed={false} onNavigate={onClose} />
      </aside>
    </div>
  );
}

function Header({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = useMemo(
    () => user?.fullName || user?.username || "Người dùng",
    [user],
  );

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await logout();
      clearAuth();
      toast.success("Đã đăng xuất");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      const message = getApiErrorMessage(error);
      toast.error(message);
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur md:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Mở sidebar"
      >
        <MenuIcon className="size-5" />
      </Button>

      <div className="hidden min-w-64 items-center gap-2 rounded-lg border bg-muted/35 px-3 py-2 text-sm text-muted-foreground md:flex">
        <Search className="size-4" />
        <span className="truncate">Tìm kiếm nhanh...</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon" aria-label="Thông báo">
          <Bell className="size-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex h-10 items-center gap-2 rounded-lg px-2 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label="Mở menu tài khoản"
          >
            <UserAvatar avatar={user?.avatar} name={displayName} />
            <div className="hidden min-w-0 text-left sm:block">
              <p className="max-w-36 truncate text-sm font-medium">
                {displayName}
              </p>
              <p className="max-w-36 truncate text-xs text-muted-foreground">
                {user?.email || user?.username || "Đang đồng bộ"}
              </p>
            </div>
            <ChevronRight className="hidden size-4 text-muted-foreground sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <span className="block truncate">{displayName}</span>
                <span className="block truncate font-normal text-muted-foreground">
                  {user?.email || user?.username || "Phiên đăng nhập"}
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <UserRound className="size-4" />
                Hồ sơ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="size-4" />
                Cài đặt
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="size-4" />
                {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        />
        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 px-2 py-4 md:px-4 lg:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
