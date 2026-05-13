import React, { useEffect, useMemo, useState } from "react"
import { Folder, Pencil, Trash2, Plus } from "lucide-react"
import toast from 'react-hot-toast';
import api from "@/api/axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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

import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const fetchCategories = async () => {
    try {
      const res = await api.get("categories/")
      setCategories(res.data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
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
    fetchCategories()
    fetchProducts()
  }, [])

  const categoriesWithProductCount = useMemo(() => {
    return categories.map((category) => {
      const productCount = products.filter((product) => {
        return (
          product.category === category.id ||
          product.category_name === category.name
        )
      }).length

      return {
        ...category,
        productCount,
      }
    })
  }, [categories, products])

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()

    try {
      await api.post("categories/", formData)

      setFormData({
        name: "",
        description: "",
      })

      setOpen(false)
      fetchCategories()
      fetchProducts()
      toast.success("Categories Added Successully! ✅");
    } catch (error) {
      console.error("Failed to add category:", error.response?.data || error)
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage product categories for your inventory.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">
            <form onSubmit={handleAddCategory}>
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
                <DialogDescription>
                  Add a new product category to your inventory.
                </DialogDescription>
              </DialogHeader>

              <FieldGroup className="mt-4">
                <Field>
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. iPhones"
                    required
                  />
                </Field>

                <Field>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="e.g. All iPhone models"
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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categoriesWithProductCount.map((category) => (
          <Card
            key={category.id}
            className="rounded-3xl border shadow-sm transition hover:shadow-md"
          >
            <CardContent className="p-8">
              <div className="mb-10 flex items-start justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                  <Folder className="h-8 w-8 text-blue-600" />
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-5 w-5" />
                    <span className="sr-only">Edit category</span>
                  </Button>

                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    <span className="sr-only">Delete category</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <p className="mt-3 text-lg text-muted-foreground">
                    {category.description || "No description provided."}
                  </p>
                </div>

                <span className="inline-flex rounded-full bg-cyan-50 px-5 py-2 text-base font-semibold text-cyan-600">
                  {category.productCount} products
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categoriesWithProductCount.length === 0 && (
        <div className="rounded-2xl border p-8 text-center text-muted-foreground">
          No categories found.
        </div>
      )}
    </div>
  )
}

export default Categories