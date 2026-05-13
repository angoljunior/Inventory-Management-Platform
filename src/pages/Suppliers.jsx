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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([])

  const [filter, setFilter] = useState("")
  const [sortAsc, setSortAsc] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    status: "Active",
  })

  const [visibleColumns, setVisibleColumns] = useState({
    supplier: true,
    contact: true,
    email: true,
    phone: true,
    status: true,
  })

  // FETCH SUPPLIERS
  const fetchSuppliers = async () => {
    try {
      const response = await api.get("suppliers/")
      setSuppliers(response.data)
    } catch (error) {
      console.error("Error fetching suppliers:", error)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  // HANDLE INPUT CHANGE
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // ADD SUPPLIER
  const handleAddSupplier = async (e) => {
    e.preventDefault()

    try {
      await api.post("suppliers/", formData)

      setFormData({
        name: "",
        contact: "",
        email: "",
        phone: "",
        status: "Active",
      })

      setOpen(false)

      fetchSuppliers()
    } catch (error) {
      console.error(
        "Failed to add supplier:",
        error.response?.data || error
      )
    }
  }

  // FILTER SUPPLIERS
  const filteredSuppliers = useMemo(() => {
    return suppliers
      .filter((supplier) =>
        supplier.name?.toLowerCase().includes(filter.toLowerCase()) ||
        supplier.contact?.toLowerCase().includes(filter.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(filter.toLowerCase()) ||
        supplier.phone?.toLowerCase().includes(filter.toLowerCase()) ||
        supplier.status?.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        if (sortAsc) {
          return a.name.localeCompare(b.name)
        }

        return b.name.localeCompare(a.name)
      })
  }, [suppliers, filter, sortAsc])

  const allSelected =
    filteredSuppliers.length > 0 &&
    filteredSuppliers.every((supplier) =>
      selectedRows.includes(supplier.id)
    )

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
      setSelectedRows(
        filteredSuppliers.map((supplier) => supplier.id)
      )
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
            <h1 className="text-2xl font-bold tracking-tight">
              Suppliers
            </h1>
            <p className="text-muted-foreground">
              Manage suppliers for your inventory.
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
              <form onSubmit={handleAddSupplier}>
                <DialogHeader>
                  <DialogTitle>Add Supplier</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the new supplier.
                  </DialogDescription>
                </DialogHeader>

                <FieldGroup className="mt-4">
                  <Field>
                    <Label htmlFor="supplier-name">
                      Supplier Name
                    </Label>
                    <Input
                      id="supplier-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="supplier-contact">
                      Contact Person
                    </Label>
                    <Input
                      id="supplier-contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="supplier-email">Email</Label>
                    <Input
                      id="supplier-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="supplier-phone">Phone</Label>
                    <Input
                      id="supplier-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </Field>
                </FieldGroup>

                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button type="submit">
                    Save changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Input
            placeholder="Filter suppliers..."
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
                checked={visibleColumns.supplier}
                onCheckedChange={() =>
                  toggleColumn("supplier")
                }
              >
                Supplier
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={visibleColumns.contact}
                onCheckedChange={() =>
                  toggleColumn("contact")
                }
              >
                Contact
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={visibleColumns.email}
                onCheckedChange={() => toggleColumn("email")}
              >
                Email
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={visibleColumns.phone}
                onCheckedChange={() => toggleColumn("phone")}
              >
                Phone
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={visibleColumns.status}
                onCheckedChange={() =>
                  toggleColumn("status")
                }
              >
                Status
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Table>
          <TableCaption>
            A list of your recent suppliers.
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                />
              </TableHead>

              {visibleColumns.supplier && (
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => setSortAsc(!sortAsc)}
                    className="px-0 font-semibold"
                  >
                    Supplier
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              )}

              {visibleColumns.contact && (
                <TableHead>Contact</TableHead>
              )}

              {visibleColumns.email && (
                <TableHead>Email</TableHead>
              )}

              {visibleColumns.phone && (
                <TableHead>Phone</TableHead>
              )}

              {visibleColumns.status && (
                <TableHead>Status</TableHead>
              )}

              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(
                        supplier.id
                      )}
                      onCheckedChange={() =>
                        toggleRow(supplier.id)
                      }
                    />
                  </TableCell>

                  {visibleColumns.supplier && (
                    <TableCell className="font-medium">
                      {supplier.name}
                    </TableCell>
                  )}

                  {visibleColumns.contact && (
                    <TableCell>
                      {supplier.contact || "N/A"}
                    </TableCell>
                  )}

                  {visibleColumns.email && (
                    <TableCell>
                      {supplier.email || "N/A"}
                    </TableCell>
                  )}

                  {visibleColumns.phone && (
                    <TableCell>
                      {supplier.phone || "N/A"}
                    </TableCell>
                  )}

                  {visibleColumns.status && (
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          supplier.status === "Inactive"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {supplier.status || "Active"}
                      </span>
                    </TableCell>
                  )}

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                        >
                          <MoreHorizontalIcon />
                          <span className="sr-only">
                            Open menu
                          </span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          Duplicate
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="text-red-500">
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
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No suppliers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedRows.length} of{" "}
            {filteredSuppliers.length} row(s) selected.
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

export default Suppliers