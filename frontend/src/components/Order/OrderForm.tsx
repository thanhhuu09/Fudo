"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AddressSelector } from "./AddressSelector";
import { useState } from "react";
import useAuthStore from "@/store/authStore";
import { updateUserProfile } from "@/services/userServices";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be 10 digits." }),
  paymentMethod: z.enum(["credit_card", "cod"], {
    required_error: "You need to select a payment method.",
  }),
});
// type Address = {
//   id: string;
//   label: string;
//   value: string;
// };
// const mockAddresses: Address[] = [
//   { id: "1", label: "Home", value: "123 Main St, City, Country" },
//   { id: "2", label: "Work", value: "456 Office Blvd, Business City, Country" },
// ];

export function OrderForm({
  onSubmit,
}: {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}) {
  const { user, accessToken } = useAuthStore((state) => state);
  const { handleSubmit } = useForm();

  const [addresses, setAddresses] = useState(user?.addresses || []);
  console.log("Addresses:", addresses);

  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      paymentMethod: "credit_card",
    },
  });

  const handleAddressSelect = (address: string) => {
    form.setValue("address", address);
  };

  const handleAddNewAddress = () => {
    setIsAddingNewAddress(true);
  };

  const handleAddressSubmit = async () => {
    const newAddress = form.getValues("address");
    console.log("New address:", newAddress);

    if (newAddress && accessToken && user?._id) {
      const updatedAddresses = await updateUserProfile(accessToken, user._id, {
        addresses: [...addresses, newAddress],
      });
      console.log("Updated addresses:", updatedAddresses.addresses);

      setAddresses(updatedAddresses.addresses);
      form.setValue("address", newAddress);
      setIsAddingNewAddress(false);
      console.log("Updated addresses:", updatedAddresses.addresses);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                {isAddingNewAddress ? (
                  <div>
                    <Input placeholder="Enter new address" {...field} />
                    <div className="mt-2">
                      <Button
                        type="button"
                        onClick={handleAddressSubmit}
                        size="sm"
                      >
                        Save Address
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => setIsAddingNewAddress(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <AddressSelector
                    addresses={addresses}
                    onSelect={handleAddressSelect}
                    onAddNew={handleAddNewAddress}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button
          type="submit"
          className="w-full bg-[#FFCB45] hover:bg-[#FFB800] text-black"
        >
          Place Order
        </Button>
      </form>
    </Form>
  );
}
