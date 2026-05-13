# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Inventory Management System for Electronics & iPhone Shop



This is a full-stack Inventory Management and Point of Sale (POS) web application built for managing an electronics and iPhone shop. The system helps shop owners manage products, categories, suppliers, sales, stock levels, barcode scanning, receipts, and inventory operations efficiently.

The project is built using:

* React.js + Vite (Frontend)
* Django + Django REST Framework (Backend)
* Shadcn UI + Tailwind CSS (UI Components)
* Axios (API communication)

---

# Features

## Dashboard

* Inventory overview
* Stock statistics
* Recent sales
* Product analytics
* Low stock alerts

---

## Product Management

* Add products
* Edit products
* Delete products
* Product filtering
* Product search
* Product categorization
* Supplier assignment
* Product image upload
* SKU generation
* Barcode generation
* Barcode display

---

## Category Management

* Add categories
* Edit categories
* Delete categories
* View all products under categories

---

## Supplier Management

* Add suppliers
* Manage supplier information
* Supplier filtering

---

## Sales Management

* Create sales
* Generate receipts
* Download receipt PDF
* Print receipts
* Track sales history
* Automatic stock reduction
* Barcode product scanning
* Auto-fill products during sales

---

## Barcode System

* Automatic barcode generation
* Barcode image generation
* Barcode scanning
* Barcode lookup endpoint
* POS-style sales flow

---

## Receipt System

* Printable receipts
* PDF receipt downloads
* Receipt preview
* Customer purchase tracking

---

## Authentication

* Login system
* JWT authentication
* User session handling
* Role-based functionality

---

# Tech Stack

## Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Tailwind CSS
* Shadcn UI
* Lucide React Icons
* React-to-print
* jsPDF
* html2canvas
* react-qr-barcode-scanner

---

## Backend

* Django
* Django REST Framework
* Simple JWT
* Pillow
* python-barcode

---

# Project Structure

```text
inventory-system/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── app/
│   │   ├── api/
│   │   └── routes/
│
├── backend/
│   ├── invent/
│   ├── media/
│   ├── inventory_backend/
│   └── manage.py
```

---

# Database Models

## Product

* name
* category
* supplier
* barcode_number
* barcode_image
* sku
* selling_price
* quantity
* reorder_level
* image

---

## Category

* name
* description

---

## Supplier

* name
* phone
* email
* address

---

## Sales

* customer_name
* customer_phone
* product
* quantity
* total_amount
* status
* recorded_by
* created_at

---

# Backend Setup

## Clone Repository

```bash
git clone <repository-url>
```

---

## Create Virtual Environment

```bash
python -m venv inventenv
```

---

## Activate Environment

### Windows

```bash
inventenv\Scripts\activate
```

### Linux/Mac

```bash
source inventenv/bin/activate
```

---

## Install Dependencies

```bash
pip install django djangorestframework djangorestframework-simplejwt pillow python-barcode django-cors-headers
```

---

## Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Create Superuser

```bash
python manage.py createsuperuser
```

---

## Start Backend Server

```bash
python manage.py runserver
```

---

# Frontend Setup

## Install Dependencies

```bash
npm install
```

---

## Install Additional Libraries

```bash
npm install axios react-router-dom react-to-print jspdf html2canvas react-qr-barcode-scanner
```

---

## Install Shadcn Components

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add card
npx shadcn@latest add separator
npx shadcn@latest add badge
```

---

## Start Frontend

```bash
npm run dev
```

---

# API Endpoints

## Products

```text
GET     /api/products/
POST    /api/products/
GET     /api/products/<id>/
PUT     /api/products/<id>/
DELETE  /api/products/<id>/
```

---

## Barcode Lookup

```text
GET /api/products/barcode/<barcode>/
```

---

## Categories

```text
GET     /api/categories/
POST    /api/categories/
```

---

## Suppliers

```text
GET     /api/suppliers/
POST    /api/suppliers/
```

---

## Sales

```text
GET     /api/sales/
POST    /api/sales/
DELETE  /api/sales/<id>/
```

---

# Barcode Workflow

```text
1. Add Product
2. Barcode generated automatically
3. Barcode image saved
4. Barcode displayed on frontend
5. Scan barcode during sales
6. Product fetched automatically
7. Sale created
8. Stock reduced
9. Receipt generated
```

---

# Receipt Features

* Print receipt
* Download PDF receipt
* Receipt preview
* Customer tracking
* Sales records

---

# Future Improvements

* Multi-item cart system
* Thermal printer support
* WhatsApp receipt sharing
* QR code support
* Email receipts
* Analytics dashboard
* Offline POS mode
* Real barcode scanner hardware integration
* IMEI tracking
* Warranty tracking

---

# Learning Outcomes

This project demonstrates knowledge in:

* Full-stack web development
* REST API development
* Inventory management systems
* POS systems
* Barcode systems
* Authentication systems
* File/image handling
* Receipt generation
* State management
* React component architecture
* Django backend architecture

---

# Author

Nana Kofi Junior Angol

---

# License

This project is for educational and portfolio purposes.
