import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Invoice = React.forwardRef(({ sale }, ref) => {
  if (!sale) return null;

  const items = sale.items || [];

  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.subtotal || 0),
    0,
  );

  return (
    <Card ref={ref} className="w-[750px] bg-white text-black shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Sunny Electronics</CardTitle>
        <p className="text-sm text-muted-foreground">
          Accra, Ghana | 0240000000
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <Separator />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p>
              <strong>Invoice No:</strong> #{sale.id}
            </p>
            <p>
              <strong>Customer:</strong> {sale.customer_name || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {sale.customer_phone || "N/A"}
            </p>
          </div>

          <div className="text-right">
            <p>
              <strong>Sold By:</strong>{" "}
              {sale.sold_by || sale.recorded_by || "N/A"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {sale.created_at
                ? new Date(sale.created_at).toLocaleString()
                : new Date().toLocaleString()}
            </p>
            <Badge variant="outline">{sale.status || "Pending"}</Badge>
          </div>
        </div>

        <Separator />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id || item.product}>
                <TableCell className="font-medium">
                  {item.product_name || item.product || "Product"}
                </TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  GHS {item.unit_price}
                </TableCell>
                <TableCell className="text-right">
                  GHS {item.subtotal}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Separator />

        <div className="flex justify-end">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>GHS {totalAmount}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span>GHS 0.00</span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>GHS {sale.total_amount || totalAmount}</span>
            </div>
          </div>
        </div>

        <Separator />

        <p className="text-center text-sm font-medium">
          Thank you for shopping with us!
        </p>
      </CardContent>
    </Card>
  );
});

Invoice.displayName = "Invoice";

export default Invoice;
