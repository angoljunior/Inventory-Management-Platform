import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PackageIcon,
  AlertTriangleIcon,
  ShoppingCartIcon,
  WalletIcon,
} from "lucide-react";

import api from "@/api/axios";

export function SectionCards() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStockValue: 0,
    totalSales: 0,
    lowStockItems: 0,
  });

  const fetchStats = async () => {
    try {
      const productsRes = await api.get("products/");
      const salesRes = await api.get("transactions/");

      const products = productsRes.data;
      const sales = salesRes.data;

      const totalProducts = products.length;

      const totalStockValue = products.reduce((sum, product) => {
        const price = Number(product.selling_price || 0);
        const quantity = Number(product.quantity || 0);
        return sum + price * quantity;
      }, 0);

      const totalSales = sales.reduce((sum, sale) => {
        return sum + Number(sale.total_amount || 0);
      }, 0);

      const lowStockItems = products.filter((product) => {
        const quantity = Number(product.quantity || 0);
        const reorderLevel = Number(product.reorder_level || 5);
        return quantity <= reorderLevel;
      }).length;

      setStats({
        totalProducts,
        totalStockValue,
        totalSales,
        lowStockItems,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Products</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalProducts}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <PackageIcon className="size-4" />
              Products
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Products in inventory <PackageIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total number of products added
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Stock Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            GHS {stats.totalStockValue.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <WalletIcon className="size-4" />
              Stock
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Current inventory value <WalletIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Based on selling price × quantity
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Sales</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            GHS {stats.totalSales.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ShoppingCartIcon className="size-4" />
              Sales
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Revenue from sales <ShoppingCartIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Sum of all completed sale records
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Low Stock Items</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.lowStockItems}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <AlertTriangleIcon className="size-4" />
              Alert
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Items need restocking <AlertTriangleIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Quantity is below reorder level
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
