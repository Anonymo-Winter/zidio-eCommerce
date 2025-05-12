import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ArrowUpDown,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Eye,
    Filter,
    Search,
    Download,
    Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// Define the Payment type
export type Payment = {
    id: string;
    quantity: number;
    product: string;
    company: string;
    category: string;
    imageUrl: string;
    customer: string;
    status: "pending" | "processing" | "delivered" | "shipped" | "failed";
    price: number;
    orderDate: Date;
};

// Sample data with unique IDs
const data: Payment[] = Array(17)
    .fill(null)
    .map((_, index) => ({
        id: `order-${index + 1000}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        product: index % 3 === 0 ? "Apple iPad Pro" : index % 3 === 1 ? "MacBook Air" : "iPhone 15 Pro",
        company: "Apple",
        category: index % 3 === 0 ? "Tablets" : index % 3 === 1 ? "Laptops" : "Smartphones",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTFlhSWwrzGBZnqDlW7uLEEJWBhFc8sW_Ruw&s",
        customer: `Customer-${1000 + index}`,
        status: ["pending", "processing", "delivered", "shipped", "failed"][Math.floor(Math.random() * 5)] as any,
        price: [799, 999, 1299, 1499, 1999][Math.floor(Math.random() * 5)],
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    }));

// Status badge component
const StatusBadge = ({ status }: { status: Payment["status"] }) => {
    const statusConfig = {
        pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
        processing: { color: "bg-blue-100 text-blue-800", label: "Processing" },
        delivered: { color: "bg-green-100 text-green-800", label: "Delivered" },
        shipped: { color: "bg-indigo-100 text-indigo-800", label: "Shipped" },
        failed: { color: "bg-red-100 text-red-800", label: "Failed" },
    };

    const config = statusConfig[status];

    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
};

// Define columns
export const columns: ColumnDef<Payment>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "product",
        header: ({ column }) => (
            <div
                className="text-left font-bold flex items-center cursor-pointer"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Product
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
        ),
        cell: ({ row }) => {
            const payment = row.original;
            return (
                <div className="flex items-center gap-3">
                    <img
                        src={payment.imageUrl}
                        alt={payment.product}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                    />
                    <div className="flex flex-col">
                        <span className="font-medium">{payment.product}</span>
                        <span className="text-sm text-gray-500">{payment.company}</span>
                    </div>
                </div>
            );
        },
        enableMultiSort: true,
    },
    {
        accessorKey: "category",
        header: ({ column }) => (
            <span
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="font-medium p-0 hover:bg-transparent cursor-pointer flex items-center justify-start"
            >
                Category
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </span>
        ),
        cell: ({ row }) => <div className="text-sm">{row.getValue("category")}</div>,
    },
    {
        accessorKey: "quantity",
        header: ({ column }) => (
            <div
                className="text-left font-medium flex items-center"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Quantity
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
        ),
        cell: ({ row }) => <div className="text-center font-medium">{row.getValue("quantity")}</div>,
    },
    {
        accessorKey: "customer",
        header: () => <div className="text-left font-medium">Customer</div>,
        cell: ({ row }) => <div className="text-sm">{row.getValue("customer")}</div>,
    },
    {
        accessorKey: "status",
        header: () => <div className="text-left font-medium">Status</div>,
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <span
                className="text-left font-medium flex items-center cursor-pointer ml-5"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                <span className="text-right">Price</span>
                <ArrowUpDown className=" h-4 w-4" />
            </span>
        ),
        cell: ({ row }) => {
            const amount = row.getValue("price");
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount as number);
            return <div className="text-center font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "orderDate",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="font-medium p-0 hover:bg-transparent ml-5"
            >
                Order Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = row.getValue("orderDate") as Date;
            const formattedDate = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }).format(date);
            return <div className="text-sm ml-10">{formattedDate}</div>;
        },
    },
    {
        id: "actions",
        header: () => <div className="text-left font-medium">Actions</div>,
        cell: ({ row }) => {
            return (
                <div className="flex justify-start gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-blue-800 hover:bg-indigo-300 hover:text-indigo-600 cursor-pointer"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-red-500 hover:bg-red-100 hover:text-red-500 cursor-pointer"
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];

const DataTableDemo = () => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [statusFilter, setStatusFilter] = React.useState<string>("all");

    // Filter by status
    React.useEffect(() => {
        if (statusFilter !== "all") {
            table.getColumn("status")?.setFilterValue(statusFilter);
        } else {
            table.getColumn("status")?.setFilterValue("");
        }
    }, [statusFilter]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <Card className="w-full bg-gray-800 text-white border border-gray-500">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-white">Order Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 items-center gap-2">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-200" />
                            <Input
                                placeholder="Search products..."
                                value={(table.getColumn("product")?.getFilterValue() as string) ?? ""}
                                onChange={(event) => table.getColumn("product")?.setFilterValue(event.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex text-gray-800 bg-gray-400 border-none"
                        >
                            <Download className="mr-2 h-4 w-4 " />
                            Export
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="text-gray-800 bg-gray-400 border-0">
                                    <Filter className="mr-2 h-4 w-4" />
                                    View
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-800 text-white">
                                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id === "orderDate" ? "Order Date" : column.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="rounded-sm border border-gray-300 px-1 shadow-white">
                    <Table className="roundedn-md">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="bg-blue-600 text-white">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-gray-700 hover:text-white bg-gray-800"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length}{" "}
                        row(s) selected.
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            className="border-none text-white bg-blue-500"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm mx-2">
                            Page {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-none text-white bg-blue-500 mr-3"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Select
                            value={table.getState().pagination.pageSize.toString()}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="w-[70px] bg-gray-800">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={pageSize.toString()}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DataTableDemo;
