// "use client";

// import { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import api from '../../api'



// function OrderTable() {
//     const [orders, setOrders] = useState([])
//     const [isLoading, setIsLoading] = useState(true)
//     const [error, setError] = useState(null)
//     const [searchTerm, setSearchTerm] = useState("")

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         setIsLoading(true)
        
        
//         const response = await api.get('cartapp/orders/')
        
//         console.log(" it orders ",response.data)
//         setOrders(response.data)
//         setIsLoading(false)
//       } catch (err) {
//         setError(err.message || "Failed to fetch users")
//         setIsLoading(false)
//       }
//     }

//     fetchOrders()
//   }, [])

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Order List</h1>

//       <div className="flex flex-col sm:flex-row gap-2 mb-4">
//         <Input placeholder="Search by Order ID or Customer..." className="flex-grow" />
//         <div className="flex flex-col sm:flex-row gap-2">
//           <Select defaultValue="all">
//             <SelectTrigger className="w-[150px]">
//               <SelectValue placeholder="Show all" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">Show all</SelectItem>
//               <SelectItem value="confirmed">Confirmed</SelectItem>
//               <SelectItem value="processing">Processing</SelectItem>
//               <SelectItem value="shipped">Shipped</SelectItem>
//               <SelectItem value="delivered">Delivered</SelectItem>
//               <SelectItem value="returned">Returned</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select defaultValue="10">
//             <SelectTrigger className="w-[150px]">
//               <SelectValue placeholder="10 per page" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="10">10 per page</SelectItem>
//               <SelectItem value="20">20 per page</SelectItem>
//               <SelectItem value="50">50 per page</SelectItem>
//               <SelectItem value="100">100 per page</SelectItem>
//             </SelectContent>
//           </Select>

//           <Button className="bg-red-800 text-white hover:bg-red-700">Apply Filters</Button>
//         </div>
//       </div>

//       <div className="border rounded-lg overflow-hidden">
//         <Table>
//           <TableHeader className="bg-gray-50">
//             <TableRow>
//               <TableHead className="font-medium">Order ID</TableHead>
//               <TableHead className="font-medium">Customer</TableHead>
//               <TableHead className="font-medium">Date</TableHead>
//               <TableHead className="font-medium">Total Amount</TableHead>
//               <TableHead className="font-medium">Status</TableHead>
//               <TableHead className="font-medium">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {orders.map((order) => (
//               <TableRow key={order.id}>
//                 <TableCell>{order.items.order_number}</TableCell>
//                 <TableCell>{order.user.first_name}</TableCell>
//                 <TableCell>{order.created_at}</TableCell>
//                 <TableCell>{order.final_total}</TableCell>
//                 <TableCell>
//                   <span className={`${order.items.status === "Return Approved" ? "text-amber-700" : "text-emerald-700"}`}>
//                     {order.items.status}
//                   </span>
//                 </TableCell>
//                 <TableCell>
//                   <Button variant="secondary" className="rounded-full px-3 py-1 bg-red-100 text-red-800 border-red-200">
//                     View Details
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }

// export default OrderTable



// "use client";

// import { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import api from '../../api';
// import { useNavigate } from "react-router-dom";

// function OrderTable() {
//     const [orders, setOrders] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [statusFilter, setStatusFilter] = useState("all");
//     const [itemsPerPage, setItemsPerPage] = useState("10");
//     const navigate= useNavigate()
//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 setIsLoading(true);
//                 const response = await api.get('cartapp/orders/');
//                 console.log("orders data:", response.data);
//                 setOrders(response.data);
//                 setIsLoading(false);
//             } catch (err) {
//                 setError(err.message || "Failed to fetch orders");
//                 setIsLoading(false);
//             }
//         };

//         fetchOrders();
//     }, []);

//     const handleSearch = (e) => {
//         setSearchTerm(e.target.value);
//     };

//     const filteredOrders = orders.filter(order => {
        
//         const matchesSearch = order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                              order.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        
//         const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        
//         return matchesSearch && matchesStatus;
//     });

//     if (isLoading) return <div className="container mx-auto p-4">Loading orders...</div>;
//     if (error) return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-4">Order List</h1>

//             <div className="flex flex-col sm:flex-row gap-2 mb-4">
//                 <Input 
//                     placeholder="Search by Order ID or Customer..." 
//                     className="flex-grow" 
//                     value={searchTerm}
//                     onChange={handleSearch}
//                 />
//                 <div className="flex flex-col sm:flex-row gap-2">
//                     <Select 
//                         defaultValue="all"
//                         onValueChange={(value) => setStatusFilter(value)}
//                     >
//                         <SelectTrigger className="w-[150px]">
//                             <SelectValue placeholder="Show all" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="all">Show all</SelectItem>
//                             <SelectItem value="pending">Pending</SelectItem>
//                             <SelectItem value="confirmed">Confirmed</SelectItem>
//                             <SelectItem value="cancelled">Cancelled</SelectItem>
//                             <SelectItem value="shipped">Shipped</SelectItem>
//                             <SelectItem value="delivered">Delivered</SelectItem>
//                             <SelectItem value="returned">Returned</SelectItem>
//                         </SelectContent>
//                     </Select>

                    
//                 </div>
//             </div>

//             <div className="border rounded-lg overflow-hidden">
//                 <Table>
//                     <TableHeader className="bg-gray-50">
//                         <TableRow>
//                             <TableHead className="font-medium">Order ID</TableHead>
//                             <TableHead className="font-medium">Customer</TableHead>
//                             <TableHead className="font-medium">Date</TableHead>
//                             <TableHead className="font-medium">Total Amount</TableHead>
//                             <TableHead className="font-medium">Status</TableHead>
//                             <TableHead className="font-medium">Actions</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {filteredOrders.length > 0 ? (
//                             filteredOrders.map((order) => (
//                                 <TableRow key={order.id}>
//                                     <TableCell>{order.order_number}</TableCell>
//                                     <TableCell>{order.user?.first_name} {order.user?.last_name}</TableCell>
//                                     <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
//                                     <TableCell>{parseFloat(order.final_total).toFixed(2)}</TableCell>
//                                     <TableCell>
//                                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                             order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
//                                             order.status === "confirmed" ? "bg-blue-100 text-blue-800" :
//                                             order.status === "processing" ? "bg-purple-100 text-purple-800" :
//                                             order.status === "shipped" ? "bg-indigo-100 text-indigo-800" :
//                                             order.status === "delivered" ? "bg-green-100 text-green-800" :
//                                             "bg-red-100 text-red-800"
//                                         }`}>
//                                             {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                                         </span>
//                                     </TableCell>
//                                     <TableCell>
//                                         <Button variant="secondary" className="bg-red-800 text-white hover:bg-red-700"
//                                         onClick={()=>navigate(`/admin/orderhandlepage/${order.id}`)}>
                                            
//                                             View Details
//                                         </Button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell colSpan={6} className="text-center py-4">
//                                     No orders found
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </div>

//             {/* Pagination placeholder - you can implement this later */}
//             <div className="flex justify-end mt-4">
//                 <div className="flex items-center space-x-2">
//                     <Button variant="outline" size="sm" disabled>Previous</Button>
//                     <span className="text-sm">Page 1 of 1</span>
//                     <Button variant="outline" size="sm" disabled>Next</Button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default OrderTable;

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
        setCurrentPage(1); // Reset to first page when searching
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
                            <TableHead className="font-medium">Status</TableHead>
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
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                            order.status === "confirmed" ? "bg-blue-100 text-blue-800" :
                                            order.status === "processing" ? "bg-purple-100 text-purple-800" :
                                            order.status === "shipped" ? "bg-indigo-100 text-indigo-800" :
                                            order.status === "delivered" ? "bg-green-100 text-green-800" :
                                            "bg-red-100 text-red-800"
                                        }`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </TableCell>
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