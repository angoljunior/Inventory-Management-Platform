import React, { useEffect, useMemo, useRef, useState } from "react";
import { MoreHorizontalIcon, ArrowUpDown, Plus, Trash2 } from "lucide-react";

import api from "@/api/axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import Invoice from "@/components/Invoice";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableCaption,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const userName = localStorage.getItem("userName");

  const [showScanner, setShowScanner] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [barcodeError, setBarcodeError] = useState("");
  const [scannedProduct, setScannedProduct] = useState(null);

  const [filter, setFilter] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const invoiceRef = useRef(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    status: "Pending",
    created_at: "",
  });

  const visibleColumns = {
    invoice: true,
    customer_name: true,
    items: true,
    total: true,
    sold_by: true,
    status: true,
    date: true,
  };

  const fetchSales = async () => {
    try {
      const res = await api.get("transactions/");
      setSales(res.data);
    } catch (error) {
      console.error("Failed to fetch sales:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("products/");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addToCart = (product, quantity = 1) => {
    const price = Number(product.selling_price || product.price || 0);

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product === product.id);

      if (existing) {
        return prev.map((item) =>
          item.product === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * item.unit_price,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          product: product.id,
          product_name: product.name,
          quantity,
          unit_price: price,
          subtotal: price * quantity,
          stock: product.quantity,
        },
      ];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    const qty = Number(quantity);

    if (qty < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.product === productId
          ? {
              ...item,
              quantity: qty,
              subtotal: qty * item.unit_price,
            }
          : item,
      ),
    );
  };

  const removeCartItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handleBarcodeLookup = async (code = barcode) => {
    if (!code) return;

    try {
      setBarcodeError("");

      const res = await api.get(`products/barcode/${code}/`);
      const product = res.data;

      setScannedProduct(product);
      addToCart(product, 1);
      setBarcode("");
    } catch (error) {
      setScannedProduct(null);
      setBarcodeError("Product not found for this barcode.");
      console.error("Barcode lookup failed:", error.response?.data || error);
    }
  };

  const handleAddSale = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Please add at least one product to the cart.");
      return;
    }

    try {
      const payload = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        status: formData.status,
        items: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      };

      if (formData.created_at) {
        payload.created_at = `${formData.created_at}:00`;
      }

      await api.post("transactions/", payload);

      setFormData({
        customer_name: "",
        customer_phone: "",
        status: "Pending",
        created_at: "",
      });

      setCartItems([]);
      setBarcode("");
      setScannedProduct(null);
      setBarcodeError("");
      setOpen(false);

      fetchSales();
      fetchProducts();
    } catch (error) {
      console.error("Failed to add sale:", error.response?.data || error);
    }
  };

  const handleDeleteSale = async (id) => {
    try {
      await api.delete(`transactions/${id}/`);
      fetchSales();
    } catch (error) {
      console.error("Failed to delete sale:", error.response?.data || error);
    }
  };

  const handlePrintInvoice = useReactToPrint({
    contentRef: invoiceRef,
  });

  const handleDownloadInvoicePDF = async () => {
    if (!invoiceRef.current || !selectedInvoice) return;

    const canvas = await html2canvas(invoiceRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
    pdf.save(`invoice-${selectedInvoice.id}.pdf`);
  };

  const formattedSales = useMemo(() => {
    return sales.map((sale) => {
      const items = sale.items || [];
      const totalAmount =
        sale.total_amount ||
        items.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);

      return {
        id: sale.id,
        customer_name: sale.customer_name || "N/A",
        customer_phone: sale.customer_phone || "N/A",
        sold_by: sale.sold_by || sale.recorded_by || userName || "N/A",
        status: sale.status || "Pending",
        total_amount: totalAmount,
        items,
        created_at: sale.created_at
          ? new Date(sale.created_at).toLocaleString()
          : "N/A",
      };
    });
  }, [sales, userName]);

  const filteredSales = useMemo(() => {
    return formattedSales
      .filter((sale) => {
        const itemText = sale.items
          .map((item) => item.product_name || item.product || "")
          .join(" ");

        return (
          String(sale.id).includes(filter) ||
          sale.customer_name?.toLowerCase().includes(filter.toLowerCase()) ||
          String(sale.sold_by).toLowerCase().includes(filter.toLowerCase()) ||
          sale.status?.toLowerCase().includes(filter.toLowerCase()) ||
          itemText.toLowerCase().includes(filter.toLowerCase()) ||
          String(sale.total_amount).includes(filter)
        );
      })
      .sort((a, b) =>
        sortAsc
          ? String(a.id).localeCompare(String(b.id))
          : String(b.id).localeCompare(String(a.id)),
      );
  }, [formattedSales, filter, sortAsc]);

  const allSelected =
    filteredSales.length > 0 &&
    filteredSales.every((sale) => selectedRows.includes(sale.id));

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelectedRows(allSelected ? [] : filteredSales.map((sale) => sale.id));
  };

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

            <DialogContent
              className="sm:max-w-2xl"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <form onSubmit={handleAddSale}>
                <DialogHeader>
                  <DialogTitle>Add Sale</DialogTitle>
                  <DialogDescription>
                    Add multiple products into one customer invoice.
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

                    <div className="flex gap-2">
                      <Input
                        id="barcode"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleBarcodeLookup();
                          }
                        }}
                        placeholder="Scan or enter barcode..."
                      />

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleBarcodeLookup()}
                      >
                        Add
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={() => setShowScanner(!showScanner)}
                    >
                      {showScanner ? "Close Scanner" : "Open Scanner"}
                    </Button>

                    {showScanner && (
                      <div className="mt-3 overflow-hidden rounded-lg border">
                        <BarcodeScannerComponent
                          width={500}
                          height={300}
                          onUpdate={(err, result) => {
                            if (result) {
                              const scannedCode = result.text;
                              setBarcode(scannedCode);
                              handleBarcodeLookup(scannedCode);
                              setShowScanner(false);
                            }
                          }}
                        />
                      </div>
                    )}

                    {barcodeError && (
                      <p className="text-sm text-red-500">{barcodeError}</p>
                    )}
                  </Field>

                  {scannedProduct && (
                    <div className="rounded-lg border p-3 text-sm">
                      <p className="font-semibold">{scannedProduct.name}</p>
                      <p>SKU: {scannedProduct.sku}</p>
                      <p>Stock: {scannedProduct.quantity}</p>
                      <p>Price: GHS {scannedProduct.selling_price}</p>
                    </div>
                  )}

                  <Field>
                    <FieldLabel>Add product manually</FieldLabel>
                    <Select
                      onValueChange={(value) => {
                        const selected = products.find(
                          (product) => String(product.id) === value,
                        );

                        if (selected) {
                          setScannedProduct(selected);
                          addToCart(selected, 1);
                        }
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

                  <div className="rounded-lg border p-4">
                    <h3 className="mb-3 font-semibold">Cart Items</h3>

                    {cartItems.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No products added yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div
                            key={item.product}
                            className="grid grid-cols-12 items-center gap-2 rounded-md border p-2 text-sm"
                          >
                            <div className="col-span-5">
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-muted-foreground">
                                GHS {item.unit_price}
                              </p>
                            </div>

                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateCartQuantity(item.product, e.target.value)
                              }
                              className="col-span-2"
                            />

                            <div className="col-span-3 font-medium">
                              GHS {item.subtotal}
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="col-span-2 text-red-500"
                              onClick={() => removeCartItem(item.product)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        <div className="border-t pt-3 text-right text-lg font-bold">
                          Total: GHS {cartTotal}
                        </div>
                      </div>
                    )}
                  </div>

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

                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button type="submit">Save Sale</Button>
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

              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => setSortAsc(!sortAsc)}
                  className="px-0 font-semibold"
                >
                  Invoice
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>

              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Sold By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
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

                  <TableCell className="font-medium">#{sale.id}</TableCell>
                  <TableCell>{sale.customer_name}</TableCell>

                  <TableCell>
                    {sale.items.length > 0 ? (
                      <div className="space-y-1">
                        {sale.items.map((item) => (
                          <p key={item.id || item.product} className="text-sm">
                            {item.product_name || item.product} ×{" "}
                            {item.quantity}
                          </p>
                        ))}
                      </div>
                    ) : (
                      "No items"
                    )}
                  </TableCell>

                  <TableCell>GHS {sale.total_amount}</TableCell>
                  <TableCell>{sale.sold_by}</TableCell>
                  <TableCell>{sale.created_at}</TableCell>

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

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setSelectedInvoice(sale)}
                        >
                          View Invoice
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedInvoice(sale);
                            setTimeout(handlePrintInvoice, 300);
                          }}
                        >
                          Print Invoice
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedInvoice(sale);
                            setTimeout(handleDownloadInvoicePDF, 300);
                          }}
                        >
                          Download Invoice PDF
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
          <Invoice ref={invoiceRef} sale={selectedInvoice} />
        </div>
      </div>
    </>
  );
};

export default Sales;
