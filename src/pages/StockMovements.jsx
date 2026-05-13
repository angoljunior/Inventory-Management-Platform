import React, { useState } from "react"
import {
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  RotateCcw,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableCaption,
  TableRow,
} from "@/components/ui/table"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";



const movements = [
  {
    id: 1,
    product: "iPhone 15 Pro Max 256GB",
    type: "IN",
    quantity: 50,
    date: "2024-01-15",
    note: "New shipment from Apple",
  },
  {
    id: 2,
    product: "AirPods Pro 2nd Gen",
    type: "OUT",
    quantity: 5,
    date: "2024-01-15",
    note: "Sold",
  },
  {
    id: 3,
    product: "iPhone 14 128GB",
    type: "RETURN",
    quantity: 1,
    date: "2024-01-14",
    note: "Customer return - defective",
  },
  {
    id: 4,
    product: "MagSafe Charger",
    type: "DAMAGED",
    quantity: 2,
    date: "2024-01-14",
    note: "Warehouse damage",
  },
  {
    id: 5,
    product: "iPhone 15 128GB",
    type: "IN",
    quantity: 30,
    date: "2024-01-13",
    note: "Restock",
  },
  {
    id: 6,
    product: "iPhone SE 64GB",
    type: "OUT",
    quantity: 3,
    date: "2024-01-13",
    note: "Sold",
  },
]

const filterTypes = ["ALL", "IN", "OUT", "RETURN", "DAMAGED"]

const getTypeStyles = (type) => {
  switch (type) {
    case "IN":
      return "bg-green-100 text-green-600"
    case "OUT":
      return "bg-blue-100 text-blue-600"
    case "RETURN":
      return "bg-orange-100 text-orange-600"
    case "DAMAGED":
      return "bg-red-100 text-red-600"
    default:
      return "bg-gray-100 text-gray-600"
  }
}

const getTypeIcon = (type) => {
  switch (type) {
    case "IN":
      return <ArrowDownCircle className="h-4 w-4" />
    case "OUT":
      return <ArrowUpCircle className="h-4 w-4" />
    case "RETURN":
      return <RotateCcw className="h-4 w-4" />
    case "DAMAGED":
      return <AlertCircle className="h-4 w-4" />
    default:
      return null
  }
}

const StockMovements = () => {
  const [activeFilter, setActiveFilter] = useState("ALL")

  const filteredMovements =
    activeFilter === "ALL"
      ? movements
      : movements.filter((movement) => movement.type === activeFilter)

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Stock Movements
          </h1>
          <p className="text-muted-foreground">
            Track inventory changes
          </p>
        </div>

        <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Supplier
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Add Supplier</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the new supplier.
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="name-1">Name</Label>
                    <Input id="name-1" name="name" />
                  </Field>
                  <Field>
                    <Label htmlFor="username-1">Username</Label>
                    <Input id="username-1" name="username" />
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap gap-3">
          {filterTypes.map((type) => (
            <Button
              key={type}
              variant={activeFilter === type ? "default" : "outline"}
              onClick={() => setActiveFilter(type)}
              className={
                activeFilter === type && type === "RETURN"
                  ? "bg-cyan-500 text-white hover:bg-cyan-600"
                  : ""
              }
            >
              {type}
            </Button>
          ))}
        </div>

        <Table>
          <TableCaption>
            A list of your recent stock movements.
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredMovements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell className="font-medium">
                  {movement.product}
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getTypeStyles(
                      movement.type
                    )}`}
                  >
                    {getTypeIcon(movement.type)}
                    {movement.type}
                  </span>
                </TableCell>

                <TableCell className="font-medium">
                  {movement.quantity}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {movement.date}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {movement.note}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredMovements.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            No stock movements found.
          </div>
        )}
      </div>
    </div>
  )
}

export default StockMovements