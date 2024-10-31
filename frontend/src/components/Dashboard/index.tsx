"use client";

import { useState } from "react";
import {
  BarChart,
  LayoutDashboard,
  PieChart,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Sidebar from "./Sidebar";
import Header from "./Header";
import MetricsCards from "./MetricsCards";
import RecentOrders from "./RecentOrders";
import MenuItems from "./ManageMenuItems/MenuItems";
import UserManagement from "./UserManagement";
import Analytics from "./Analytics";
import SettingsForm from "./SettingsForm";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New order received",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Order #ORD002 is preparing",
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "Order #ORD003 is pending",
      time: "1 day ago",
    },
  ]);
  const sidebarItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      value: "dashboard",
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      label: "Orders",
      value: "orders",
    },
    { icon: <PieChart className="h-5 w-5" />, label: "Menu", value: "menu" },
    { icon: <Users className="h-5 w-5" />, label: "Users", value: "users" },
    {
      icon: <BarChart className="h-5 w-5" />,
      label: "Analytics",
      value: "analytics",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      value: "settings",
    },
  ];
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarItems={sidebarItems}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <Header activeTab={activeTab} notifications={notifications} />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsContent value="dashboard" className="space-y-4">
                <MetricsCards />
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[200px]">
                      {/* Replace with your preferred charting library */}
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Revenue Chart Placeholder
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="orders" className="space-y-4">
                <RecentOrders />
              </TabsContent>
              <TabsContent value="menu" className="space-y-4">
                <MenuItems />
              </TabsContent>
              <TabsContent value="users" className="space-y-4">
                <UserManagement />
              </TabsContent>
              <TabsContent value="analytics">
                <Analytics />
              </TabsContent>
              <TabsContent value="settings">
                <SettingsForm />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
