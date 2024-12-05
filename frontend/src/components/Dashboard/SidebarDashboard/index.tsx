"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChart,
  LayoutDashboard,
  PieChart,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import LogoSection from "./LogoSection";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface SidebarDashboardItem {
  value: string;
  label: string;
  icon: React.ReactNode;
  route: string;
}

const sidebarItems: SidebarDashboardItem[] = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: "Dashboard",
    value: "dashboard",
    route: "/dashboard",
  },
  {
    icon: <ShoppingBag className="h-5 w-5" />,
    label: "Orders",
    value: "orders",
    route: "/dashboard/orders",
  },
  {
    icon: <PieChart className="h-5 w-5" />,
    label: "Menu",
    value: "menu",
    route: "/dashboard/menu",
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "Users",
    value: "users",
    route: "/dashboard/users",
  },
  {
    icon: <BarChart className="h-5 w-5" />,
    label: "Analytics",
    value: "analytics",
    route: "/dashboard/analytics",
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: "Settings",
    value: "settings",
    route: "/dashboard/settings",
  },
];

const SidebarDashboard = () => {
  const pathname = usePathname();
  const { isAuthenticated, user, handleLogout } = useAuth();
  console.log({ user });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b  p-4 bg-white">
        <LogoSection />
      </SidebarHeader>
      <SidebarContent className="px-2 py-6 bg-white">
        <SidebarGroupContent>
          <SidebarMenu className="space-y-1.5">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.route;
              return (
                <SidebarMenuItem
                  key={item.value}
                  className={cn(
                    "rounded-xl",
                    isActive && "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.route}
                      className="flex items-center px-3 py-2.5"
                    >
                      <span
                        className={cn(
                          "mr-3 transition-colors duration-200",
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400"
                        )}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={cn(
                          "text-sm font-medium truncate transition-colors duration-200",
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter className="border-t bg-white">
        {isAuthenticated && user ? (
          <ProfileDropdown
            name={user.name}
            email={user.email}
            photo={user.photo}
            role={user.role}
            onLogout={handleLogout}
          />
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarDashboard;
