import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Users, Settings, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface SidebarItem {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarItems: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
  sidebarItems,
}) => {
  return (
    <motion.aside
      initial={false}
      animate={{
        width: isSidebarOpen ? 240 : 70,
        transition: { duration: 0.3 },
      }}
      className="bg-white shadow-md z-20 flex flex-col relative"
    >
      {/* Logo Section */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-lg font-semibold text-white">F</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                FoodOrder
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto hover:bg-gray-100 rounded-full w-8 h-8 p-0 flex items-center justify-center"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <ChevronLeft
            className={`h-5 w-5 transition-transform duration-300 ${
              !isSidebarOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.value;
            return (
              <Button
                key={item.value}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 relative group",
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  !isSidebarOpen && "px-2",
                  isSidebarOpen && "px-3"
                )}
                onClick={() => setActiveTab(item.value)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex items-center justify-center",
                      isActive && "text-primary"
                    )}
                  >
                    {item.icon}
                  </div>
                  <AnimatePresence initial={false}>
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{
                          opacity: 1,
                          width: "auto",
                          transition: { duration: 0.2 },
                        }}
                        exit={{
                          opacity: 0,
                          width: 0,
                          transition: { duration: 0.2 },
                        }}
                        className={cn(
                          "text-sm font-medium truncate",
                          isActive
                            ? "text-primary"
                            : "text-gray-600 group-hover:text-gray-900"
                        )}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Profile Section */}
      <div className="border-t border-gray-100 p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full p-0 h-auto hover:bg-gray-100 flex items-center gap-3",
                !isSidebarOpen && "justify-center"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="@user"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <AnimatePresence initial={false}>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-start flex-1"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      John Doe
                    </span>
                    <span className="text-xs text-gray-500">Admin</span>
                  </motion.div>
                )}
              </AnimatePresence>
              {!isSidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  John Doe (Admin)
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align={isSidebarOpen ? "center" : "start"}
            side="top"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  john.doe@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
