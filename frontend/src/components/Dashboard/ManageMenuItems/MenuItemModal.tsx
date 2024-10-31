"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

interface MenuItem {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  inStock: boolean;
  quantity?: number;
  visible: boolean;
  image?: File | null;
  imageUrl?: string;
}

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
  initialData?: MenuItem;
  mode: "add" | "edit";
}

export default function MenuItemModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}: MenuItemModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [inStock, setInStock] = useState(true);
  const [quantity, setQuantity] = useState("");
  const [visible, setVisible] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with existing data when editing
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setCategory(initialData.category);
      setPrice(initialData.price.toString());
      setInStock(initialData.inStock);
      setQuantity(initialData.quantity?.toString() || "");
      setVisible(initialData.visible);
      // Don't set image here as it might be a URL in edit mode
    }
  }, [initialData, mode]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleSave = () => {
    const menuItem: MenuItem = {
      ...(initialData?.id && { id: initialData.id }), // Include ID if editing
      name,
      description,
      category,
      price: parseFloat(price),
      inStock,
      quantity: quantity ? parseInt(quantity) : undefined,
      visible,
      image: image || undefined,
      imageUrl: initialData?.imageUrl,
    };
    onSave(menuItem);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setInStock(true);
    setQuantity("");
    setVisible(true);
    setImage(null);
  };

  const renderImage = () => {
    if (image) {
      return URL.createObjectURL(image);
    } else if (initialData?.imageUrl) {
      return initialData.imageUrl;
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Menu Item" : "Edit Menu Item"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Fill in the details for the new menu item."
              : "Update the details of the menu item."}
            Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                placeholder="Enter menu item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main Dish</SelectItem>
                  <SelectItem value="appetizer">Appetizer</SelectItem>
                  <SelectItem value="dessert">Dessert</SelectItem>
                  <SelectItem value="drink">Drink</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-7"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="inStock">In Stock</Label>
              <Switch
                id="inStock"
                checked={inStock}
                onCheckedChange={setInStock}
              />
            </div>
            {inStock && (
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter available quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="0"
                />
              </div>
            )}
          </div>
          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter item description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                {description.length}/300 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label>Image Upload</Label>
              <div
                className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {renderImage() ? (
                  <div className="relative">
                    <Image
                      src={renderImage()!}
                      alt="Preview"
                      width={200}
                      height={150}
                      className="mx-auto"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 mb-2" />
                    <p>
                      Drag and drop an image here, or click to select a file
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <p className="text-sm text-muted-foreground">
                Recommended size: 800x600 pixels, Max size: 2MB, JPG or PNG
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="visible">Visible on Menu</Label>
              <Switch
                id="visible"
                checked={visible}
                onCheckedChange={setVisible}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === "add" ? "Add Item" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
