import Header from "@/components/Dashboard/Header";
import SidebarDashboard from "@/components/Dashboard/SidebarDashboard";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const notifications = [
    {
      id: "1",
      title: "New order",
      time: "2 hours ago",
    },
    {
      id: "2",
      title: "New order",
      time: "2 hours ago",
    },
    {
      id: "3",
      title: "New order",
      time: "2 hours ago",
    },
  ];
  return (
    <SidebarProvider className="bg-gray-100">
      <SidebarDashboard />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab="Dashboard" notifications={notifications} />
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </SidebarProvider>
  );
}
