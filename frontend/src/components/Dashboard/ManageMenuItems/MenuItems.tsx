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

// Mock data for demonstration
const menuItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Main Dish",
    price: 12.99,
    stock: 50,
    available: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Caesar Salad",
    category: "Salad",
    price: 8.99,
    stock: 30,
    available: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Chocolate Cake",
    category: "Dessert",
    price: 6.99,
    stock: 20,
    available: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Iced Tea",
    category: "Drinks",
    price: 2.99,
    stock: 100,
    available: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Chicken Burger",
    category: "Main Dish",
    price: 10.99,
    stock: 40,
    available: true,
    image: "/placeholder.svg?height=40&width=40",
  },
];

export default function MenuItemsManagement() {
  const [items, setItems] = useState(menuItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "All Categories" ||
        item.category === selectedCategory)
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const newSuggestions = items
        .filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))
        .map((item) => item.name);
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

  const handleItemSelection = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    setItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const handleAvailabilityToggle = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };
  const handleAddItem = () => {};

  // const handleAddItem = () => {
  //   // Add validation logic here
  //   setItems((prev) => [
  //     ...prev,
  //     {
  //       id: prev.length + 1,
  //       name: newItem.name,
  //       category: newItem.category,
  //       price: parseFloat(newItem.price),
  //       stock: parseInt(newItem.stock),
  //       available: true,
  //       image: newItem.image,
  //     },
  //   ]);
  //   console.log("New item added:", newItem);
  // };

  return (
    <div>
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">Manage Menu Items</h1>
          <Button onClick={() => setIsAddItemModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Item
          </Button>
          <MenuItemModal
            isOpen={isAddItemModalOpen}
            onClose={() => setIsAddItemModalOpen(false)}
            onSave={handleAddItem}
            mode="add"
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
              {[
                "All Categories",
                "Main Dish",
                "Salad",
                "Dessert",
                "Drinks",
              ].map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategory === category}
                  onCheckedChange={() => handleCategoryChange(category)}
                >
                  {category}
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
                      checked={selectedItems.length === filteredItems.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems(
                            filteredItems.map((item) => item.id)
                          );
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleItemSelection(item.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={item.image} alt={item.name} />
                        <AvatarFallback>{item.name[0]}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.stock > 20 ? "default" : "destructive"}
                      >
                        {item.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={item.available}
                        onCheckedChange={() =>
                          handleAvailabilityToggle(item.id)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
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
              <Card key={item.id} className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleItemSelection(item.id)}
                    />
                  </div>
                  <CardDescription>{item.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={item.image} alt={item.name} />
                      <AvatarFallback>{item.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                      <Badge
                        variant={item.stock > 20 ? "default" : "destructive"}
                      >
                        Stock: {item.stock}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Available:</span>
                    <Switch
                      checked={item.available}
                      onCheckedChange={() => handleAvailabilityToggle(item.id)}
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
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={selectedItems.length === 0}
            className="mb-4 sm:mb-0"
          >
            Delete Selected
          </Button>
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
