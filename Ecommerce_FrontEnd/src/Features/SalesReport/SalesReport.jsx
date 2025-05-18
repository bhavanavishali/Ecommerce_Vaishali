


// beeter


// import React, { useState, useEffect } from "react";
// import { Calendar } from "@/components/ui/calendar";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { DownloadIcon, FileTextIcon, CalendarIcon, ArrowUpDown, RefreshCw } from 'lucide-react';
// import { format } from "date-fns";
// import api from '../../api';
// import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

// pdfMake.vfs = pdfFonts;

// const SalesReport = () => {
//   const [dateRange, setDateRange] = useState({
//     from: null,
//     to: null,
//   });
//   const [filterType, setFilterType] = useState("thisYear");
//   const [salesData, setSalesData] = useState([]);
//   const [summary, setSummary] = useState({
//     totalSales: 0,
//     totalDiscount: 0,
//     totalRefund: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const fetchSalesData = async (page = 1, fetchAll = false) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const params = {
//         filter_type: filterType,
//         page: fetchAll ? undefined : page,
//         page_size: fetchAll ? undefined : 10,
//       };
//       if (filterType === "custom" && dateRange.from && dateRange.to) {
//         params.from_date = format(dateRange.from, 'yyyy-MM-dd');
//         params.to_date = format(dateRange.to, 'yyyy-MM-dd');
//       }
//       const response = await api.get('cartapp/sales-report/', {
//         params,
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       const data = response.data.salesData || [];
//       if (!fetchAll && (!response.data.total_pages || response.data.total_pages < 1)) {
//         setError('Invalid pagination data from server');
//         setTotalPages(1);
//       } else {
//         setTotalPages(fetchAll ? 1 : response.data.total_pages || 1);
//       }
//       setSalesData(data);
//       setSummary({
//         totalSales: Number(response.data.summary?.totalSales) || 0,
//         totalDiscount: Number(response.data.summary?.totalDiscount) || 0,
//         totalRefund: Number(response.data.summary?.totalRefund) || 0,
//       });
//       setTotalRecords(response.data.total_records || data.length);
//       setCurrentPage(fetchAll ? 1 : page);
//       return data;
//     } catch (error) {
//       setError(error.response?.data?.error || 'Failed to load sales data');
//       console.error('Fetch error:', error);
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalSales = salesData.reduce((sum, row) => sum + Number(row.orderSubtotal), 0);

//   useEffect(() => {
//     fetchSalesData(1);
//   }, [filterType, dateRange.from, dateRange.to]);

//   const handleFilterTypeChange = (value) => {
//     setFilterType(value);
//     if (value !== "custom") {
//       setDateRange({ from: null, to: null });
//     }
//     setCurrentPage(1); // Reset to page 1
//   };

//   const handleFromDateChange = (date) => {
//     setDateRange((prev) => ({ ...prev, from: date }));
//   };

//   const handleToDateChange = (date) => {
//     setDateRange((prev) => ({ ...prev, to: date }));
//   };

//   const handleApplyFilter = () => {
//     if (filterType === "custom") {
//       if (!dateRange.from || !dateRange.to) {
//         setError('Please select both from and to dates');
//         return;
//       }
//       if (dateRange.from > dateRange.to) {
//         setError('From date must be before to date');
//         return;
//       }
//       fetchSalesData(1);
//     }
//   };

//   const handlePageChange = (page) => {
//     fetchSalesData(page);
//   };

//   const handleDownloadExcel = async () => {
//     try {
//       const allSalesData = await fetchSalesData(1, true);
//       if (!allSalesData.length) {
//         setError('No data available to download');
//         return;
//       }
//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet('Sales Report');
//       worksheet.columns = [
//         { header: 'Order ID', key: 'orderId', width: 15 },
//         { header: 'Date', key: 'date', width: 15 },
//         { header: 'User', key: 'user', width: 20 },
//         { header: 'Order MRP', key: 'orderMrp', width: 12 },
//         { header: 'Item Discount', key: 'itemDiscount', width: 12 },
//         { header: 'Item Tax', key: 'itemTax', width: 12 },
//         { header: 'Order Subtotal', key: 'orderSubtotal', width: 12 },
//         { header: 'Coupon Discount', key: 'couponDiscount', width: 12 },
//         { header: 'Shipping Charge', key: 'shippingCharge', width: 12 },
//         { header: 'Refund Amount', key: 'refund_amount', width: 12 },
//         { header: 'Total Amount', key: 'totalAmount', width: 12 },
//         { header: 'Payment Method', key: 'paymentMethod', width: 15 },
//       ];
//       allSalesData.forEach(row => {
//         worksheet.addRow({
//           orderId: row.orderId,
//           date: row.date,
//           user: row.user,
//           orderMrp: `₹ ${Number(row.orderMrp).toFixed(2)}`,
//           itemDiscount: `₹ ${Number(row.itemDiscount).toFixed(2)}`,
//           itemTax: `₹ ${Number(row.itemTax).toFixed(2)}`,
//           orderSubtotal: `₹ ${Number(row.orderSubtotal).toFixed(2)}`,
//           couponDiscount: `₹ ${Number(row.couponDiscount).toFixed(2)}`,
//           shippingCharge: `₹ ${Number(row.shippingCharge).toFixed(2)}`,
//           refund_amount: `₹ ${Number(row.refund_amount).toFixed(2)}`,
//           totalAmount: `₹ ${Number(row.totalAmount).toFixed(2)}`,
//           paymentMethod: row.paymentMethod,
//         });
//       });
//       worksheet.getRow(1).font = { bold: true };
//       worksheet.getRow(1).fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: 'FFD3D3D3' },
//       };
//       const buffer = await workbook.xlsx.writeBuffer();
//       const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       saveAs(blob, `sales_report_${filterType}.xlsx`);
//     } catch (error) {
//       console.error('Excel download error:', error);
//       setError('Failed to download Excel report');
//     }
//   };

//   const handleDownloadPDF = async () => {
//     try {
//       const allSalesData = await fetchSalesData(1, true);
//       if (!allSalesData.length) {
//         setError('No data available to download');
//         return;
//       }
//       const filterLabel = filterType === 'custom'
//         ? `Custom (${dateRange.from ? format(dateRange.from, 'dd/MM/yyyy') : ''} - ${dateRange.to ? format(dateRange.to, 'dd/MM/yyyy') : ''})`
//         : filterType.charAt(0).toUpperCase() + filterType.slice(1);

//       const documentDefinition = {
//         pageSize: 'A3',
//         pageOrientation: 'landscape',
//         pageMargins: [40, 40, 40, 40],
//         content: [
//           { text: `Vaishali Golds Sales Report - ${filterLabel}`, style: 'header' },
//           {
//             text: [
//               { text: `Total Sales: ₹ ${(Number(totalSales) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`, style: 'summary' },
//               { text: `Total Discount: ₹ ${(Number(summary.totalDiscount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`, style: 'summary' },
              
//             ],
//             margin: [0, 10, 0, 20],
//           },
//           {
//             table: {
//               headerRows: 1,
//               widths: ['*', 70, 70, 60, 60, 60, 60, 70, 70, 70, 70, 100],
//               body: [
//                 [
//                   'Order ID', 'Date', 'User', 'Order MRP', 'Item Discount', 'Item Tax',
//                   'Order Subtotal', 'Coupon Discount', 'Shipping', 'Refund Amount', 'Total Amount', 'Payment Method',
//                 ],
//                 ...allSalesData.map(row => [
//                   row.orderId || '',
//                   row.date || '',
//                   row.user || '',
//                   `₹ ${Number(row.orderMrp).toFixed(2)}`,
//                   `₹ ${Number(row.itemDiscount).toFixed(2)}`,
//                   `₹ ${Number(row.itemTax).toFixed(2)}`,
//                   `₹ ${Number(row.orderSubtotal).toFixed(2)}`,
//                   `₹ ${Number(row.couponDiscount).toFixed(2)}`,
//                   `₹ ${Number(row.shippingCharge).toFixed(2)}`,
//                   `₹ ${Number(row.refund_amount).toFixed(2)}`,
//                   `₹ ${Number(row.totalAmount).toFixed(2)}`,
//                   row.paymentMethod || '',
//                 ]),
//               ],
//             },
//             layout: 'lightHorizontalLines',
//           },
//         ],
//         styles: {
//           header: {
//             fontSize: 24,
//             bold: true,
//             margin: [0, 0, 0, 20],
//           },
//           summary: {
//             fontSize: 14,
//             bold: true,
//           },
//         },
//         defaultStyle: {
//           fontSize: 10,
//           font: 'Roboto',
//         },
//       };

//       pdfMake.createPdf(documentDefinition).download(`sales_report_${filterType}.pdf`);
//     } catch (error) {
//       console.error('PDF download error:', error);
//       setError('Failed to download PDF report');
//     }
//   };

//   const handleDownloadCSV = async () => {
//     try {
//       const allSalesData = await fetchSalesData(1, true);
//       if (!allSalesData.length) {
//         setError('No data available to download');
//         return;
//       }
//       const headers = [
//         'Order ID', 'Date', 'User', 'Order MRP', 'Item Discount', 'Item Tax',
//         'Order Subtotal', 'Coupon Discount', 'Shipping Charge', 'Refund Amount', 'Total Amount', 'Payment Method',
//       ];
//       const rows = allSalesData.map(row => [
//         row.orderId || '',
//         row.date || '',
//         row.user || '',
//         `₹ ${Number(row.orderMrp).toFixed(2)}`,
//         `₹ ${Number(row.itemDiscount).toFixed(2)}`,
//         `₹ ${Number(row.itemTax).toFixed(2)}`,
//         `₹ ${Number(row.orderSubtotal).toFixed(2)}`,
//         `₹ ${Number(row.couponDiscount).toFixed(2)}`,
//         `₹ ${Number(row.shippingCharge).toFixed(2)}`,
//         `₹ ${Number(row.refund_amount).toFixed(2)}`,
//         `₹ ${Number(row.totalAmount).toFixed(2)}`,
//         row.paymentMethod || '',
//       ]);
//       const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       saveAs(blob, `sales_report_${filterType}.csv`);
//     } catch (error) {
//       console.error('CSV download error:', error);
//       setError('Failed to download CSV report');
//     }
//   };

//   const handleDownloadLog = async () => {
//     try {
//       const allSalesData = await fetchSalesData(1, true);
//       if (!allSalesData.length) {
//         setError('No data available to download');
//         return;
//       }
//       const filterLabel = filterType === 'custom'
//         ? `Custom (${dateRange.from ? format(dateRange.from, 'dd/MM/yyyy') : ''} - ${dateRange.to ? format(dateRange.to, 'dd/MM/yyyy') : ''})`
//         : filterType.charAt(0).toUpperCase() + filterType.slice(1);

//       const logContent = [
//         `Vaishali Golds Sales Report - ${filterLabel}`,
//         `Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`,
//         '',
//         `Summary:`,
//         `Total Sales: ₹ ${(Number(totalSales) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
//         `Total Discount: ₹ ${(Number(summary.totalDiscount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
//         `Total Refund: ₹ ${(Number(summary.totalRefund) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
//         '',
//         `Sales Data:`,
//         ...allSalesData.map(row =>
//           [
//             `Order ID: ${row.orderId || ''}`,
//             `Date: ${row.date || ''}`,
//             `User: ${row.user || ''}`,
//             `Order MRP: ₹ ${Number(row.orderMrp).toFixed(2)}`,
//             `Item Discount: ₹ ${Number(row.itemDiscount).toFixed(2)}`,
//             `Item Tax: ₹ ${Number(row.itemTax).toFixed(2)}`,
//             `Order Subtotal: ₹ ${Number(row.orderSubtotal).toFixed(2)}`,
//             `Coupon Discount: ₹ ${Number(row.couponDiscount).toFixed(2)}`,
//             `Shipping Charge: ₹ ${Number(row.shippingCharge).toFixed(2)}`,
//             `Refund Amount: ₹ ${Number(row.refund_amount).toFixed(2)}`,
//             `Total Amount: ₹ ${Number(row.totalAmount).toFixed(2)}`,
//             `Payment Method: ${row.paymentMethod || ''}`,
//             '---',
//           ].join('\n')
//         ),
//       ].join('\n');

//       const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8;' });
//       saveAs(blob, `sales_report_${filterType}.log`);
//     } catch (error) {
//       console.error('Log download error:', error);
//       setError('Failed to download log file');
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-6 max-w-7xl mx-auto">
//       <h1 className="text-2xl font-bold text-[#7a2828] mb-6">Sales Report</h1>

//       {error && <div className="text-red-500 mb-4">{error}</div>}

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//         <Select value={filterType} onValueChange={handleFilterTypeChange}>
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Select date range" />
//           </SelectTrigger>
//           <SelectContent className="bg-white">
//             <SelectItem value="today">Today</SelectItem>
//             <SelectItem value="thisWeek">This Week</SelectItem>
//             <SelectItem value="thisMonth">This Month</SelectItem>
//             <SelectItem value="thisYear">This Year</SelectItem>
//             <SelectItem value="custom">Custom</SelectItem>
//           </SelectContent>
//         </Select>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button
//               variant="outline"
//               className="w-full justify-start text-left font-normal"
//               disabled={filterType !== "custom"}
//             >
//               <CalendarIcon className="mr-2 h-4 w-4" />
//               {dateRange.from ? format(dateRange.from, "dd/MM/yyyy") : "From Date"}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <Calendar
//               mode="single"
//               selected={dateRange.from}
//               onSelect={handleFromDateChange}
//               initialFocus
//               className="bg-white"
//             />
//           </PopoverContent>
//         </Popover>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button
//               variant="outline"
//               className="w-full justify-start text-left font-normal"
//               disabled={filterType !== "custom"}
//             >
//               <CalendarIcon className="mr-2 h-4 w-4" />
//               {dateRange.to ? format(dateRange.to, "dd/MM/yyyy") : "To Date"}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <Calendar
//               mode="single"
//               selected={dateRange.to}
//               onSelect={handleToDateChange}
//               initialFocus
//               className="bg-white"
//             />
//           </PopoverContent>
//         </Popover>

//         <Button
//           className="bg-[#7a2828] hover:bg-[#7a2828] text-white"
//           onClick={handleApplyFilter}
//           disabled={loading || filterType !== "custom"}
//         >
//           {loading ? 'Loading...' : 'Apply Filter'}
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <Card className="overflow-hidden border-l-4 border-l-teal-700 shadow-md">
//           <CardContent className="p-6">
//             <div className="flex flex-col">
//               <span className="text-sm font-medium text-gray-500 mb-2">Total Sales</span>
//               <span className="text-3xl font-bold">₹ {(Number(totalSales) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="overflow-hidden border-l-4 border-l-red-500 shadow-md">
//           <CardContent className="p-6">
//             <div className="flex flex-col">
//               <span className="text-sm font-medium text-gray-500 mb-2">Total Discount</span>
//               <span className="text-3xl font-bold">₹ {(Number(summary.totalDiscount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="flex flex-wrap gap-4 mb-8">
//         <Button
//           variant="outline"
//           className="bg-[#7a2828] hover:bg-[#7a2828] text-white flex items-center gap-2"
//           onClick={handleDownloadExcel}
//           disabled={loading || !salesData.length}
//         >
//           <DownloadIcon className="h-4 w-4" />
//           Download Excel
//         </Button>
//         <Button
//           variant="outline"
//           className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
//           onClick={handleDownloadPDF}
//           disabled={loading || !salesData.length}
//         >
//           <FileTextIcon className="h-4 w-4" />
//           Download PDF
//         </Button>
//         <Button
//           variant="outline"
//           className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
//           onClick={handleDownloadCSV}
//           disabled={loading || !salesData.length}
//         >
//           <DownloadIcon className="h-4 w-4" />
//           Download CSV
//         </Button>
//         <Button
//           variant="outline"
//           className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
//           onClick={handleDownloadLog}
//           disabled={loading || !salesData.length}
//         >
//           <FileTextIcon className="h-4 w-4" />
//           Download Log
//         </Button>
//         <Button
//           variant="outline"
//           className="ml-auto text-gray-600 hover:text-gray-900 flex items-center gap-2"
//           onClick={() => fetchSalesData(currentPage)}
//           disabled={loading}
//         >
//           <RefreshCw className="h-4 w-4" />
//           Refresh
//         </Button>
//       </div>

//       <div className="rounded-lg border shadow overflow-hidden">
//         <Table>
//           <TableHeader className="bg-gray-50">
//             <TableRow>
//               <TableHead className="font-medium text-[#7a2828]">Order ID</TableHead>
//               <TableHead className="font-medium text-[#7a2828]">Date</TableHead>
//               <TableHead className="font-medium text-[#7a2828]">User</TableHead>
//               <TableHead className="font-medium text-[#7a2828]">
//                 <div className="flex items-center">
//                   Order MRP
//                   <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </div>
//               </TableHead>
//               <TableHead className="font-medium text-[#7a2828]">Item Discount</TableHead>
//               <TableHead className="font-medium text-[#7a2828]">Item Tax</TableHead>
//               <TableHead className="font-medium text-[#7a2828]">Order Subtotal</TableHead>
//               <TableHead className="font-medium text-[#7a2828]">Refund Amount</TableHead>
//               <TableHead className="font-medium text-[#7a2828]">Coupon Discount</TableHead>
//               <TableHead className="font-medium text-[#7a2828]">Shipping Charge</TableHead>
//               <TableHead className="font-medium text-[#7a2828]">
//                 <div className="flex items-center">
//                   Total Amount
//                   <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </div>
//               </TableHead>
//               <TableHead className="font-medium text-[#7a2828]">Payment Method</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={12} className="text-center">Loading...</TableCell>
//               </TableRow>
//             ) : salesData.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={12} className="text-center">No data available</TableCell>
//               </TableRow>
//             ) : (
//               salesData.map((row) => (
//                 <TableRow key={row.orderId} className="hover:bg-gray-50">
//                   <TableCell className="font-medium">{row.orderId}</TableCell>
//                   <TableCell>{row.date}</TableCell>
//                   <TableCell>{row.user}</TableCell>
//                   <TableCell>₹ {Number(row.orderMrp).toFixed(2)}</TableCell>
//                   <TableCell>₹ {Number(row.itemDiscount).toFixed(2)}</TableCell>
//                   <TableCell>₹ {Number(row.itemTax).toFixed(2)}</TableCell>
//                   <TableCell>₹ {Number(row.orderSubtotal).toFixed(2)}</TableCell>
//                   <TableCell>₹ {Number(row.refund_amount).toFixed(2)}</TableCell>
//                   <TableCell>₹ {Number(row.couponDiscount).toFixed(2)}</TableCell>
//                   <TableCell>₹ {Number(row.shippingCharge).toFixed(2)}</TableCell>
//                   <TableCell className="font-semibold">₹ {Number(row.totalAmount).toFixed(2)}</TableCell>
//                   <TableCell>{row.paymentMethod}</TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex items-center justify-between mt-4">
//         <div className="text-sm text-gray-500">
//           Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
//           <span className="font-medium">{Math.min(currentPage * 10, totalRecords)}</span> of{" "}
//           <span className="font-medium">{totalRecords}</span> results
//         </div>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </Button>
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <Button
//               key={page}
//               variant="outline"
//               size="sm"
//               className={page === currentPage ? "bg-teal-50" : ""}
//               onClick={() => handlePageChange(page)}
//             >
//               {page}
//             </Button>
//           ))}
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesReport;


import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DownloadIcon, FileTextIcon, CalendarIcon, ArrowUpDown, RefreshCw } from 'lucide-react';
import { format } from "date-fns";
import api from '../../api';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts;

const SalesReport = () => {
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [filterType, setFilterType] = useState("thisYear");
  const [salesData, setSalesData] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalDiscount: 0,
    totalRefund: 0,
  });
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchSalesData = async (page = 1, fetchAll = false) => {
    setLoading(!fetchAll);
    setError(null);
    try {
      const params = {
        filter_type: filterType,
      };
      if (!fetchAll) {
        params.page = page;
        params.page_size = 10;
      }
      if (filterType === "custom" && dateRange.from && dateRange.to) {
        params.from_date = format(dateRange.from, 'yyyy-MM-dd');
        params.to_date = format(dateRange.to, 'yyyy-MM-dd');
      }
      const response = await api.get('cartapp/sales-report/', {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = response.data.salesData || [];
      if (!fetchAll) {
        setSalesData(data);
        setTotalPages(response.data.total_pages || 1);
        setTotalRecords(response.data.total_records || data.length * response.data.total_pages);
        setCurrentPage(page);
      }
      setSummary({
        totalSales: Number(response.data.summary?.totalSales) || 0,
        totalDiscount: Number(response.data.summary?.totalDiscount) || 0,
        totalRefund: Number(response.data.summary?.totalRefund) || 0,
      });
      return data;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load sales data');
      console.error('Fetch error:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSalesData = async () => {
    let allData = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const data = await fetchSalesData(page, false);
      allData = [...allData, ...data];
      totalPages = totalPages;
      page += 1;
    }
    return allData;
  };

  const totalSales = salesData.reduce((sum, row) => sum + Number(row.orderSubtotal), 0);

  useEffect(() => {
    fetchSalesData(1);
  }, [filterType, dateRange.from, dateRange.to]);

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
    if (value !== "custom") {
      setDateRange({ from: null, to: null });
    }
    setCurrentPage(1);
  };

  const handleFromDateChange = (date) => {
    setDateRange((prev) => ({ ...prev, from: date }));
  };

  const handleToDateChange = (date) => {
    setDateRange((prev) => ({ ...prev, to: date }));
  };

  const handleApplyFilter = () => {
    if (filterType === "custom") {
      if (!dateRange.from || !dateRange.to) {
        setError('Please select both from and to dates');
        return;
      }
      if (dateRange.from > dateRange.to) {
        setError('From date must be before to date');
        return;
      }
      fetchSalesData(1);
    }
  };

  const handlePageChange = (page) => {
    fetchSalesData(page);
  };

  const handleDownloadExcel = async () => {
    setDownloadLoading(true);
    try {
      const allSalesData = await fetchSalesData(1, true);
      if (!allSalesData.length) {
        setError('No data available to download');
        return;
      }
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sales Report');
      worksheet.columns = [
        { header: 'Order ID', key: 'orderId', width: 15 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'User', key: 'user', width: 20 },
        { header: 'Order MRP', key: 'orderMrp', width: 12 },
        { header: 'Item Discount', key: 'itemDiscount', width: 12 },
        { header: 'Item Tax', key: 'itemTax', width: 12 },
        { header: 'Order Subtotal', key: 'orderSubtotal', width: 12 },
        { header: 'Coupon Discount', key: 'couponDiscount', width: 12 },
        { header: 'Shipping Charge', key: 'shippingCharge', width: 12 },
        { header: 'Refund Amount', key: 'refund_amount', width: 12 },
        { header: 'Total Amount', key: 'totalAmount', width: 12 },
        { header: 'Payment Method', key: 'paymentMethod', width: 15 },
      ];
      allSalesData.forEach(row => {
        worksheet.addRow({
          orderId: row.orderId,
          date: row.date,
          user: row.user,
          orderMrp: `₹ ${Number(row.orderMrp).toFixed(2)}`,
          itemDiscount: `₹ ${Number(row.itemDiscount).toFixed(2)}`,
          itemTax: `₹ ${Number(row.itemTax).toFixed(2)}`,
          orderSubtotal: `₹ ${Number(row.orderSubtotal).toFixed(2)}`,
          couponDiscount: `₹ ${Number(row.couponDiscount).toFixed(2)}`,
          shippingCharge: `₹ ${Number(row.shippingCharge).toFixed(2)}`,
          refund_amount: `₹ ${Number(row.refund_amount).toFixed(2)}`,
          totalAmount: `₹ ${Number(row.totalAmount).toFixed(2)}`,
          paymentMethod: row.paymentMethod,
        });
      });
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' },
      };
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `sales_report_${filterType}.xlsx`);
    } catch (error) {
      console.error('Excel download error:', error);
      setError('Failed to download Excel report');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloadLoading(true);
    try {
      const allSalesData = await fetchSalesData(1, true);
      if (!allSalesData.length) {
        setError('No data available to download');
        return;
      }
      const filterLabel = filterType === 'custom'
        ? `Custom (${dateRange.from ? format(dateRange.from, 'dd/MM/yyyy') : ''} - ${dateRange.to ? format(dateRange.to, 'dd/MM/yyyy') : ''})`
        : filterType.charAt(0).toUpperCase() + filterType.slice(1);

      const documentDefinition = {
        pageSize: 'A3',
        pageOrientation: 'landscape',
        pageMargins: [40, 40, 40, 40],
        content: [
          { text: `Vaishali Golds Sales Report - ${filterLabel}`, style: 'header' },
          {
            text: [
              { text: `Total Sales: ₹ ${(Number(totalSales) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`, style: 'summary' },
              { text: `Total Discount: ₹ ${(Number(summary.totalDiscount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`, style: 'summary' },
              { text: `Total Refund: ₹ ${(Number(summary.totalRefund) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`, style: 'summary' },
            ],
            margin: [0, 10, 0, 20],
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', 100, 150, 80, 80, 80, 80, 80, 80, 80, 80, 100],
              body: [
                [
                  'Order ID', 'Date', 'User', 'Order MRP', 'Item Discount', 'Item Tax',
                  'Order Subtotal', 'Coupon Discount', 'Shipping', 'Refund Amount', 'Total Amount', 'Payment Method',
                ],
                ...allSalesData.map(row => [
                  row.orderId || '',
                  row.date || '',
                  row.user || '',
                  `₹ ${Number(row.orderMrp).toFixed(2)}`,
                  `₹ ${Number(row.itemDiscount).toFixed(2)}`,
                  `₹ ${Number(row.itemTax).toFixed(2)}`,
                  `₹ ${Number(row.orderSubtotal).toFixed(2)}`,
                  `₹ ${Number(row.couponDiscount).toFixed(2)}`,
                  `₹ ${Number(row.shippingCharge).toFixed(2)}`,
                  `₹ ${Number(row.refund_amount).toFixed(2)}`,
                  `₹ ${Number(row.totalAmount).toFixed(2)}`,
                  row.paymentMethod || '',
                ]),
              ],
            },
            layout: 'lightHorizontalLines',
          },
        ],
        styles: {
          header: {
            fontSize: 24,
            bold: true,
            margin: [0, 0, 0, 20],
          },
          summary: {
            fontSize: 14,
            bold: true,
          },
        },
        defaultStyle: {
          fontSize: 10,
          font: 'Roboto',
        },
      };

      pdfMake.createPdf(documentDefinition).download(`sales_report_${filterType}.pdf`);
    } catch (error) {
      console.error('PDF download error:', error);
      setError('Failed to download PDF report');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    setDownloadLoading(true);
    try {
      const allSalesData = await fetchSalesData(1, true);
      if (!allSalesData.length) {
        setError('No data available to download');
        return;
      }
      const headers = [
        'Order ID', 'Date', 'User', 'Order MRP', 'Item Discount', 'Item Tax',
        'Order Subtotal', 'Coupon Discount', 'Shipping Charge', 'Refund Amount', 'Total Amount', 'Payment Method',
      ];
      const rows = allSalesData.map(row => [
        row.orderId || '',
        row.date || '',
        row.user || '',
        `₹ ${Number(row.orderMrp).toFixed(2)}`,
        `₹ ${Number(row.itemDiscount).toFixed(2)}`,
        `₹ ${Number(row.itemTax).toFixed(2)}`,
        `₹ ${Number(row.orderSubtotal).toFixed(2)}`,
        `₹ ${Number(row.couponDiscount).toFixed(2)}`,
        `₹ ${Number(row.shippingCharge).toFixed(2)}`,
        `₹ ${Number(row.refund_amount).toFixed(2)}`,
        `₹ ${Number(row.totalAmount).toFixed(2)}`,
        row.paymentMethod || '',
      ]);
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `sales_report_${filterType}.csv`);
    } catch (error) {
      console.error('CSV download error:', error);
      setError('Failed to download CSV report');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleDownloadLog = async () => {
    setDownloadLoading(true);
    try {
      const allSalesData = await fetchSalesData(1, true);
      if (!allSalesData.length) {
        setError('No data available to download');
        return;
      }
      const filterLabel = filterType === 'custom'
        ? `Custom (${dateRange.from ? format(dateRange.from, 'dd/MM/yyyy') : ''} - ${dateRange.to ? format(dateRange.to, 'dd/MM/yyyy') : ''})`
        : filterType.charAt(0).toUpperCase() + filterType.slice(1);

      const logContent = [
        `Vaishali Golds Sales Report - ${filterLabel}`,
        `Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`,
        '',
        `Summary:`,
        `Total Sales: ₹ ${(Number(totalSales) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        `Total Discount: ₹ ${(Number(summary.totalDiscount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        `Total Refund: ₹ ${(Number(summary.totalRefund) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        '',
        `Sales Data:`,
        ...allSalesData.map(row =>
          [
            `Order ID: ${row.orderId || ''}`,
            `Date: ${row.date || ''}`,
            `User: ${row.user || ''}`,
            `Order MRP: ₹ ${Number(row.orderMrp).toFixed(2)}`,
            `Item Discount: ₹ ${Number(row.itemDiscount).toFixed(2)}`,
            `Item Tax: ₹ ${Number(row.itemTax).toFixed(2)}`,
            `Order Subtotal: ₹ ${Number(row.orderSubtotal).toFixed(2)}`,
            `Coupon Discount: ₹ ${Number(row.couponDiscount).toFixed(2)}`,
            `Shipping Charge: ₹ ${Number(row.shippingCharge).toFixed(2)}`,
            `Refund Amount: ₹ ${Number(row.refund_amount).toFixed(2)}`,
            `Total Amount: ₹ ${Number(row.totalAmount).toFixed(2)}`,
            `Payment Method: ${row.paymentMethod || ''}`,
            '---',
          ].join('\n')
        ),
      ].join('\n');

      const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8;' });
      saveAs(blob, `sales_report_${filterType}.log`);
    } catch (error) {
      console.error('Log download error:', error);
      setError('Failed to download log file');
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-[#7a2828] mb-6">Sales Report</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Select value={filterType} onValueChange={handleFilterTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="thisWeek">This Week</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="thisYear">This Year</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              disabled={filterType !== "custom"}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? format(dateRange.from, "dd/MM/yyyy") : "From Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange.from}
              onSelect={handleFromDateChange}
 columnas
              initialFocus
              className="bg-white"
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              disabled={filterType !== "custom"}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.to ? format(dateRange.to, "dd/MM/yyyy") : "To Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange.to}
              onSelect={handleToDateChange}
              initialFocus
              className="bg-white"
            />
          </PopoverContent>
        </Popover>

        <Button
          className="bg-[#7a2828] hover:bg-[#7a2828] text-white"
          onClick={handleApplyFilter}
          disabled={loading || downloadLoading || filterType !== "custom"}
        >
          {loading || downloadLoading ? 'Loading...' : 'Apply Filter'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="overflow-hidden border-l-4 border-l-teal-700 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 mb-2">Total Sales</span>
              <span className="text-3xl font-bold">₹ {(Number(totalSales) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-red-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 mb-2">Total Discount</span>
              <span className="text-3xl font-bold">₹ {(Number(summary.totalDiscount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <Button
          variant="outline"
          className="bg-[#7a2828] hover:bg-[#7a2828] text-white flex items-center gap-2"
          onClick={handleDownloadExcel}
          disabled={loading || downloadLoading || !salesData.length}
        >
          <DownloadIcon className="h-4 w-4" />
          {downloadLoading ? 'Generating...' : 'Download Excel'}
        </Button>
        <Button
          variant="outline"
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          onClick={handleDownloadPDF}
          disabled={loading || downloadLoading || !salesData.length}
        >
          <FileTextIcon className="h-4 w-4" />
          {downloadLoading ? 'Generating...' : 'Download PDF'}
        </Button>
        <Button
          variant="outline"
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          onClick={handleDownloadCSV}
          disabled={loading || downloadLoading || !salesData.length}
        >
          <DownloadIcon className="h-4 w-4" />
          {downloadLoading ? 'Generating...' : 'Download CSV'}
        </Button>
        <Button
          variant="outline"
          className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
          onClick={handleDownloadLog}
          disabled={loading || downloadLoading || !salesData.length}
        >
          <FileTextIcon className="h-4 w-4" />
          {downloadLoading ? 'Generating...' : 'Download Log'}
        </Button>
        <Button
          variant="outline"
          className="ml-auto text-gray-600 hover:text-gray-900 flex items-center gap-2"
          onClick={() => fetchSalesData(currentPage)}
          disabled={loading || downloadLoading}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="rounded-lg border shadow overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-medium text-[#7a2828]">Order ID</TableHead>
              <TableHead className="font-medium text-[#7a2828]">Date</TableHead>
              <TableHead className="font-medium text-[#7a2828]">User</TableHead>
              <TableHead className="font-medium text-[#7a2828]">
                <div className="flex items-center">
                  Order MRP
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="font-medium text-[#7a2828]">Item Discount</TableHead>
              <TableHead className="font-medium text-[#7a2828]">Item Tax</TableHead>
              <TableHead className="font-medium text-[#7a2828]">Order Subtotal</TableHead>
              <TableHead className="font-medium text-[#7a2828]">Refund Amount</TableHead>
              <TableHead className="font-medium text-[#7a2828]">Coupon Discount</TableHead>
              <TableHead className="font-medium text-[#7a2828]">Shipping Charge</TableHead>
              <TableHead className="font-medium text-[#7a2828]">
                <div className="flex items-center">
                  Total Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="font-medium text-[#7a2828]">Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : salesData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center">No data available</TableCell>
              </TableRow>
            ) : (
              salesData.map((row) => (
                <TableRow key={row.orderId} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{row.orderId}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.user}</TableCell>
                  <TableCell>₹ {Number(row.orderMrp).toFixed(2)}</TableCell>
                  <TableCell>₹ {Number(row.itemDiscount).toFixed(2)}</TableCell>
                  <TableCell>₹ {Number(row.itemTax).toFixed(2)}</TableCell>
                  <TableCell>₹ {Number(row.orderSubtotal).toFixed(2)}</TableCell>
                  <TableCell>₹ {Number(row.refund_amount).toFixed(2)}</TableCell>
                  <TableCell>₹ {Number(row.couponDiscount).toFixed(2)}</TableCell>
                  <TableCell>₹ {Number(row.shippingCharge).toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">₹ {Number(row.totalAmount).toFixed(2)}</TableCell>
                  <TableCell>{row.paymentMethod}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
          <span className="font-medium">{Math.min(currentPage * 10, totalRecords)}</span> of{" "}
          <span className="font-medium">{totalRecords}</span> results
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading || downloadLoading}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant="outline"
              size="sm"
              className={page === currentPage ? "bg-teal-50" : ""}
              onClick={() => handlePageChange(page)}
              disabled={loading || downloadLoading}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading || downloadLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;