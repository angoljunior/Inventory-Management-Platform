import React, { useEffect, useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart as BarChartComponent,
  CartesianGrid,
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
  stock: {
    label: "Stock Quantity",
    color: "var(--chart-1)",
  },
  products: {
    label: "Products",
    color: "var(--chart-2)",
  },
};

const BarChart = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("month");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("products/");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const now = new Date();

    return products.filter((product) => {
      const productDate = new Date(product.created_at || product.date_added || product.updated_at);

      if (Number.isNaN(productDate.getTime())) return true;

      if (filter === "day") {
        return productDate.toDateString() === now.toDateString();
      }

      if (filter === "week") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return productDate >= sevenDaysAgo && productDate <= now;
      }

      if (filter === "month") {
        return (
          productDate.getMonth() === now.getMonth() &&
          productDate.getFullYear() === now.getFullYear()
        );
      }

      return true;
    });
  }, [products, filter]);

  const chartData = useMemo(() => {
    const groupedData = {};

    filteredProducts.forEach((product) => {
      const categoryName =
        product.category_name ||
        product.category?.name ||
        product.category ||
        "Uncategorised";

      if (!groupedData[categoryName]) {
        groupedData[categoryName] = {
          category: categoryName,
          stock: 0,
          products: 0,
        };
      }

      groupedData[categoryName].stock += Number(product.quantity || 0);
      groupedData[categoryName].products += 1;
    });

    return Object.values(groupedData);
  }, [filteredProducts]);

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Stock Report by Category</CardTitle>
            <CardDescription>
              Showing stock quantity grouped by category
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
            <BarChartComponent accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => String(value).slice(0, 12)}
              />
                  
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />

              <Bar dataKey="stock" fill="var(--color-stock)" radius={4} />
              <Bar dataKey="products" fill="var(--color-products)" radius={4} />
            </BarChartComponent>
          </ChartContainer>
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Stock report by category <TrendingUp className="h-4 w-4" />
          </div>

          <div className="leading-none text-muted-foreground">
            Showing stock quantity and product count based on selected filter
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BarChart;