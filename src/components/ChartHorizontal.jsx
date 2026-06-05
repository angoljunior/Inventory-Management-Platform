import React, { useEffect, useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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
  quantity: {
    label: "Quantity Sold",
    color: "var(--chart-1)",
  },
};

const ChartHorizontal = () => {
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
    const productSales = {};

    sales.forEach((sale) => {
      const items = sale.items || [];

      items.forEach((item) => {
        const productName = item.product_name || item.product || "Product";
        const quantity = Number(item.quantity || 0);

        productSales[productName] = (productSales[productName] || 0) + quantity;
      });
    });

    return Object.entries(productSales)
      .map(([product, quantity]) => ({
        product,
        quantity,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [sales]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>Products ranked by quantity sold</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 20 }}
          >
            <XAxis type="number" dataKey="quantity" hide />

            <YAxis
              dataKey="product"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={120}
              tickFormatter={(value) =>
                value.length > 14 ? value.slice(0, 14) + "..." : value
              }
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar dataKey="quantity" fill="var(--color-quantity)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Best performing products
          <TrendingUp className="h-4 w-4" />
        </div>

        <div className="leading-none text-muted-foreground">
          Showing top 5 products by units sold
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChartHorizontal;
