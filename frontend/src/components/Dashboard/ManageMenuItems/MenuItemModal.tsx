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

import Image from "next/image";
import { toast } from "sonner";
import axios from "axios";
import { Category, MenuItemForm, MenuItem } from "@/types";
import { NumericFormat } from "react-number-format";
import { addMenu, updateMenu, uploadFile } from "@/services/menuServices";
import useAuthStore from "@/store/authStore";
import { AddNewCategory } from "./AddNewCategory";

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MenuItemForm) => void;
  initialData?: MenuItem;
  mode: "add" | "edit";
  categories: Category[];
}

export default function MenuItemModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
  categories,
}: MenuItemModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryID, setCategoryID] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [inStock, setInStock] = useState(true);
  const [quantity, setQuantity] = useState<number>(0);
  const [visible, setVisible] = useState(true);
  const [imageURL, setImageURL] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accessToken = useAuthStore((state) => state.accessToken);

  console.log("initialData", initialData);
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      setCategoryID(initialData.categoryID._id);
      setPrice(initialData.price);
      setInStock(initialData.inStock);
      setQuantity(initialData.quantity);
      setVisible(initialData.visible);
    }
  }, [initialData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageURL(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImageURL(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async () => {
    if (!name || !categoryID || !price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const data: MenuItemForm = {
      name,
      description,
      categoryID,
      price: price,
      inStock,
      quantity: inStock ? quantity : 0,
      visible,
      imageURL: initialData?.imageURL || "",
    };

    try {
      if (mode === "add") {
        if (accessToken === null) {
          toast.error("Please log in to continue.");
          return;
        }
        const response = await addMenu(data, accessToken);
        if (response) {
          if (imageURL instanceof File) {
            const res = await uploadFile(imageURL, accessToken);
            if (res) {
              data.imageURL = res.imageUrl;
              const menuItemUpdated = await updateMenu(
                response._id,
                data,
                accessToken
              );
              console.log("menuItemUpdated", menuItemUpdated);

              if (menuItemUpdated) {
                toast.success("Menu item added successfully.");
                onSave(menuItemUpdated);
              } else {
                toast.error("Failed to add menu item.");
              }
            }
          }
        }
      } else {
        // Update existing menu item
        const updatedData = { ...data };

        // Handle image update if there's a new image
        if (imageURL instanceof File) {
          const formData = new FormData();
          formData.append("file", imageURL);
          const uploadResponse = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/upload?oldImageUrl=${initialData?.imageURL}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          updatedData.imageURL = uploadResponse.data.imageUrl;
        }

        // Update the menu item
        const response = await updateMenu(
          initialData?._id as string,
          updatedData,
          accessToken as string
        );
        if (response) {
          toast.success("Menu item updated successfully.");
          onSave(response);
        } else {
          toast.error("Failed to update menu item.");
        }
      }

      onClose();
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategoryID("");
    setPrice(0);
    setInStock(true);
    setQuantity(0);
    setVisible(true);
    setImageURL(null);
  };

  const renderImage = () => {
    if (imageURL) {
      return URL.createObjectURL(imageURL);
    } else if (initialData?.imageURL) {
      return initialData.imageURL;
    }
    return null;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
          resetForm();
        }
      }}
    >
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
              <AddNewCategory
                categories={categories}
                onChange={(categoryID: string) => setCategoryID(categoryID)}
                value={categoryID}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  $
                </span>
                <NumericFormat
                  customInput={Input}
                  id="price"
                  placeholder="0.00"
                  value={price}
                  onValueChange={({ floatValue }) => setPrice(floatValue ?? 0)}
                  className="pl-7"
                  allowNegative={false}
                  thousandSeparator={true}
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
                <NumericFormat
                  customInput={Input}
                  id="quantity"
                  placeholder="Enter available quantity"
                  value={quantity}
                  onValueChange={({ floatValue }) =>
                    setQuantity(floatValue ?? 0)
                  }
                  allowNegative={false}
                  decimalScale={0}
                  required
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
                      src={renderImage() as string}
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
                        setImageURL(null);
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
