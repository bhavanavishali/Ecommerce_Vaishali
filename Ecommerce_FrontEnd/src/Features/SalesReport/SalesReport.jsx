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
import api from '../../api'
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SalesReport = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date("2025-04-01"),
    to: new Date("2025-05-05"),
  });
  const [filterType, setFilterType] = useState("custom");
  const [salesData, setSalesData] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalDiscount: 0,
    totalRefund: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const response = await api.get('cartapp/sales-report/', {
        params: {
          filter_type: filterType,
          from_date: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
          to_date: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });
      setSalesData(response.data.salesData);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
  };

  const handleFromDateChange = (date) => {
    setDateRange((prev) => ({ ...prev, from: date }));
  };

  const handleToDateChange = (date) => {
    setDateRange((prev) => ({ ...prev, to: date }));
  };

  const handleApplyFilter = () => {
    fetchSalesData();
  };

  const handleDownloadCSV = () => {
    const headers = [
      'Order ID', 'Date', 'Order MRP', 'Item Discount', 'Order Subtotal',
      'Coupon Discount', 'Shipping Charge', 'Total Amount', 'Refund Amount', 'Payment Method'
    ];
    const rows = salesData.map(row => [
      row.orderId,
      row.date,
      row.orderMrp.toFixed(2),
      row.itemDiscount.toFixed(2),
      row.orderSubtotal.toFixed(2),
      row.couponDiscount.toFixed(2),
      row.shippingCharge.toFixed(2),
      row.totalAmount.toFixed(2),
      row.refundAmount.toFixed(2),
      row.paymentMethod
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'sales_report.csv');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Sales Report', 14, 20);
    doc.autoTable({
      startY: 30,
      head: [[
        'Order ID', 'Date', 'Order MRP', 'Item Discount', 'Order Subtotal',
        'Coupon Discount', 'Shipping', 'Total Amount', 'Refund Amount', 'Payment Method'
      ]],
      body: salesData.map(row => [
        row.orderId,
        row.date,
        `₹ ${row.orderMrp.toFixed(2)}`,
        `₹ ${row.itemDiscount.toFixed(2)}`,
        `₹ ${row.orderSubtotal.toFixed(2)}`,
        `₹ ${row.couponDiscount.toFixed(2)}`,
        `₹ ${row.shippingCharge.toFixed(2)}`,
        `₹ ${row.totalAmount.toFixed(2)}`,
        `₹ ${row.refundAmount.toFixed(2)}`,
        row.paymentMethod
      ]),
      theme: 'grid',
      styles: { fontSize: 8 },
    });
    doc.save('sales_report.pdf');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-[#7a2828] mb-6">Sales Report</h1>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Select value={filterType} onValueChange={handleFilterTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="custom">Custom</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="thisWeek">This Week</SelectItem>
            <SelectItem value="lastWeek">Last Week</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="lastMonth">Last Month</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
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
          <PopoverTrigger asChild className="bg-white">
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
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
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Apply Filter'}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="overflow-hidden border-l-4 border-l-teal-700 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 mb-2">Total Sales</span>
              <span className="text-3xl font-bold">₹ {summary.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-red-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 mb-2">Total Discount</span>
              <span className="text-3xl font-bold">₹ {summary.totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-amber-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 mb-2">Total Refund</span>
              <span className="text-3xl font-bold">₹ {summary.totalRefund.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Download Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button 
          variant="outline" 
          className="bg-[#7a2828] hover:bg-[#7a2828] text-white flex items-center gap-2"
          onClick={handleDownloadCSV}
          disabled={loading || !salesData.length}
        >
          <DownloadIcon className="h-4 w-4" />
          Download CSV
        </Button>
        <Button 
          variant="outline" 
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          onClick={handleDownloadPDF}
          disabled={loading || !salesData.length}
        >
          <FileTextIcon className="h-4 w-4" />
          Download PDF
        </Button>
        <Button 
          variant="outline" 
          className="ml-auto text-gray-600 hover:text-gray-900 flex items-center gap-2"
          onClick={fetchSalesData}
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Data Table */}
      <div className="rounded-lg border shadow overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-medium text-[#7a2828]">Order ID</TableHead>
              <TableHead className="font-medium text-[#7a2828]">Date</TableHead>
              <TableHead className="font-medium text-[#7a2828]">
                <div className="flex items-center">
                  Order MRP
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="font-medium text-[#7a2828]">Item Discount</TableHead>
              <TableHead className="font-medium text-[#7a2828]">Order Subtotal</TableHead>
              <TableHead className="font-medium text-[#7a2828]">Coupon Discount</TableHead>
              <TableHead className="font-medium text-[#7a2828]">Shipping Charge</TableHead>
              <TableHead className="font-medium text-[#7a2828]">
                <div className="flex items-center">
                  Total Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="font-medium text-[#7a2828]">Refund Amount</TableHead>
              <TableHead className="font-medium text-[#7a2828]">Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesData.map((row) => (
              <TableRow key={row.orderId} className="hover:bg-gray-50">
                <TableCell className="font-medium">{row.orderId}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>₹ {row.orderMrp.toFixed(2)}</TableCell>
                <TableCell>₹ {row.itemDiscount.toFixed(2)}</TableCell>
                <TableCell>₹ {row.orderSubtotal.toFixed(2)}</TableCell>
                <TableCell>₹ {Number(row.couponDiscount).toFixed(2)}</TableCell>
                <TableCell>₹ {Number(row.shippingCharge).toFixed(2)}</TableCell>

                
                <TableCell className="font-semibold">₹  {Number(row.shippingCharge).toFixed(2)}</TableCell>
                <TableCell className={row.refundAmount > 0 ? "text-amber-600 font-medium" : ""}>
                  ₹ {row.refundAmount.toFixed(2)}
                </TableCell>
                <TableCell>{row.paymentMethod}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination (Placeholder, implement server-side pagination if needed) */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{salesData.length}</span> of{" "}
          <span className="font-medium">{salesData.length}</span> results
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-teal-50">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;