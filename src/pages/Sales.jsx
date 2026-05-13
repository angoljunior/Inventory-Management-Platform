import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  MoreHorizontalIcon,
  ArrowUpDown,
  Plus,
} from "lucide-react"

import api from "@/api/axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

import { useReactToPrint } from "react-to-print"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import Receipt from "@/components/Receipt"
import BarcodeScannerComponent from "react-qr-barcode-scanner"


import {
  DropdownMenu,
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Label } from "@/components/ui/label"

const Sales = () => {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const userName = localStorage.getItem("userName")
  const [showScanner, setShowScanner] = useState(false)

  const [filter, setFilter] = useState("")
  const [sortAsc, setSortAsc] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState(null)

  const [barcode, setBarcode] = useState("")
  const [scannedProduct, setScannedProduct] = useState(null)
  const [barcodeError, setBarcodeError] = useState("")

  const receiptRef = useRef(null)

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    product: "",
    quantity: "",
    status: "Pending",
    created_at: "",
  })

  const [visibleColumns] = useState({
    product: true,
    qty: true,
    price: true,
    subtotal: true,
    customer_name: true,
    sold_by: true,
    status: true,
    date: true,
  })

  const fetchSales = async () => {
    try {
      const res = await api.get("sales/")
      setSales(res.data)
    } catch (error) {
      console.error("Failed to fetch sales:", error)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await api.get("products/")
      setProducts(res.data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }

  useEffect(() => {
    fetchSales()
    fetchProducts()
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

  const handleBarcodeLookup = async (code = barcode) => {
    if (!code) return

    try {
      setBarcodeError("")

      const res = await api.get(`products/barcode/${code}/`)
      const product = res.data

      setScannedProduct(product)

      setFormData((prev) => ({
        ...prev,
        product: String(product.id),
        quantity: "1",
      }))
    } catch (error) {
      setScannedProduct(null)
      setBarcodeError("Product not found for this barcode.")
      console.error("Barcode lookup failed:", error.response?.data || error)
    }
  }

  const handleAddSale = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        product: Number(formData.product),
        quantity: Number(formData.quantity),
        status: formData.status,
      }

      if (formData.created_at) {
        payload.created_at = `${formData.created_at}:00`
      }

      await api.post("sales/", payload)

      setFormData({
        customer_name: "",
        customer_phone: "",
        product: "",
        quantity: "",
        status: "Pending",
        created_at: "",
      })

      setBarcode("")
      setScannedProduct(null)
      setBarcodeError("")

      setOpen(false)
      fetchSales()
      fetchProducts()
    } catch (error) {
      console.error("Failed to add sale:", error.response?.data || error)
    }
  }

  const handleDeleteSale = async (id) => {
    try {
      await api.delete(`sales/${id}/`)
      fetchSales()
    } catch (error) {
      console.error("Failed to delete sale:", error.response?.data || error)
    }
  }

  const handlePrintReceipt = useReactToPrint({
    contentRef: receiptRef,
  })

  const handleDownloadPDF = async () => {
    if (!receiptRef.current || !selectedSale) return

    const canvas = await html2canvas(receiptRef.current)
    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF("p", "mm", "a4")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const imgHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight)
    pdf.save(`receipt-${selectedSale.id}.pdf`)
  }

  const formattedSales = useMemo(() => {
    return sales.map((sale) => {
      const productName = sale.product_name || sale.product || "Product"
      const price = sale.unit_price || sale.price || 0
      const qty = sale.quantity || 0
      const subtotal =
        sale.subtotal || sale.total_amount || Number(price) * Number(qty)

      return {
        id: sale.id,
        product: productName,
        qty,
        price,
        subtotal,
        customer_name: sale.customer_name || "N/A",
        customer_phone: sale.customer_phone || "N/A",
        sold_by: sale.sold_by || sale.recorded_by || userName || "N/A",
        status: sale.status || "Pending",
        created_at: sale.created_at
          ? new Date(sale.created_at).toLocaleString()
          : "N/A",
      }
    })
  }, [sales, userName])

  const filteredSales = useMemo(() => {
    return formattedSales
      .filter((sale) =>
        sale.product?.toLowerCase().includes(filter.toLowerCase()) ||
        String(sale.qty).includes(filter) ||
        String(sale.price).includes(filter) ||
        String(sale.subtotal).includes(filter) ||
        sale.customer_name?.toLowerCase().includes(filter.toLowerCase()) ||
        String(sale.sold_by).toLowerCase().includes(filter.toLowerCase()) ||
        sale.status?.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) =>
        sortAsc
          ? a.product.localeCompare(b.product)
          : b.product.localeCompare(a.product)
      )
  }, [formattedSales, filter, sortAsc])

  const allSelected =
    filteredSales.length > 0 &&
    filteredSales.every((sale) => selectedRows.includes(sale.id))

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    )
  }

  const toggleAll = () => {
    setSelectedRows(allSelected ? [] : filteredSales.map((sale) => sale.id))
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
            <p className="text-muted-foreground">
              Manage sales records for your inventory.
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Sales
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm"style={{ maxHeight: "90vh", overflowY: "auto" }}>
              <form onSubmit={handleAddSale}>
                <DialogHeader>
                  <DialogTitle>Add Sale</DialogTitle>
                  <DialogDescription>
                    Scan barcode or select a product manually.
                  </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                  <Field>
                    <Label htmlFor="customer-name">Customer Name</Label>
                    <Input
                      id="customer-name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      required
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="customer-phone">Customer Phone</Label>
                    <Input
                      id="customer-phone"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="created-at">Date Added</Label>
                    <Input
                      id="created-at"
                      name="created_at"
                      type="datetime-local"
                      value={formData.created_at}
                      onChange={handleInputChange}
                    />
                  </Field>

                  <Field>
              <Label htmlFor="barcode">Scan Barcode</Label>

        <Input
          id="barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleBarcodeLookup()
            }
          }}
          placeholder="Scan or enter barcode..."
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => setShowScanner(!showScanner)}
        >
          {showScanner ? "Close Scanner" : "Open Scanner"}
        </Button>

        {showScanner && (
          <div className="mt-3 overflow-hidden rounded-lg border">
            <BarcodeScannerComponent
              width={350}
              height={250}
              onUpdate={(err, result) => {
                if (result) {
                  const scannedCode = result.text
                  setBarcode(scannedCode)
                  handleBarcodeLookup(scannedCode)
                  setShowScanner(false)
                }
              }}
            />
          </div>
        )}

        {barcodeError && (
          <p className="text-sm text-red-500">{barcodeError}</p>
        )}
      </Field>

                  <Field>
                    <FieldLabel>Add product</FieldLabel>
                    <Select
                      value={formData.product}
                      onValueChange={(value) => {
                        handleSelectChange("product", value)

                        const selected = products.find(
                          (product) => String(product.id) === value
                        )

                        setScannedProduct(selected || null)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {products.map((product) => (
                            <SelectItem
                              key={product.id}
                              value={String(product.id)}
                            >
                              {product.name} - Qty: {product.quantity}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <Label htmlFor="sale-quantity">Quantity</Label>
                    <Input
                      id="sale-quantity"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELED">Canceled</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>

                <DialogFooter>
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
            placeholder="Filter sales..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableCaption>A list of your recent sales.</TableCaption>

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

              {visibleColumns.qty && <TableHead>Qty</TableHead>}
              {visibleColumns.price && <TableHead>Price</TableHead>}
              {visibleColumns.subtotal && <TableHead>Subtotal</TableHead>}
              {visibleColumns.customer_name && (
                <TableHead>Customer Name</TableHead>
              )}
              {visibleColumns.sold_by && <TableHead>Sold By</TableHead>}
              {visibleColumns.date && <TableHead>Date</TableHead>}
              {visibleColumns.status && <TableHead>Status</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(sale.id)}
                      onCheckedChange={() => toggleRow(sale.id)}
                    />
                  </TableCell>

                  {visibleColumns.product && (
                    <TableCell className="font-medium">
                      {sale.product}
                    </TableCell>
                  )}

                  {visibleColumns.qty && <TableCell>{sale.qty}</TableCell>}
                  {visibleColumns.price && (
                    <TableCell>GHS {sale.price}</TableCell>
                  )}
                  {visibleColumns.subtotal && (
                    <TableCell>GHS {sale.subtotal}</TableCell>
                  )}
                  {visibleColumns.customer_name && (
                    <TableCell>{sale.customer_name}</TableCell>
                  )}
                  {visibleColumns.sold_by && (
                    <TableCell>{sale.sold_by}</TableCell>
                  )}
                  {visibleColumns.date && (
                    <TableCell>{sale.created_at}</TableCell>
                  )}

                  {visibleColumns.status && (
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          sale.status === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : sale.status === "CANCELED"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {sale.status}
                      </span>
                    </TableCell>
                  )}

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedSale(sale)}>
                          View Receipt
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedSale(sale)
                            setTimeout(() => {
                              handlePrintReceipt()
                            }, 300)
                          }}
                        >
                          Print Receipt
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedSale(sale)
                            setTimeout(handleDownloadPDF, 300)
                          }}
                        >
                          Download PDF
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => handleDeleteSale(sale.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-24 text-center text-muted-foreground"
                >
                  No sales found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedRows.length} of {filteredSales.length} row(s) selected.
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

        <div className="fixed left-[-9999px] top-0">
          <Receipt ref={receiptRef} sale={selectedSale} />
        </div>
      </div>
    </>
  )
}

export default Sales