import React, { useEffect, useMemo, useState } from "react"
import {
  MoreHorizontalIcon,
  Plus,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react"

import api from "@/api/axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Field,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])

  const [filter, setFilter] = useState("")
  const [sortAsc, setSortAsc] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    supplier: "",
    color: "",
    storage: "",
    sku: "",
    cost_price: "",
    selling_price: "",
    quantity: "",
  })

  const [visibleColumns, setVisibleColumns] = useState({
    product: true,
    category: true,
    price: true,
    quantity: true,
    status: true,
  })

  const fetchProducts = async () => {
    try {
      const res = await api.get("products/")
      setProducts(res.data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await api.get("categories/")
      setCategories(res.data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("suppliers/")
      setSuppliers(res.data)
    } catch (error) {
      console.error("Failed to fetch suppliers:", error)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchSuppliers()
  }, [])

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        name: formData.name,
        category: Number(formData.category),
        supplier: formData.supplier ? Number(formData.supplier) : null,
        color: formData.color,
        storage: formData.storage,
        sku: formData.sku,
        cost_price: formData.cost_price,
        selling_price: formData.selling_price,
        quantity: Number(formData.quantity),
      }

      await api.post("products/", payload)

      setFormData({
        name: "",
        category: "",
        supplier: "",
        color: "",
        storage: "",
        sku: "",
        cost_price: "",
        selling_price: "",
        quantity: "",
      })

      setOpen(false)
      fetchProducts()
      toast.success("Products Added successfully! ✅");
    } catch (error) {
      console.error("Failed to add product:", error.response?.data || error)
      toast.error("Failed to add Products! ✅");
    }
  }

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const name = product.name || ""
        const category = product.category_name || product.category || ""

        return (
          name.toLowerCase().includes(filter.toLowerCase()) ||
          String(category).toLowerCase().includes(filter.toLowerCase())
        )
      })
      .sort((a, b) => {
        if (sortAsc) {
          return a.name.localeCompare(b.name)
        }

        return b.name.localeCompare(a.name)
      })
  }, [products, filter, sortAsc])

  const allSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product) => selectedRows.includes(product.id))

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (allSelected) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredProducts.map((product) => product.id))
    }
  }

  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }))
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage products for your inventory.
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>

            <DialogContent
              className="sm:max-w-sm"
              style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
              <form onSubmit={handleAddProduct}>
                <DialogHeader>
                  <DialogTitle>Add Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the new product.
                  </DialogDescription>
                </DialogHeader>

                <FieldGroup className="mt-4">
                  <Field>
                    <Label htmlFor="product-name">Name</Label>
                    <Input
                      id="product-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Category</FieldLabel>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>Supplier</FieldLabel>
                    <Select
                      value={formData.supplier}
                      onValueChange={(value) =>
                        handleSelectChange("supplier", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {suppliers.map((supplier) => (
                            <SelectItem
                              key={supplier.id}
                              value={String(supplier.id)}
                            >
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <Label htmlFor="product-color">Color</Label>
                    <Input
                      id="product-color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="product-storage">Storage</Label>
                    <Input
                      id="product-storage"
                      name="storage"
                      value={formData.storage}
                      onChange={handleInputChange}
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="product-sku">SKU</Label>
                    <Input
                      id="product-sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="product-cost-price">Cost Price</Label>
                    <Input
                      id="product-cost-price"
                      name="cost_price"
                      type="number"
                      value={formData.cost_price}
                      onChange={handleInputChange}
                      required
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="product-selling-price">Selling Price</Label>
                    <Input
                      id="product-selling-price"
                      name="selling_price"
                      type="number"
                      value={formData.selling_price}
                      onChange={handleInputChange}
                      required
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="product-quantity">Quantity</Label>
                    <Input
                      id="product-quantity"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </Field>
                </FieldGroup>

                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Input
            placeholder="Filter products..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={visibleColumns.product}
                onCheckedChange={() => toggleColumn("product")}
              >
                Product
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={visibleColumns.category}
                onCheckedChange={() => toggleColumn("category")}
              >
                Category
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={visibleColumns.price}
                onCheckedChange={() => toggleColumn("price")}
              >
                Price
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={visibleColumns.quantity}
                onCheckedChange={() => toggleColumn("quantity")}
              >
                Qty
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={visibleColumns.status}
                onCheckedChange={() => toggleColumn("status")}
              >
                Status
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Table>
          <TableCaption>A list of your recent products.</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              </TableHead>

              {visibleColumns.product && (
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => setSortAsc(!sortAsc)}
                    className="px-0 font-semibold"
                  >
                    Product
                    <ArrowUpDown className="ml-2 h-4 w-4" />

                  </Button>
                </TableHead>
              )}

              {visibleColumns.category && <TableHead>Category</TableHead>}

              {visibleColumns.price && <TableHead>Price (GHS)</TableHead>}

              {visibleColumns.quantity && <TableHead>Qty</TableHead>}

              {visibleColumns.status && <TableHead>Status</TableHead>}
              {/* {visibleColumns.status && <TableHead>Barcode</TableHead>} */}

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const reorderLevel = product.reorder_level ?? 5
                const isLowStock =
                  product.is_low_stock || product.quantity <= reorderLevel

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(product.id)}
                        onCheckedChange={() => toggleRow(product.id)}
                      />
                    </TableCell>

                    {visibleColumns.product && (
                      <TableCell className="font-medium">
                        {product.name}
                        <TableCaption>
                          {product.color || "No color"}
                        </TableCaption>
                      </TableCell>
                    )}

                    {visibleColumns.category && (
                      <TableCell>
                        {product.category_name || product.category}
                      </TableCell>
                    )}

                    {visibleColumns.price && (
                      <TableCell>
                        GHS {product.selling_price || product.price}
                      </TableCell>
                    )}

                    {visibleColumns.quantity && (
                      <TableCell>{product.quantity}</TableCell>
                    )}

                    {visibleColumns.status && (
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            isLowStock
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {isLowStock ? "Low Stock" : "In Stock"}
                        </span>
                      </TableCell>
                    )}

{/*                     <TableCell>
  {product.barcode_image ? (
    <img
      src={product.barcode_image}
      alt={product.barcode_number}
      className="h-12 w-32 object-contain"
    />
  ) : (
    <span className="text-muted-foreground">No barcode</span>
  )}
</TableCell> */}

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontalIcon />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedRows.length} of {filteredProducts.length} row(s) selected.
          </p>

          <div className="flex items-center gap-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="outline" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Products