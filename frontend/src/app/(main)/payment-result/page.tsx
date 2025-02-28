"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentResult() {
  const [status, setStatus] = useState<"success" | "failure" | "processing">(
    "processing"
  );
  const searchParams = useSearchParams();

  useEffect(() => {
    const clientSecret = searchParams.get("payment_intent");
    if (clientSecret) {
      fetch(`/api/payment-status?payment_intent=${clientSecret}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status === "succeeded" ? "success" : "failure");
        });
    }
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Result</h1>
      {status === "processing" && <p>Processing your payment...</p>}
      {status === "success" && (
        <>
          <p className="text-green-600 mb-4">Your payment was successful!</p>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </>
      )}
      {status === "failure" && (
        <>
          <p className="text-red-600 mb-4">
            Your payment failed. Please try again.
          </p>
          <Link href="/checkout">
            <Button>Try Again</Button>
          </Link>
        </>
      )}
    </div>
  );
}
