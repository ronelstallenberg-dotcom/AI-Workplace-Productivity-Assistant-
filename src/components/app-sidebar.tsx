import { Link, useRouterState } from "@tanstack/react-router";
import { Bot, LayoutDashboard, Mail, Microscope, ShieldCheck, Sparkles } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export const NAV_ITEMS = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, tint: "bg-violet-soft text-accent-foreground" },
  { title: "Smart Email Generator", url: "/email", icon: Mail, tint: "bg-violet-soft text-accent-foreground" },
  { title: "AI Research Assistant", url: "/research", icon: Microscope, tint: "bg-sky-soft text-sky-foreground" },
  { title: "AI Chatbot", url: "/chat", icon: Bot, tint: "bg-pink-soft text-pink-foreground" },
] as const;

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" onClick={() => setOpenMobile(false)} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
            <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
          </span>
          {!collapsed && (
            <span className="leading-tight">
              <span className="block font-display text-base font-semibold">Flowmate AI</span>
              <span className="block text-xs text-muted-foreground">Workplace assistant</span>
            </span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title} className="h-10 data-[active=true]:font-semibold">
                      <Link to={item.url} onClick={() => setOpenMobile(false)}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {!collapsed && (
        <SidebarFooter className="p-3">
          <div className="rounded-xl bg-gradient-soft p-3.5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-primary" /> Demo mode
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Responses are simulated in your browser. Review all AI output before use.
            </p>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
