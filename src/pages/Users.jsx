import React, { useEffect, useMemo, useState } from "react";
import api from "@/api/axios"
import { ChevronDown, MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
 

  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    email: true,
  });

  // FETCH USERS FROM BACKEND
  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("Access token:", token);

      if (!token) {
        console.log("No access token found. Please login again.");
        return;
      }

      const response = await api.get("users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("Backend response:", error.response?.data);
      console.error("Error fetching users:", error);
    }
  };

  fetchUsers();
}, []);

  const filteredData = useMemo(() => {
    return users
      .filter((user) =>
        user.email.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        if (sortAsc) {
          return a.email.localeCompare(b.email);
        }
        return b.email.localeCompare(a.email);
      });
  }, [users, filter, sortAsc]);

  const allSelected =
    filteredData.length > 0 &&
    filteredData.every((item) => selectedRows.includes(item.id));

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((item) => item.id));
    }
  };

  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return (
    <div className="w-full space-y-4 rounded-2xl border bg-background p-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Filter emails..."
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
              checked={visibleColumns.name}
              onCheckedChange={() => toggleColumn("name")}
            >
              Name
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              checked={visibleColumns.email}
              onCheckedChange={() => toggleColumn("email")}
            >
              Email
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              </TableHead>

              {visibleColumns.name && <TableHead>Name</TableHead>}

              {visibleColumns.email && (
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => setSortAsc(!sortAsc)}
                    className="px-0 font-semibold"
                  >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              )}

              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(user.id)}
                      onCheckedChange={() => toggleRow(user.id)}
                    />
                  </TableCell>

                  {visibleColumns.name && (
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                  )}

                  {visibleColumns.email && (
                    <TableCell>{user.email}</TableCell>
                  )}

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          View details
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          Copy email
                        </DropdownMenuItem>

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
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedRows.length} of {filteredData.length} row(s) selected.
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
  );
}