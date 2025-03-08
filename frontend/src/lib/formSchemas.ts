import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(5).max(10),
});

export const orderSchema = z.object({
  addresses: z.array(addressSchema).min(1, "At least one address is required"),
});

export type OrderFormData = z.infer<typeof orderSchema>;
