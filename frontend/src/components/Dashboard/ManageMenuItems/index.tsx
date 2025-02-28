"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MenuItemModal from "./MenuItemModal";
import { Category, MenuItem } from "@/types";
import axios from "axios";
import { formatNumber } from "@/lib/formatNumber";
import { DeleteAlertDialog } from "@/components/DeleteAlertDialog";
import {
  deleteMenu,
  fetchCategories,
  fetchMenu,
} from "@/services/menuServices";
import useAuthStore from "@/store/authStore";
import { toast } from "sonner";

export default function ManageMenuItems() {
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedItemsID, setSelectedItemsID] = useState<string[]>([]); // Array of selected item IDs

  const searchRef = useRef<HTMLDivElement>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res));
    fetchMenu().then((res) => {
      setMenuItems(res);
      setIsLoading(false);
    });
  }, []);
  const filteredItems = menuItems.filter(
    (menuItem) =>
      menuItem.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "All Categories" ||
        menuItem.categoryID.name === selectedCategory)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get new list when CRUD operation is done
  useEffect(() => {
    fetchMenu().then((res) => {
      setMenuItems(res);
    });
  }, [isModalOpen]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const newSuggestions = menuItems
        .filter((menuItem) =>
          menuItem.name.toLowerCase().includes(value.toLowerCase())
        )
        .map((menuItem) => menuItem.name);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleItemSelection = (_id: string) => {
    setSelectedItemsID((prev) =>
      prev.includes(_id) ? prev.filter((item) => item !== _id) : [...prev, _id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedItemsID.length === 0) {
      return;
    }
    selectedItemsID.forEach((id) => handleDeleteItem(id));
    setSelectedItemsID([]);
  };

  const handleDeleteItem = async (_id: string) => {
    if (!accessToken) {
      return;
    }
    try {
      const res = await deleteMenu(_id, accessToken);
      if (res) {
        setMenuItems((prev) => prev.filter((item) => item._id !== _id));
        toast.success("Menu item deleted successfully");
      }
    } catch (error) {
      // Nếu lỗi là một AxiosError, hiển thị thông báo lỗi
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("You are not authorized to delete this item");
        } else {
          toast.error("An error occurred. Please try again later");
        }
      } else {
        console.error("Error deleting menu item:", error);
      }
    }
  };

  const handleAvailabilityToggle = async (_id: string) => {
    const res = await axios.put(`/api/menu-items/${_id}`, {
      visible: !menuItems.find((item) => item._id === _id)?.visible,
    });
    if (res.data.success) {
      setMenuItems((prev) =>
        prev.map((item) =>
          item._id === _id ? { ...item, visible: !item.visible } : item
        )
      );
    } else {
      console.error("Error updating item visibility:", res);
    }
  };
  const handleAddItem = () => {
    setMode("add");
    setIsModalOpen(true);
  };

  const handleEditItem = (_id: string) => {
    setMode("edit");
    setSelectedItemsID([_id]);
    setIsModalOpen(true);
  };

  const handleOnClose = () => {
    setIsModalOpen(false);
    setSelectedItemsID([]);
  };
  if (isLoading) {
    return <p>Loading...</p>;
  }
  console.log("menuItems", menuItems);
  console.log("selectedItemsID", selectedItemsID);

  return (
    <div>
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">Manage Menu Items</h1>
          <Button onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" /> Add New Item
          </Button>
          <MenuItemModal
            isOpen={isModalOpen}
            onClose={handleOnClose}
            onSave={handleAddItem}
            mode={mode}
            categories={categories}
            initialData={
              mode === "edit"
                ? menuItems.find((item) => item._id === selectedItemsID[0])
                : undefined
            }
          />
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 ">
          <div className="relative flex-grow" ref={searchRef}>
            <Search
              size={20}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              type="search"
              placeholder="Search menu items..."
              className="pl-8 bg-white"
              value={searchTerm}
              onChange={handleSearch}
            />
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1"
                >
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[180px] justify-between"
              >
                {selectedCategory} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px]">
              <DropdownMenuLabel>Select Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedCategory === "All Categories"}
                onCheckedChange={() => handleCategoryChange("All Categories")}
              >
                All Categories
              </DropdownMenuCheckboxItem>
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category._id}
                  checked={selectedCategory === category.name}
                  onCheckedChange={() => handleCategoryChange(category.name)}
                >
                  {category.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
          <CardDescription>
            Manage your restaurant&apos;s menu items here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block">
            {/* Table view for medium and larger screens */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedItemsID.length === filteredItems.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItemsID(
                            filteredItems.map((item) => item._id)
                          );
                        } else {
                          setSelectedItemsID([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItemsID.includes(item._id)}
                        onCheckedChange={() => handleItemSelection(item._id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={item.imageURL} alt={item.name} />
                        <AvatarFallback>{item.name[0]}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.categoryID.name}</TableCell>
                    <TableCell>
                      {formatNumber(item.price, "en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.quantity > 20 ? "default" : "destructive"}
                      >
                        {item.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={item.visible}
                        onCheckedChange={() =>
                          handleAvailabilityToggle(item._id)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditItem(item._id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden">
            {/* Card view for small screens */}
            {filteredItems.map((item) => (
              <Card key={item._id} className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Checkbox
                      checked={selectedItemsID.includes(item._id)}
                      onCheckedChange={() => handleItemSelection(item._id)}
                    />
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={item.imageURL} alt={item.name} />
                      <AvatarFallback>{item.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                      <Badge
                        variant={item.quantity > 20 ? "default" : "destructive"}
                      >
                        Stock: {item.quantity}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Visible</span>
                    <Switch
                      checked={item.visible}
                      onCheckedChange={() => handleAvailabilityToggle(item._id)}
                    />
                  </div>
                  <div>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center">
          {/* <Button
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={selectedItemsID.length === 0}
            className="mb-4 sm:mb-0"
          >
            Delete Selected
          </Button> */}
          <DeleteAlertDialog
            title="Delete Menu Item"
            description="Are you sure you want to delete this item? This action cannot be undone."
            onDelete={() => handleBulkDelete()}
            trigger={
              <Button
                variant="destructive"
                disabled={selectedItemsID.length === 0}
                className="mb-4 sm:mb-0"
              >
                Delete Selected
              </Button>
            }
          />
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
