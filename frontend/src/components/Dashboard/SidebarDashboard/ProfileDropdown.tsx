import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { Users, Settings, LogOut } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";

interface ProfileDropdownProps {
  name: string;
  email: string;
  photo: string;
  role: string;
  onLogout: () => void;
}
export default function ProfileDropdown({
  name,
  email,
  photo,
  role,
  onLogout,
}: ProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="w-full p-0 h-auto hover:bg-gray-100 flex items-center gap-3"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={photo} alt="@user" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start flex-1">
            <span className="truncate text-sm font-medium text-gray-900">
              {name}
            </span>
            <span className="truncate text-xs text-gray-500">
              {role === "admin" ? "Admin" : "User"}
            </span>
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="center" side="top">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
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
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
