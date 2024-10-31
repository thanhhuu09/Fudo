import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";

const Analytics: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
        <CardDescription>
          View detailed analytics of your food ordering platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center text-gray-500">
          Analytics Dashboard Placeholder
        </div>
      </CardContent>
    </Card>
  );
};

export default Analytics;
