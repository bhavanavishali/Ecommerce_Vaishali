

"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from '../../api';
import { useNavigate } from "react-router-dom";

function OrderTable() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('cartapp/orders/');
                console.log("orders data:", response.data);
                setOrders(response.data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message || "Failed to fetch orders");
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        setCurrentPage(1); // Reset to first page when filtering
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            order.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination calculations
    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredOrders.slice(startIndex, endIndex);

    // Handle page changes
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Generate page numbers for display
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    if (isLoading) return <div className="container mx-auto p-4">Loading orders...</div>;
    if (error) return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Order List</h1>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <Input 
                    placeholder="Search by Order ID or Customer..." 
                    className="flex-grow" 
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <div className="flex flex-col sm:flex-row gap-2">
                    <Select 
                        value={statusFilter}
                        onValueChange={handleStatusFilter}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Show all" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Show all</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="returned">Returned</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="font-medium">Order ID</TableHead>
                            <TableHead className="font-medium">Customer</TableHead>
                            <TableHead className="font-medium">Date</TableHead>
                            <TableHead className="font-medium">Total Amount</TableHead>
                           
                            <TableHead className="font-medium">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.length > 0 ? (
                            currentItems.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.order_number}</TableCell>
                                    <TableCell>{order.user?.first_name} {order.user?.last_name}</TableCell>
                                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>{parseFloat(order.final_total).toFixed(2)}</TableCell>
                                    
                                    <TableCell>
                                        <Button 
                                            variant="secondary" 
                                            className="bg-red-800 text-white hover:bg-red-700"
                                            onClick={() => navigate(`/admin/orderhandlepage/${order.id}`)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
                                    No orders found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} orders
                </div>
                <div className="flex items-center space-x-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    
                    {getPageNumbers().map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </Button>
                    ))}
                    
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default OrderTable;