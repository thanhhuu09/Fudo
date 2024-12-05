import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface NavigationItemProps {
  item: {
    value: string;
    label: string;
    icon: React.ReactNode;
  };
  isActive: boolean;
  isSidebarOpen: boolean;
  onClick: () => void;
}

export default function NavigationItem({
  item,
  isActive,
  isSidebarOpen,
  onClick,
}: NavigationItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start h-10 relative group",
        isActive
          ? "bg-primary/10 text-primary hover:bg-primary/20"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        !isSidebarOpen ? "px-2" : "px-3"
      )}
      onClick={onClick}
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
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
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
}
