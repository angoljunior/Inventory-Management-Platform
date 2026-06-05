import React, { useEffect, useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Dot, Line, LineChart, XAxis, YAxis } from "recharts";

import api from "@/api/axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  total: {
    label: "Sales",
    color: "var(--chart-2)",
  },
};

const LineChartHome = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await api.get("transactions/");
        setSales(res.data);
      } catch (error) {
        console.error("Failed to fetch sales:", error);
      }
    };

    fetchSales();
  }, []);

  const chartData = useMemo(() => {
    const monthlySales = {};

    sales.forEach((sale) => {
      const date = new Date(sale.created_at);
      const month = date.toLocaleString("default", { month: "short" });

      monthlySales[month] =
        (monthlySales[month] || 0) + Number(sale.total_amount || 0);
    });

    return Object.entries(monthlySales).map(([month, total]) => ({
      month,
      total,
      fill: "var(--color-total)",
    }));
  }, [sales]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Over Time</CardTitle>
        <CardDescription>Revenue grouped by month</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 24, left: 24, right: 24 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey="total"
                  hideLabel
                />
              }
            />

            <Line
              dataKey="total"
              type="natural"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={({ payload, ...props }) => (
                <Dot
                  key={payload.month}
                  r={5}
                  cx={props.cx}
                  cy={props.cy}
                  fill={payload.fill}
                  stroke={payload.fill}
                />
              )}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Sales performance overview
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total sales revenue over time
        </div>
      </CardFooter>
    </Card>
  );
};

export default LineChartHome;
