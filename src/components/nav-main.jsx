import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CirclePlusIcon, MailIcon } from "lucide-react"
import {
  LayoutDashboard,
  Package,
  Layers,
  Truck,
  ArrowUpDown,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
} from "lucide-react"

import { NavLink } from "react-router-dom"

const items = [
  { title: "Dashboard", icon: <LayoutDashboard />, path: "/" },
  { title: "Products", icon: <Package />, path: "/products" },
  { title: "Categories", icon: <Layers />, path: "/categories" },
  { title: "Suppliers", icon: <Truck />, path: "/suppliers" },
  { title: "Stock Movements", icon: <ArrowUpDown />, path: "/stock-movements" },
  { title: "Sales", icon: <ShoppingCart />, path: "/sales" },
  { title: "Reports", icon: <BarChart3 />, path: "/reports" },
  { title: "Users", icon: <Users />, path: "/users" },
  { title: "Settings", icon: <Settings />, path: "/settings" },
]

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">

        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CirclePlusIcon />
              <span>Quick Create</span>
            </SidebarMenuButton>

            <Button size="icon" className="size-8" variant="outline">
              <MailIcon />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink to={item.path}>
                {({ isActive }) => (
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

      </SidebarGroupContent>
    </SidebarGroup>
  )
}