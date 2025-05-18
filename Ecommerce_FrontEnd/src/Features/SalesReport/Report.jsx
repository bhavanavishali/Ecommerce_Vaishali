
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileDown, FileText } from 'lucide-react';

const Report = () => {
  // Sample data from the image
  const reportData = {
    filter: "Custom",
    period: "2025-04-01 to 2025-05-05",
    generatedOn: "2025-05-05 15:13:34",
    orders: [
      { id: "775NZPEYJD", date: "2025-04-01", mrp: "Rs.1165.00", discount: "-Rs.77.00", subtotal: "Rs.1088.00", coupon: "-Rs.45.00", shipping: "Rs.50.00", total: "Rs.1063.00", refund: "Rs.0.00", payment: "Razorpay" },
      { id: "XQCFVOHZLI", date: "2025-04-05", mrp: "Rs.520.00", discount: "-Rs.70.00", subtotal: "Rs.450.00", coupon: "-Rs.45.00", shipping: "Rs.50.00", total: "Rs.455.00", refund: "Rs.0.00", payment: "Cash on De" },
      { id: "UFUII1A6EI", date: "2025-04-02", mrp: "Rs.1100.00", discount: "-Rs.175.00", subtotal: "Rs.925.00", coupon: "-Rs.0.00", shipping: "Rs.50.00", total: "Rs.975.00", refund: "Rs.0.00", payment: "Cash on De" },
      { id: "F7CVTS7SGI", date: "2025-04-05", mrp: "Rs.1170.00", discount: "-Rs.42.00", subtotal: "Rs.1128.00", coupon: "-Rs.45.00", shipping: "Rs.50.00", total: "Rs.1133.00", refund: "Rs.0.00", payment: "Razorpay" },
      { id: "APWLQDZLGN", date: "2025-04-03", mrp: "Rs.10409.00", discount: "-Rs.2290.00", subtotal: "Rs.8119.00", coupon: "-Rs.45.00", shipping: "Rs.50.00", total: "Rs.8124.00", refund: "Rs.0.00", payment: "Razorpay" },
      { id: "CP9TTHPBIV", date: "2025-04-15", mrp: "Rs.170.00", discount: "-Rs.0.00", subtotal: "Rs.170.00", coupon: "-Rs.0.00", shipping: "Rs.50.00", total: "Rs.220.00", refund: "Rs.0.00", payment: "Razorpay" },
      { id: "HZ5LX3U5PL", date: "2025-04-07", mrp: "Rs.220.00", discount: "-Rs.35.00", subtotal: "Rs.185.00", coupon: "-Rs.0.00", shipping: "Rs.50.00", total: "Rs.235.00", refund: "Rs.185.00", payment: "Cash on De" },
      { id: "Z4U8V21TBE", date: "2025-04-03", mrp: "Rs.2019.00", discount: "-Rs.430.00", subtotal: "Rs.1589.00", coupon: "-Rs.0.00", shipping: "Rs.50.00", total: "Rs.1639.00", refund: "Rs.1589.00", payment: "Wallet" },
      { id: "RCYXPKSMF", date: "2025-04-04", mrp: "Rs.1470.00", discount: "-Rs.35.00", subtotal: "Rs.1435.00", coupon: "-Rs.0.00", shipping: "Rs.50.00", total: "Rs.1485.00", refund: "Rs.0.00", payment: "Razorpay" },
      { id: "YDE50MMOXD", date: "2025-04-07", mrp: "Rs.1580.00", discount: "-Rs.260.00", subtotal: "Rs.1320.00", coupon: "-Rs.45.00", shipping: "Rs.50.00", total: "Rs.1325.00", refund: "Rs.0.00", payment: "Razorpay" },
      { id: "YHNLP2IROD", date: "2025-04-04", mrp: "Rs.1669.00", discount: "-Rs.360.00", subtotal: "Rs.1309.00", coupon: "-Rs.45.00", shipping: "Rs.50.00", total: "Rs.1242.00", refund: "Rs.0.00", payment: "Razorpay" },
      { id: "LPXVRQRM81", date: "2025-04-04", mrp: "Rs.960.00", discount: "-Rs.126.00", subtotal: "Rs.834.00", coupon: "-Rs.0.00", shipping: "Rs.50.00", total: "Rs.794.00", refund: "Rs.0.00", payment: "Cash on De" },
      { id: "3IDSGYZDDQ", date: "2025-04-05", mrp: "Rs.1180.00", discount: "-Rs.165.00", subtotal: "Rs.1015.00", coupon: "-Rs.45.00", shipping: "Rs.50.00", total: "Rs.1020.00", refund: "Rs.0.00", payment: "Razorpay" },
      { id: "IFSG57NBYH", date: "2025-04-28", mrp: "Rs.4717.00", discount: "-Rs.1115.00", subtotal: "Rs.3602.00", coupon: "-Rs.45.00", shipping: "Rs.50.00", total: "Rs.3607.00", refund: "Rs.0.00", payment: "Razorpay" },
      { id: "JBKFPAHAYC", date: "2025-04-08", mrp: "Rs.170.00", discount: "-Rs.0.00", subtotal: "Rs.170.00", coupon: "-Rs.0.00", shipping: "Rs.50.00", total: "Rs.220.00", refund: "Rs.0.00", payment: "Razorpay" },
      { id: "O7CJ6UGZUH", date: "2025-04-05", mrp: "Rs.6077.00", discount: "-Rs.1340.00", subtotal: "Rs.4737.00", coupon: "-Rs.45.00", shipping: "Rs.50.00", total: "Rs.4742.00", refund: "Rs.1320.00", payment: "Razorpay" },
      { id: "VMFVITVCCH", date: "2025-04-14", mrp: "Rs.1719.00", discount: "-Rs.395.00", subtotal: "Rs.1324.00", coupon: "-Rs.0.00", shipping: "Rs.50.00", total: "Rs.1374.00", refund: "Rs.0.00", payment: "Razorpay" },
    ],
    summary: {
      totalSales: "Rs.29653.00",
      totalDiscount: "-Rs.495.00",
      totalRefund: "Rs.3094.00"
    }
  };

  const handleDownloadPDF = () => {
    // Implement PDF download functionality
    console.log("Downloading PDF report");
  };

  const handleDownloadExcel = () => {
    // Implement Excel download functionality
    console.log("Downloading Excel report");
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo 1.png" 
              alt="WordBloom Logo" 
              className="w-20 h-18 object-contain"
            />
            <h1 className="text-xl font-bold text-[#7a2828]">VaishaliGold Sales Report</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleDownloadPDF}
            >
              <FileText className="h-4 w-4" />
              PDF
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleDownloadExcel}
            >
              <FileDown className="h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex justify-between">
            <span className="font-medium">Filter:</span>
            <span>{reportData.filter}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Period:</span>
            <span>{reportData.period}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Generated on:</span>
            <span>{reportData.generatedOn}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-200">
                <TableHead className="font-bold text-center">Order ID</TableHead>
                <TableHead className="font-bold text-center">Date</TableHead>
                <TableHead className="font-bold text-center">MRP</TableHead>
                <TableHead className="font-bold text-center">Item Discount</TableHead>
                <TableHead className="font-bold text-center">Subtotal</TableHead>
                <TableHead className="font-bold text-center">Coupon</TableHead>
                <TableHead className="font-bold text-center">Shipping</TableHead>
                <TableHead className="font-bold text-center">Total</TableHead>
                <TableHead className="font-bold text-center">Refund</TableHead>
                <TableHead className="font-bold text-center">Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-center">{order.id}</TableCell>
                  <TableCell className="text-center">{order.date}</TableCell>
                  <TableCell className="text-center">{order.mrp}</TableCell>
                  <TableCell className="text-center text-red-600">{order.discount}</TableCell>
                  <TableCell className="text-center">{order.subtotal}</TableCell>
                  <TableCell className="text-center text-red-600">{order.coupon}</TableCell>
                  <TableCell className="text-center">{order.shipping}</TableCell>
                  <TableCell className="text-center">{order.total}</TableCell>
                  <TableCell className="text-center">{order.refund}</TableCell>
                  <TableCell className="text-center">{order.payment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <div className="bg-slate-200 p-2 text-center font-bold">
            Summary
          </div>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="flex justify-between border p-2">
              <span className="font-medium">Total Sales:</span>
              <span>{reportData.summary.totalSales}</span>
            </div>
            <div className="flex justify-between border p-2">
              <span className="font-medium">Total Discount:</span>
              <span className="text-red-600">{reportData.summary.totalDiscount}</span>
            </div>
            <div className="flex justify-between border p-2">
              <span className="font-medium">Total Refund:</span>
              <span>{reportData.summary.totalRefund}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Report;