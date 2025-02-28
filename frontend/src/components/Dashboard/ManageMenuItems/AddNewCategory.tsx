"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAuthStore from "@/store/authStore";
import { addCategory } from "@/services/categoryService";

type Category = {
  _id: string;
  name: string;
};

type CategorySelectProps = {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
};

export function AddNewCategory({
  categories,
  value,
  onChange,
}: CategorySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);
  const [localCategories, setLocalCategories] = React.useState(categories);
  const accessToken = useAuthStore((state) => state.accessToken);

  const handleAddCategory = async () => {
    if (newCategory.trim() !== "") {
      setIsAdding(true);
      try {
        const addedCat = await addCategory(
          {
            name: newCategory,
            description: "",
          },
          accessToken as string
        );
        setLocalCategories([...localCategories, addedCat]);
        const category = localCategories.find(
          (cat) => cat.name === newCategory
        );
        onChange(category?._id || "");
        setNewCategory("");
        setOpen(false);
      } catch (error) {
        console.error("Failed to add category:", error);
        // Handle error (e.g., show an error message to the user)
      } finally {
        setIsAdding(false);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category *</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="category">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {localCategories.map((cat) => (
            <SelectItem key={cat._id} value={cat._id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="p-0 h-auto">
            <span className="text-sm text-muted-foreground mr-1">
              Can&apos;t find your category?
            </span>
            Add new category
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category to use in your selection.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-category">Category Name</Label>
              <Input
                id="new-category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleAddCategory} disabled={isAdding}>
              {isAdding ? "Adding..." : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
