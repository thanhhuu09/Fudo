import React from "react";
import { Home, Search, Bell } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

interface Notification {
  id: string;
  title: string;
  time: string;
}

interface HeaderProps {
  activeTab: string;
  notifications: Notification[];
}

const Header: React.FC<HeaderProps> = ({ activeTab, notifications }) => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Home className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {activeTab}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 w-full max-w-xs bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start py-2"
                >
                  <span className="text-sm font-medium">
                    {notification.title}
                  </span>
                  <span className="text-xs text-gray-500">
                    {notification.time}
                  </span>
                </DropdownMenuItem>
              ))}
              {notifications.length === 0 && (
                <div className="py-4 text-center text-sm text-gray-500">
                  No new notifications
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Search Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
