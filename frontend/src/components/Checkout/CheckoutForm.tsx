"use client";

import type React from "react";
import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

export function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-result`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? "An unknown error occurred");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button disabled={!stripe || isLoading} className="w-full">
        {isLoading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </Button>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </form>
  );
}
