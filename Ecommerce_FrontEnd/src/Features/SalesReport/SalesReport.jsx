

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
//   const [dateRange, setDateRange] = useState({ from: null, to: null });
//   const [filterType, setFilterType] = useState("thisYear");
//   const [salesData, setSalesData] = useState([]);
//   const [summary, setSummary] = useState({
//     totalSales: 0,
//     totalDiscount: 0,
//     totalRefund: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const [downloadLoading, setDownloadLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const fetchSalesData = async (page = 1, fetchAll = false) => {
//     setLoading(!fetchAll);
//     setError(null);
//     try {
//       const params = {
//         filter_type: filterType,
//       };
//       if (!fetchAll) {
//         params.page = page;
//         params.page_size = 10;
//       }
//       if (filterType === "custom" && dateRange.from && dateRange.to) {
//         params.from_date = format(dateRange.from, 'yyyy-MM-dd');
//         params.to_date = format(dateRange.to, 'yyyy-MM-dd');
//       }
//       const response = await api.get('cartapp/sales-report/', {
//         params,
//       });
//       const data = response.data.salesData || [];
//       if (!fetchAll) {
//         setSalesData(data);
//         setTotalPages(response.data.total_pages || 1);
//         setTotalRecords(response.data.total_records || data.length * response.data.total_pages);
//         setCurrentPage(page);
//       }
//       setSummary({
//         totalSales: Number(response.data.summary?.totalSales) || 0,
//         totalDiscount: Number(response.data.summary?.totalDiscount) || 0,
//         totalRefund: Number(response.data.summary?.totalRefund) || 0,
//       });
//       return { data, totalPages: response.data.total_pages || 1 };
//     } catch (error) {
//       setError(error.response?.data?.error || 'Failed to load sales data');
//       console.error('Fetch error:', error);
//       return { data: [], totalPages: 1 };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllSalesData = async () => {
//     let allData = [];
//     let page = 1;
//     let totalPages = 1;

//     while (page <= totalPages) {
//       const { data, totalPages: fetchedTotalPages } = await fetchSalesData(page, true);
//       allData = [...allData, ...data];
//       totalPages = fetchedTotalPages;
//       page += 1;
//     }
//     return allData;
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
//     setCurrentPage(1);
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
//     setDownloadLoading(true);
//     try {
//       const allSalesData = await fetchAllSalesData();
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
//     } finally {
//       setDownloadLoading(false);
//     }
//   };

//   const handleDownloadPDF = async () => {
//     setDownloadLoading(true);
//     try {
//       const allSalesData = await fetchAllSalesData();
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
//               { text: `Total Refund: ₹ ${(Number(summary.totalRefund) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`, style: 'summary' },
//             ],
//             margin: [0, 10, 0, 20],
//           },
//           {
//             table: {
//               headerRows: 1,
//               widths: ['*', 100, 150, 80, 80, 80, 80, 80, 80, 80, 80, 100],
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
//     } finally {
//       setDownloadLoading(false);
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
//           disabled={loading || downloadLoading || filterType !== "custom"}
//         >
//           {loading || downloadLoading ? 'Loading...' : 'Apply Filter'}
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
//           disabled={loading || downloadLoading || !salesData.length}
//         >
//           <DownloadIcon className="h-4 w-4" />
//           {downloadLoading ? 'Generating...' : 'Download Excel'}
//         </Button>
//         <Button
//           variant="outline"
//           className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
//           onClick={handleDownloadPDF}
//           disabled={loading || downloadLoading || !salesData.length}
//         >
//           <FileTextIcon className="h-4 w-4" />
//           {downloadLoading ? 'Generating...' : 'Download PDF'}
//         </Button>
     
//         <Button
//           variant="outline"
//           className="ml-auto text-gray-600 hover:text-gray-900 flex items-center gap-2"
//           onClick={() => fetchSalesData(currentPage)}
//           disabled={loading || downloadLoading}
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
//             disabled={currentPage === 1 || loading || downloadLoading}
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
//               disabled={loading || downloadLoading}
//             >
//               {page}
//             </Button>
//           ))}
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages || loading || downloadLoading}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesReport;

  
// ************* not bad 

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
//   const [dateRange, setDateRange] = useState({ from: null, to: null });
//   const [filterType, setFilterType] = useState("thisYear");
//   const [salesData, setSalesData] = useState([]);
//   const [summary, setSummary] = useState({
//     totalSales: 0,
//     totalDiscount: 0,
//     totalRefund: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const [downloadLoading, setDownloadLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const fetchSalesData = async (page = 1, fetchAll = false) => {
//     setLoading(!fetchAll);
//     setError(null);
//     try {
//       const params = {
//         filter_type: filterType,
//       };
//       if (!fetchAll) {
//         params.page = page;
//         params.page_size = 10;
//       }
//       if (filterType === "custom" && dateRange.from && dateRange.to) {
//         params.from_date = format(dateRange.from, 'yyyy-MM-dd');
//         params.to_date = format(dateRange.to, 'yyyy-MM-dd');
//       }
//       const response = await api.get('cartapp/sales-report/', {
//         params,
//       });
//       const data = response.data.salesData || [];
//       if (!fetchAll) {
//         setSalesData(data);
//         setTotalPages(response.data.total_pages || 1);
//         setTotalRecords(response.data.total_records || data.length * response.data.total_pages);
//         setCurrentPage(page);
//       }
//       setSummary({
//         totalSales: Number(response.data.summary?.totalSales) || 0,
//         totalDiscount: Number(response.data.summary?.totalDiscount) || 0,
//         totalRefund: Number(response.data.summary?.totalRefund) || 0,
//       });
//       return { data, totalPages: response.data.total_pages || 1 };
//     } catch (error) {
//       setError(error.response?.data?.error || 'Failed to load sales data');
//       console.error('Fetch error:', error);
//       return { data: [], totalPages: 1 };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllSalesData = async () => {
//     let allData = [];
//     let page = 1;
//     let totalPages = 1;

//     while (page <= totalPages) {
//       const { data, totalPages: fetchedTotalPages } = await fetchSalesData(page, true);
//       allData = [...allData, ...data];
//       totalPages = fetchedTotalPages;
//       page += 1;
//     }
//     return allData;
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
//     setCurrentPage(1);
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
//     setDownloadLoading(true);
//     try {
//       const allSalesData = await fetchAllSalesData();
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
//     } finally {
//       setDownloadLoading(false);
//     }
//   };

//   const handleDownloadPDF = async () => {
//     setDownloadLoading(true);
//     try {
//       const allSalesData = await fetchAllSalesData();
//       if (!allSalesData.length) {
//         setError('No data available to download');
//         return;
//       }

//       // Format the date range for the header similar to the reference report
//       const filterLabel = filterType === 'custom'
//         ? `${dateRange.from ? format(dateRange.from, 'EEEE, MMMM d, yyyy') : ''} thru ${dateRange.to ? format(dateRange.to, 'EEEE, MMMM d, yyyy') : ''}`
//         : filterType.charAt(0).toUpperCase() + filterType.slice(1);

//       // Calculate totals for the footer
//       const totalOrderMrp = allSalesData.reduce((sum, row) => sum + Number(row.orderMrp), 0);
//       const totalItemDiscount = allSalesData.reduce((sum, row) => sum + Number(row.itemDiscount), 0);
//       const totalItemTax = allSalesData.reduce((sum, row) => sum + Number(row.itemTax), 0);
//       const totalOrderSubtotal = allSalesData.reduce((sum, row) => sum + Number(row.orderSubtotal), 0);
//       const totalCouponDiscount = allSalesData.reduce((sum, row) => sum + Number(row.couponDiscount), 0);
//       const totalShippingCharge = allSalesData.reduce((sum, row) => sum + Number(row.shippingCharge), 0);
//       const totalRefundAmount = allSalesData.reduce((sum, row) => sum + Number(row.refund_amount), 0);
//       const totalAmount = allSalesData.reduce((sum, row) => sum + Number(row.totalAmount), 0);

//       const documentDefinition = {
//         pageSize: 'A3',
//         pageOrientation: 'landscape',
//         pageMargins: [40, 40, 40, 40],
//         content: [
//           { 
//             text: `Vaishali Golds Theoretical Cost of Sales Report\n${filterLabel}`, 
//             style: 'header',
//             alignment: 'center'
//           },
//           {
//             table: {
//               headerRows: 1,
//               widths: ['*', 100, 150, 80, 80, 80, 80, 80, 80, 80, 80, 100],
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
//                 [
//                   { text: 'Consolidated Total', style: 'footerHeader', colSpan: 3 }, '', '',
//                   `₹ ${totalOrderMrp.toFixed(2)}`,
//                   `₹ ${totalItemDiscount.toFixed(2)}`,
//                   `₹ ${totalItemTax.toFixed(2)}`,
//                   `₹ ${totalOrderSubtotal.toFixed(2)}`,
//                   `₹ ${totalCouponDiscount.toFixed(2)}`,
//                   `₹ ${totalShippingCharge.toFixed(2)}`,
//                   `₹ ${totalRefundAmount.toFixed(2)}`,
//                   `₹ ${totalAmount.toFixed(2)}`,
//                   ''
//                 ]
//               ],
//             },
//             layout: 'lightHorizontalLines',
//             margin: [0, 20, 0, 0]
//           },
//         ],
//         footer: (currentPage, pageCount) => {
//           return {
//             columns: [
//               { text: `${format(new Date(), 'M/d/yyyy h:mm:ss a')}`, alignment: 'left', margin: [40, 10, 0, 0] },
//               { text: `Page ${currentPage} of ${pageCount}`, alignment: 'right', margin: [0, 10, 40, 0] }
//             ]
//           };
//         },
//         styles: {
//           header: {
//             fontSize: 18,
//             bold: true,
//             margin: [0, 0, 0, 20],
//           },
//           footerHeader: {
//             fontSize: 12,
//             bold: true,
//           }
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
//     } finally {
//       setDownloadLoading(false);
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
//           disabled={loading || downloadLoading || filterType !== "custom"}
//         >
//           {loading || downloadLoading ? 'Loading...' : 'Apply Filter'}
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
//           disabled={loading || downloadLoading || !salesData.length}
//         >
//           <DownloadIcon className="h-4 w-4" />
//           {downloadLoading ? 'Generating...' : 'Download Excel'}
//         </Button>
//         <Button
//           variant="outline"
//           className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
//           onClick={handleDownloadPDF}
//           disabled={loading || downloadLoading || !salesData.length}
//         >
//           <FileTextIcon className="h-4 w-4" />
//           {downloadLoading ? 'Generating...' : 'Download PDF'}
//         </Button>
     
//         <Button
//           variant="outline"
//           className="ml-auto text-gray-600 hover:text-gray-900 flex items-center gap-2"
//           onClick={() => fetchSalesData(currentPage)}
//           disabled={loading || downloadLoading}
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
//             disabled={currentPage === 1 || loading || downloadLoading}
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
//               disabled={loading || downloadLoading}
//             >
//               {page}
//             </Button>
//           ))}
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages || loading || downloadLoading}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesReport;


"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DownloadIcon, FileTextIcon, CalendarIcon, ArrowUpDown, RefreshCw, Building2 } from "lucide-react"
import { format } from "date-fns"
import api from "../../api"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import Logo from "/logo 1.png"

pdfMake.vfs = pdfFonts

const SalesReport = () => {
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [filterType, setFilterType] = useState("thisYear")
  const [salesData, setSalesData] = useState([])
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalDiscount: 0,
    totalRefund: 0,
  })
  const [loading, setLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  const fetchSalesData = async (page = 1, fetchAll = false) => {
    setLoading(!fetchAll)
    setError(null)
    try {
      const params = {
        filter_type: filterType,
      }
      if (!fetchAll) {
        params.page = page
        params.page_size = 10
      }
      if (filterType === "custom" && dateRange.from && dateRange.to) {
        params.from_date = format(dateRange.from, "yyyy-MM-dd")
        params.to_date = format(dateRange.to, "yyyy-MM-dd")
      }
      const response = await api.get("cartapp/sales-report/", {
        params,
      })
      const data = response.data.salesData || []
      if (!fetchAll) {
        setSalesData(data)
        setTotalPages(response.data.total_pages || 1)
        setTotalRecords(response.data.total_records || data.length * response.data.total_pages)
        setCurrentPage(page)
      }
      setSummary({
        totalSales: Number(response.data.summary?.totalSales) || 0,
        totalDiscount: Number(response.data.summary?.totalDiscount) || 0,
        totalRefund: Number(response.data.summary?.totalRefund) || 0,
      })
      return { data, totalPages: response.data.total_pages || 1 }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to load sales data")
      console.error("Fetch error:", error)
      return { data: [], totalPages: 1 }
    } finally {
      setLoading(false)
    }
  }

  const fetchAllSalesData = async () => {
    let allData = []
    let page = 1
    let totalPages = 1

    while (page <= totalPages) {
      const { data, totalPages: fetchedTotalPages } = await fetchSalesData(page, true)
      allData = [...allData, ...data]
      totalPages = fetchedTotalPages
      page += 1
    }
    return allData
  }

  const totalSales = salesData.reduce((sum, row) => sum + Number(row.orderSubtotal), 0)

  useEffect(() => {
    fetchSalesData(1)
  }, [filterType, dateRange.from, dateRange.to])

  const handleFilterTypeChange = (value) => {
    setFilterType(value)
    if (value !== "custom") {
      setDateRange({ from: null, to: null })
    }
    setCurrentPage(1)
  }

  const handleFromDateChange = (date) => {
    setDateRange((prev) => ({ ...prev, from: date }))
  }

  const handleToDateChange = (date) => {
    setDateRange((prev) => ({ ...prev, to: date }))
  }

  const handleApplyFilter = () => {
    if (filterType === "custom") {
      if (!dateRange.from || !dateRange.to) {
        setError("Please select both from and to dates")
        return
      }
      if (dateRange.from > dateRange.to) {
        setError("From date must be before to date")
        return
      }
      fetchSalesData(1)
    }
  }

  const handlePageChange = (page) => {
    fetchSalesData(page)
  }

  const handleDownloadExcel = async () => {
    setDownloadLoading(true)
    try {
      const allSalesData = await fetchAllSalesData()
      if (!allSalesData.length) {
        setError("No data available to download")
        return
      }
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet("Sales Report")
      worksheet.columns = [
        { header: "Order ID", key: "orderId", width: 15 },
        { header: "Date", key: "date", width: 15 },
        { header: "User", key: "user", width: 20 },
        { header: "Order MRP", key: "orderMrp", width: 12 },
        { header: "Item Discount", key: "itemDiscount", width: 12 },
        { header: "Item Tax", key: "itemTax", width: 12 },
        { header: "Order Subtotal", key: "orderSubtotal", width: 12 },
        { header: "Coupon Discount", key: "couponDiscount", width: 12 },
        { header: "Shipping Charge", key: "shippingCharge", width: 12 },
        { header: "Refund Amount", key: "refund_amount", width: 12 },
        { header: "Total Amount", key: "totalAmount", width: 12 },
        { header: "Payment Method", key: "paymentMethod", width: 15 },
      ]
      allSalesData.forEach((row) => {
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
        })
      })
      worksheet.getRow(1).font = { bold: true }
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD3D3D3" },
      }
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      saveAs(blob, `sales_report_${filterType}.xlsx`)
    } catch (error) {
      console.error("Excel download error:", error)
      setError("Failed to download Excel report")
    } finally {
      setDownloadLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    setDownloadLoading(true)
    try {
      const allSalesData = await fetchAllSalesData()
      if (!allSalesData.length) {
        setError("No data available to download")
        return
      }

      // Format the date range for the header
      const filterLabel =
        filterType === "custom"
          ? `${dateRange.from ? format(dateRange.from, "EEEE, MMMM d, yyyy") : ""} thru ${dateRange.to ? format(dateRange.to, "EEEE, MMMM d, yyyy") : ""}`
          : filterType.charAt(0).toUpperCase() + filterType.slice(1)

      // Calculate totals for the footer
      const totalOrderMrp = allSalesData.reduce((sum, row) => sum + Number(row.orderMrp), 0)
      const totalItemDiscount = allSalesData.reduce((sum, row) => sum + Number(row.itemDiscount), 0)
      const totalItemTax = allSalesData.reduce((sum, row) => sum + Number(row.itemTax), 0)
      const totalOrderSubtotal = allSalesData.reduce((sum, row) => sum + Number(row.orderSubtotal), 0)
      const totalCouponDiscount = allSalesData.reduce((sum, row) => sum + Number(row.couponDiscount), 0)
      const totalShippingCharge = allSalesData.reduce((sum, row) => sum + Number(row.shippingCharge), 0)
      const totalRefundAmount = allSalesData.reduce((sum, row) => sum + Number(row.refund_amount), 0)
      const totalAmount = allSalesData.reduce((sum, row) => sum + Number(row.totalAmount), 0)

      const documentDefinition = {
        pageSize: "A3",
        pageOrientation: "landscape",
        pageMargins: [40, 60, 40, 60],
        header: {
          columns: [
            {
              // Company Logo (placeholder)
              svg: `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#7a2828" stroke="#5a1f1f" strokeWidth="3"/>
                <text x="25" y="45" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" textAnchor="middle" fill="white">VISHALI</text>
                <text x="30" y="65" fontFamily="Arial, sans-serif" fontSize="8" textAnchor="middle" fill="white">GOLDS</text>
              </svg>`,
              
              width: 60,
              margin: [40, 20, 0, 0],
            },
            {
              stack: [
                { text: "VAISHALI GOLDS", style: "companyName", alignment: "center" },
                { text: "Premium Jewelry & Ornaments", style: "companyTagline", alignment: "center" },
                { text: "Sales Performance Report", style: "reportTitle", alignment: "center" },
              ],
              margin: [0, 15, 0, 0],
            },
            {
              stack: [
                { text: format(new Date(), "MMM dd, yyyy"), style: "headerDate", alignment: "right" },
                { text: format(new Date(), "h:mm a"), style: "headerTime", alignment: "right" },
              ],
              margin: [0, 20, 40, 0],
            },
          ],
        },
        content: [
          // Report period and summary section
          {
            columns: [
              {
                width: "60%",
                stack: [
                  { text: "REPORT PERIOD", style: "sectionHeader" },
                  { text: filterLabel, style: "periodText" },
                ],
              },
              {
                width: "40%",
                table: {
                  widths: ["*", "*"],
                  body: [
                    [
                      { text: "TOTAL RECORDS", style: "summaryLabel" },
                      { text: allSalesData.length.toLocaleString(), style: "summaryValue" },
                    ],
                    [
                      { text: "TOTAL REVENUE", style: "summaryLabel" },
                      {
                        text: `₹ ${totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
                        style: "summaryValue",
                      },
                    ],
                  ],
                },
                layout: {
                  fillColor: "#f8f9fa",
                  hLineWidth: () => 1,
                  vLineWidth: () => 1,
                  hLineColor: () => "#dee2e6",
                  vLineColor: () => "#dee2e6",
                },
              },
            ],
            margin: [0, 20, 0, 30],
          },
          // Main data table
          {
            table: {
              headerRows: 1,
              widths: ["*", 70, 120, 70, 70, 70, 70, 70, 70, 70, 70, 80],
              body: [
                [
                  { text: "Order ID", style: "tableHeader" },
                  { text: "Date", style: "tableHeader" },
                  { text: "Customer", style: "tableHeader" },
                  { text: "MRP", style: "tableHeader" },
                  { text: "Item Disc.", style: "tableHeader" },
                  { text: "Tax", style: "tableHeader" },
                  { text: "Subtotal", style: "tableHeader" },
                  { text: "Coupon", style: "tableHeader" },
                  { text: "Shipping", style: "tableHeader" },
                  { text: "Refund", style: "tableHeader" },
                  { text: "Total", style: "tableHeader" },
                  { text: "Payment", style: "tableHeader" },
                ],
                ...allSalesData.map((row, index) => [
                  { text: row.orderId || "", style: index % 2 === 0 ? "tableCell" : "tableCellAlt" },
                  { text: row.date || "", style: index % 2 === 0 ? "tableCell" : "tableCellAlt" },
                  { text: row.user || "", style: index % 2 === 0 ? "tableCell" : "tableCellAlt" },
                  {
                    text: `₹ ${Number(row.orderMrp).toFixed(2)}`,
                    style: index % 2 === 0 ? "tableCellNumber" : "tableCellNumberAlt",
                  },
                  {
                    text: `₹ ${Number(row.itemDiscount).toFixed(2)}`,
                    style: index % 2 === 0 ? "tableCellNumber" : "tableCellNumberAlt",
                  },
                  {
                    text: `₹ ${Number(row.itemTax).toFixed(2)}`,
                    style: index % 2 === 0 ? "tableCellNumber" : "tableCellNumberAlt",
                  },
                  {
                    text: `₹ ${Number(row.orderSubtotal).toFixed(2)}`,
                    style: index % 2 === 0 ? "tableCellNumber" : "tableCellNumberAlt",
                  },
                  {
                    text: `₹ ${Number(row.couponDiscount).toFixed(2)}`,
                    style: index % 2 === 0 ? "tableCellNumber" : "tableCellNumberAlt",
                  },
                  {
                    text: `₹ ${Number(row.shippingCharge).toFixed(2)}`,
                    style: index % 2 === 0 ? "tableCellNumber" : "tableCellNumberAlt",
                  },
                  {
                    text: `₹ ${Number(row.refund_amount).toFixed(2)}`,
                    style: index % 2 === 0 ? "tableCellNumber" : "tableCellNumberAlt",
                  },
                  {
                    text: `₹ ${Number(row.totalAmount).toFixed(2)}`,
                    style: index % 2 === 0 ? "tableCellNumberBold" : "tableCellNumberBoldAlt",
                  },
                  { text: row.paymentMethod || "", style: index % 2 === 0 ? "tableCell" : "tableCellAlt" },
                ]),
                // Totals row
                [
                  { text: "GRAND TOTALS", style: "totalRowHeader", colSpan: 3, alignment: "center" },
                  "",
                  "",
                  { text: `₹ ${totalOrderMrp.toFixed(2)}`, style: "totalRowValue" },
                  { text: `₹ ${totalItemDiscount.toFixed(2)}`, style: "totalRowValue" },
                  { text: `₹ ${totalItemTax.toFixed(2)}`, style: "totalRowValue" },
                  { text: `₹ ${totalOrderSubtotal.toFixed(2)}`, style: "totalRowValue" },
                  { text: `₹ ${totalCouponDiscount.toFixed(2)}`, style: "totalRowValue" },
                  { text: `₹ ${totalShippingCharge.toFixed(2)}`, style: "totalRowValue" },
                  { text: `₹ ${totalRefundAmount.toFixed(2)}`, style: "totalRowValue" },
                  { text: `₹ ${totalAmount.toFixed(2)}`, style: "totalRowValueBold" },
                  { text: "", style: "totalRowValue" },
                ],
              ],
            },
            layout: {
              fillColor: (rowIndex) => {
                if (rowIndex === 0) return "#7a2828" // Header
                if (rowIndex === allSalesData.length + 1) return "#f1f5f9" // Totals row
                return rowIndex % 2 === 0 ? "#ffffff" : "#f8f9fa" // Alternating rows
              },
              hLineWidth: (i, node) => (i === 0 || i === 1 || i === node.table.body.length ? 2 : 1),
              vLineWidth: () => 1,
              hLineColor: (i, node) => (i === 0 || i === 1 || i === node.table.body.length ? "#7a2828" : "#dee2e6"),
              vLineColor: () => "#dee2e6",
            },
          },
        ],
        footer: (currentPage, pageCount) => {
          return {
            columns: [
              {
                text: `Generated on ${format(new Date(), "MMMM d, yyyy 'at' h:mm:ss a")}`,
                style: "footerText",
                alignment: "left",
                margin: [40, 10, 0, 0],
              },
              {
                text: `Page ${currentPage} of ${pageCount}`,
                style: "footerText",
                alignment: "right",
                margin: [0, 10, 40, 0],
              },
            ],
          }
        },
        styles: {
          companyName: {
            fontSize: 20,
            bold: true,
            color: "#7a2828",
          },
          companyTagline: {
            fontSize: 10,
            italics: true,
            color: "#666666",
            margin: [0, 2, 0, 8],
          },
          reportTitle: {
            fontSize: 16,
            bold: true,
            color: "#333333",
          },
          headerDate: {
            fontSize: 10,
            bold: true,
            color: "#7a2828",
          },
          headerTime: {
            fontSize: 9,
            color: "#666666",
          },
          sectionHeader: {
            fontSize: 12,
            bold: true,
            color: "#7a2828",
            margin: [0, 0, 0, 5],
          },
          periodText: {
            fontSize: 14,
            color: "#333333",
          },
          summaryLabel: {
            fontSize: 10,
            bold: true,
            color: "#666666",
          },
          summaryValue: {
            fontSize: 12,
            bold: true,
            color: "#7a2828",
            alignment: "right",
          },
          tableHeader: {
            fontSize: 9,
            bold: true,
            color: "white",
            alignment: "center",
          },
          tableCell: {
            fontSize: 8,
            color: "#333333",
          },
          tableCellAlt: {
            fontSize: 8,
            color: "#333333",
          },
          tableCellNumber: {
            fontSize: 8,
            color: "#333333",
            alignment: "right",
          },
          tableCellNumberAlt: {
            fontSize: 8,
            color: "#333333",
            alignment: "right",
          },
          tableCellNumberBold: {
            fontSize: 8,
            bold: true,
            color: "#7a2828",
            alignment: "right",
          },
          tableCellNumberBoldAlt: {
            fontSize: 8,
            bold: true,
            color: "#7a2828",
            alignment: "right",
          },
          totalRowHeader: {
            fontSize: 10,
            bold: true,
            color: "#7a2828",
          },
          totalRowValue: {
            fontSize: 9,
            bold: true,
            color: "#333333",
            alignment: "right",
          },
          totalRowValueBold: {
            fontSize: 10,
            bold: true,
            color: "#7a2828",
            alignment: "right",
          },
          footerText: {
            fontSize: 8,
            color: "#666666",
          },
        },
        defaultStyle: {
          fontSize: 9,
          font: "Roboto",
        },
      }

      pdfMake.createPdf(documentDefinition).download(`Vaishali_Golds_Sales_Report_${filterType}.pdf`)
    } catch (error) {
      console.error("PDF download error:", error)
      setError("Failed to download PDF report")
    } finally {
      setDownloadLoading(false)
    }
  }

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
          {loading || downloadLoading ? "Loading..." : "Apply Filter"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="overflow-hidden border-l-4 border-l-teal-700 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 mb-2">Total Sales</span>
              <span className="text-3xl font-bold">
                ₹ {(Number(totalSales) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-red-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 mb-2">Total Discount</span>
              <span className="text-3xl font-bold">
                ₹ {(Number(summary.totalDiscount) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced PDF Download Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Professional Reports</h3>
              <p className="text-sm text-gray-600">Generate comprehensive sales reports with company branding</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="bg-green-600 hover:bg-green-700 text-white border-green-600 flex items-center gap-2 shadow-sm"
              onClick={handleDownloadExcel}
              disabled={loading || downloadLoading || !salesData.length}
            >
              <DownloadIcon className="h-4 w-4" />
              {downloadLoading ? "Generating..." : "Excel Report"}
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center gap-2 shadow-sm"
              onClick={handleDownloadPDF}
              disabled={loading || downloadLoading || !salesData.length}
            >
              <FileTextIcon className="h-4 w-4" />
              {downloadLoading ? "Generating..." : "Premium PDF"}
            </Button>
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Company Logo Included
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Professional Formatting
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Summary Analytics
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
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
                <TableCell colSpan={12} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : salesData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center">
                  No data available
                </TableCell>
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
                  <TableCell>₹ {Number(row.totalAmount).toFixed(2)}</TableCell>
                  <TableCell>₹ {Number(row.refund_amount).toFixed(2)}</TableCell>
                  <TableCell>₹ {Number(row.couponDiscount).toFixed(2)}</TableCell>
                  <TableCell>₹ {Number(row.shippingCharge).toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">₹ {Number(row.orderSubtotal).toFixed(2)}</TableCell>
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
  )
}

export default SalesReport
