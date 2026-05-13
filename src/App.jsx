import { Routes, Route } from "react-router-dom"
import Page from "@/app/dashboard/page"
import Products from "@/pages/Products"
import Categories from "@/pages/Categories"
import Suppliers from "@/pages/Suppliers"
import Sales from "@/pages/Sales"
import Reports from "@/pages/Reports"
import Users from "@/pages/Users"
import Settings from "@/pages/Settings"
import Dashboard from "@/pages/Dashboard"
import StockMovements from "./pages/StockMovements"
import Auth from "@/pages/Auth"
import Login from "@/pages/Login"
import PrivateRoute from "@/pages/PrivateRoute"

function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="auth" element={<Auth />} />

      <Route path="/" element={

        <PrivateRoute>
        <Page />
        </PrivateRoute>

        }>

        {/* Default route */}
        <Route index element={<Dashboard />} />

        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="stock-movements" element={<StockMovements />} />
        <Route path="sales" element={<Sales />} />
        <Route path="reports" element={<Reports />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
        
        

      </Route>

    </Routes>
  )
}

export default App