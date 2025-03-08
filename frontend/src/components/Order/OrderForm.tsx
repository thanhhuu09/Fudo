"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddressManagementDialog from "./AddressManagementDialog";
import useAuthStore from "@/store/authStore";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  selectedAddressId: z
    .string()
    .min(1, { message: "Please select an address." }),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be 10 digits." }),
  paymentMethod: z.enum(["credit_card", "cod"], {
    required_error: "You need to select a payment method.",
  }),
});

export interface Address {
  id: string;
  street: string;
  city: string;
  zipCode: string;
}

export function OrderForm({
  onSubmit,
}: {
  onSubmit: (data: z.infer<typeof formSchema>) => void; // Callback function to handle form submission
}) {
  const { user } = useAuthStore((state) => state);
  console.log(user);
  const [addresses, setAddresses] = useState<Address[]>([
    { id: "1", street: "123 Main St", city: "New York", zipCode: "10001" },
    { id: "2", street: "456 Elm St", city: "Los Angeles", zipCode: "90001" },
  ]);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      selectedAddressId: "",
      phone: "",
      paymentMethod: "credit_card",
    },
  });

  const handleAddAddress = (newAddress: Omit<Address, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAddresses([...addresses, { id, ...newAddress }]);
  };

  const handleEditAddress = (editedAddress: Address) => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === editedAddress.id ? editedAddress : addr
      )
    );
    setEditingAddress(null);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
    if (form.getValues("selectedAddressId") === id) {
      form.setValue("selectedAddressId", "");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address Selection Field */}
          <FormField
            control={form.control}
            name="selectedAddressId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue>
                          {field.value ? (
                            addresses.find((addr) => addr.id === field.value)
                              ?.street
                          ) : (
                            <span className="text-gray-400">
                              Select Address
                            </span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {addresses.length === 0 ? (
                          <SelectItem value="" disabled>
                            No addresses available
                          </SelectItem>
                        ) : (
                          addresses.map((address) => (
                            <SelectItem key={address.id} value={address.id}>
                              {address.street}, {address.city},{" "}
                              {address.zipCode}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <Button
                    type="button"
                    onClick={() => setIsAddressDialogOpen(true)}
                  >
                    Manage Addresses
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Method Field */}
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="credit_card" />
                      </FormControl>
                      <FormLabel className="font-normal">Credit Card</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="cod" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Cash on Delivery
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#FFCB45] hover:bg-[#FFB800] text-black"
          >
            Place Order
          </Button>
        </form>
      </Form>

      {/* Address Management Dialog */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Addresses</DialogTitle>
          </DialogHeader>
          <AddressManagementDialog
            addresses={addresses}
            onAddAddress={handleAddAddress}
            onEditAddress={handleEditAddress}
            onDeleteAddress={handleDeleteAddress}
            editingAddress={editingAddress}
            setEditingAddress={setEditingAddress}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
