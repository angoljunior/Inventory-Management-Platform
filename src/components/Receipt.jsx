import React from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const Receipt = React.forwardRef(({ sale }, ref) => {
  if (!sale) return null

  return (
    <Card
      ref={ref}
      className="w-[380px] rounded-2xl border bg-white text-black shadow-lg"
    >
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">
          Sunny Electronics
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <p>Accra, Ghana</p>
          <p>0240000000</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Receipt No</span>
            <span className="font-medium">#{sale.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Customer</span>
            <span className="font-medium">{sale.customer_name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone</span>
            <span className="font-medium">{sale.customer_phone}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Sold By</span>
            <span className="font-medium">{sale.sold_by}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">
              {sale.created_at || new Date().toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline">{sale.status}</Badge>
          </div>
        </div>

        <Separator />

        <div className="rounded-xl border p-4">
          <div className="mb-3 flex justify-between text-sm font-semibold">
            <span>Product</span>
            <span>Qty</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>{sale.product}</span>
            <span>x{sale.qty}</span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Unit Price</span>
            <span>GHS {sale.price}</span>
          </div>

          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>GHS {sale.subtotal}</span>
          </div>
        </div>

        <Separator />

        <p className="text-center text-sm font-medium">
          Thank you for shopping with us!
        </p>
      </CardContent>
    </Card>
  )
})

Receipt.displayName = "Receipt"

export default Receipt