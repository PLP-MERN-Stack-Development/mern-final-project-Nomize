import { Home, Gamepad2, BarChart3, Trophy, User, BookOpen, CreditCard, Settings as SettingsIcon, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Quests", url: "/quests", icon: Gamepad2 },
  { title: "Progress", url: "/progress", icon: BarChart3 },
  { title: "AI Insights", url: "/insights", icon: Sparkles },
  { title: "Achievements", url: "/achievements", icon: Trophy },
  { title: "Learn", url: "/learn", icon: BookOpen },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Upgrade", url: "/upgrade", icon: CreditCard },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>CogniQuest</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
