import React, { useEffect, useState } from "react";
import api from "@/api/axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentSales = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchRecentSales();
  }, []);

  const fetchRecentSales = async () => {
    try {
      const response = await api.get("transactions/");

      const sortedSales = response.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );

      setSales(sortedSales.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch sales:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Recent Sales</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6 mx-4 ">
          <div className="grid grid-cols-3 text-muted-foreground font-medium border-b pb-4">
            <p>Product</p>
            <p>Amount</p>
            <p>Date</p>
          </div>

          {sales.length > 0 ? (
            sales.map((sale) => (
              <div
                key={sale.id}
                className="grid grid-cols-3 items-center border-b pb-4"
              >
                <div>
                  <h3 className="font-semibold text-lg">
                    {sale.items && sale.items.length > 0
                      ? sale.items[0].product_name
                      : sale.product?.name || "Product"}
                  </h3>

                  <p className="text-muted-foreground">{sale.customer_name}</p>
                </div>

                <div>
                  <p className="font-semibold text-lg">
                    GHS {sale.total_amount}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">
                    {new Date(sale.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No recent sales found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSales;
