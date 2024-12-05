"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MetricsCards from "./MetricsCards";

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <MetricsCards />
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[200px]">
            {/* Replace with your preferred charting library */}
            <div className="flex items-center justify-center h-full text-gray-500">
              Revenue Chart Placeholder
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
