import React, { useEffect, useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart as LineChartComponent,
  XAxis,
} from "recharts";

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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
};

const LineChart = () => {
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState("week");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await api.get("sales/");
        setSales(res.data);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };

    fetchSales();
  }, []);

  const chartData = useMemo(() => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    if (filter === "day") {
      const today = new Date();

      return sales
        .filter((sale) => {
          const saleDate = new Date(sale.created_at);
          return saleDate.toDateString() === today.toDateString();
        })
        .map((sale) => ({
          period: new Date(sale.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sales: Number(sale.total_amount || sale.subtotal || 0),
        }));
    }

    if (filter === "week") {
      const groupedData = daysOfWeek.map((day) => ({
        period: day,
        sales: 0,
      }));

      sales.forEach((sale) => {
        const saleDate = new Date(sale.created_at);
        const dayIndex = saleDate.getDay();

        groupedData[dayIndex].sales += Number(
          sale.total_amount || sale.subtotal || 0
        );
      });

      return groupedData;
    }

    if (filter === "month") {
      const groupedData = {};

      sales.forEach((sale) => {
        const saleDate = new Date(sale.created_at);
        const day = saleDate.getDate();

        if (!groupedData[day]) {
          groupedData[day] = {
            period: `Day ${day}`,
            sales: 0,
          };
        }

        groupedData[day].sales += Number(
          sale.total_amount || sale.subtotal || 0
        );
      });

      return Object.values(groupedData);
    }

    return [];
  }, [sales, filter]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sales Line Chart</CardTitle>
          <CardDescription>
            Visualizing sales made from inventory records
          </CardDescription>
        </div>

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChartComponent
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Line
              dataKey="sales"
              type="natural"
              stroke="var(--color-sales)"
              strokeWidth={2}
              dot={false}
            />
          </LineChartComponent>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Sales performance overview <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing sales report based on selected filter
        </div>
      </CardFooter>
    </Card>
  );
};

export default LineChart;