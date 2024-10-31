import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const metrics = [
  {
    title: "Total Revenue",
    metric: "$12,345",
    description: "10% increase from last month",
  },
  {
    title: "Active Users",
    metric: "2,345",
    description: "5% increase from last week",
  },
  {
    title: "Total Orders",
    metric: "1,234",
    description: "15% increase from yesterday",
  },
  {
    title: "Pending Orders",
    metric: "56",
    description: "3 less than average",
  },
];

const MetricsCards: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.metric}</div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsCards;
