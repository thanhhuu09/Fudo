"use client";
import React, { useEffect } from "react";
import { Address } from "./OrderForm";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema for the address form (same as in OrderForm for consistency)
const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().length(5, "Zip code must be exactly 5 characters"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressManagementDialogProps {
  addresses: Address[];
  onAddAddress: (newAddress: Omit<Address, "id">) => void;
  onEditAddress: (editedAddress: Address) => void;
  onDeleteAddress: (id: string) => void;
  editingAddress: Address | null;
  setEditingAddress: (address: Address | null) => void;
}

const AddressManagementDialog = ({
  addresses,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  editingAddress,
  setEditingAddress,
}: AddressManagementDialogProps) => {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      zipCode: "",
    },
  });

  // Sync form with editingAddress
  useEffect(() => {
    if (editingAddress) {
      form.reset(editingAddress);
    } else {
      form.reset({ street: "", city: "", zipCode: "" });
    }
  }, [editingAddress, form]);

  const onSubmit = (data: AddressFormValues) => {
    console.log("Form Data Submitted:", data);
    console.log("Form Errors:", form.formState.errors); // Debug errors
    if (editingAddress) {
      onEditAddress({ id: editingAddress.id, ...data } as Address);
    } else {
      onAddAddress(data);
    }
    form.reset();
    setEditingAddress(null);
  };

  return (
    <div className="mt-4">
      {/* Form for adding/editing addresses */}
      <Form {...form}>
        <form className="space-y-4 mb-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter street" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="City" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter zip code (5 digits)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {editingAddress ? "Update Address" : "Add Address"}
          </Button>
        </form>
      </Form>

      {/* List of existing addresses */}
      <div className="space-y-2">
        {addresses.length === 0 ? (
          <p className="text-gray-500">No addresses available.</p>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className="flex items-center justify-between bg-gray-100 p-2 rounded"
            >
              <div>
                <p className="font-semibold">{address.street}</p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.zipCode}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditingAddress(address);
                    form.reset(address); // Populate form with address data
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDeleteAddress(address.id)}
                >
                  <Trash2 className="h-4 w-4" color="red" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressManagementDialog;
