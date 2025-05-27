


// "use client"

// import { useState, useRef } from "react";
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import { Download, Image } from "lucide-react";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
// import { useParams } from "react-router-dom";
// import { useEffect } from "react";

// export default function InvoicePage() {
//   const [invoice, setInvoice] = useState({});
//   const {id} = useParams()
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

  
//   useEffect(() => {
//     const fetchinvoice = async () => {
//       try {
//         const response = await api.get(`cartapp/orders/${id}/`);
//         setInvoice(response.data);
//         console.log("moooooooooooooooooo",response.data)
//         setIsLoading(false);
//       } catch (err) {
//         setError("Failed to load order details. Please try again later.");
//         setIsLoading(false);
//         console.error("Error fetching order:", err);
//       }
//     };
//     fetchinvoice();
//   }, [id]);


//   const invoiceRef = useRef();

//   const handleDownloadPDF = async () => {
//     const buttonContainer = document.querySelector(".download-buttons");
//     if (buttonContainer) {
//       buttonContainer.style.display = "none";
//     }
//     const element = invoiceRef.current;
//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//     });
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: "a4",
//     });

//     const imgWidth = 190;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;
//     const pageHeight = 297;

//     let heightLeft = imgHeight;
//     let position = 0;

//     pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
//     heightLeft -= pageHeight;

//     while (heightLeft > 0) {
//       position = heightLeft - imgHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, "PNG", 10, position + 10, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }

//     pdf.save(`invoice_${invoice.orderID}.pdf`);
//     if (buttonContainer) {
//       buttonContainer.style.display = "flex";
//     }
//   };

//   const handleDownloadImage = async () => {
//     const buttonContainer = document.querySelector(".download-buttons");
//     if (buttonContainer) {
//       buttonContainer.style.display = "none";
//     }
//     const element = invoiceRef.current;
//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//     });
//     const imgData = canvas.toDataURL("image/png");
//     const link = document.createElement("a");
//     link.href = imgData;
//     link.download = `invoice_${invoice.orderID}.png`;
//     link.click();
//     if (buttonContainer) {
//       buttonContainer.style.display = "flex";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4 md:p-8">
//       <div ref={invoiceRef}>
//         <Card className="max-w-4xl mx-auto border-amber-200 shadow-lg">
//         <CardHeader className="border-b border-amber-100">
//   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//     <div className="flex items-center gap-3">
      
//       <div>
//         <img
//           src="/logo 1.png" // Replace with the actual path to your logo
//           alt="Vaishali Golds Logo"
//           className="h-10 w-auto" // Adjust height and width as needed
//         />
//       </div>
//     </div>
//     <div className="flex flex-col items-end">
//       <h1 className="text-2xl font-bold text-[#7a2828]">INVOICE</h1>
//       <div className="flex gap-2 mt-2 download-buttons">
//         <Button
//           variant="outline"
//           size="sm"
//           className="border-amber-200 hover:bg-amber-50"
//           onClick={handleDownloadPDF}
//         >
//           <Download className="h-4 w-4 mr-1" />
//           PDF
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           className="border-amber-200 hover:bg-amber-50"
//           onClick={handleDownloadImage}
//         >
//           <Image className="h-4 w-4 mr-1" />
//           Image
//         </Button>
//       </div>
//     </div>
//   </div>
// </CardHeader>
          
//           <CardContent className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-sm font-medium text-amber-800">Order Details</h3>
//                   <div className="mt-2 space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-500">Order ID</span>
//                       <span className="text-sm font-medium">{invoice.order_number}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-500">Order Date</span>
//                       <span className="text-sm font-medium">{invoice.created_at}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-500">Payment Method</span>
//                       <span className="text-sm font-medium">{invoice.payment_method}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-500">Payment Status</span>
//                       <span className="text-sm font-medium">{invoice.paymentStatus}</span>
                        
                      
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-sm font-medium text-amber-800">Shipping Address</h3>
//                   <div className="mt-2 p-3 bg-amber-50 rounded-md border border-amber-100">
//                     <p className="font-medium text-[#7a2828]">{invoice.order_address.name}</p>
//                     <p className="text-sm text-gray-600">{invoice.order_address.house_no}</p>
//                     <p className="text-sm text-gray-600">{invoice.order_address.city}</p>
//                     <p className="text-sm text-gray-600">
//                       {invoice.order_address.state} - {invoice.order_address.pin_code}
//                     </p>
//                     <p className="text-sm text-gray-600 mt-1">Phone: {invoice.order_address.mobile_number}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8">
//               <h3 className="text-sm font-medium text-amber-800 mb-3">Order Items</h3>
//               <div className="rounded-md border border-amber-200 overflow-hidden">
//                 <Table>
//                   <TableHeader className="bg-[#7a2828]/5">
//                     <TableRow>
//                       <TableHead className="text-[#7a2828]">Item</TableHead>
                     
//                       <TableHead className="text-[#7a2828] text-center">Qty</TableHead>
                      
//                       <TableHead className="text-[#7a2828] text-right"> Gross Weight</TableHead>
//                       <TableHead className="text-[#7a2828] text-right">Item Subtotal</TableHead>
//                       <TableHead className="text-[#7a2828]">Status</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {invoice.items.map((item, index) => (
//                       <TableRow key={index} className="hover:bg-amber-50">
//                         <TableCell className="font-medium">{item.product.images.name}</TableCell>
//                         <TableCell>{item.quantity}</TableCell>
                        
                        
//                         <TableCell className="text-right">₹ {item.variant.gross_weight}</TableCell>
//                         <TableCell className="text-right font-medium">₹ {item.subtotal.toFixed(2)}</TableCell>
//                         <TableCell>
//                           <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
//                             {item.status}
//                           </Badge>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>

//             <div className="mt-8 flex justify-end">
//               <div className="w-full md:w-72 space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Order MRP</span>
//                   <span>₹ {invoice.total_amount.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Total Order Discount</span>
//                   <span className="text-red-600">- ₹ {invoice.total_discount.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Shipping Charge</span>
//                   <span>₹ {invoice.shippingCharge.toFixed(2)} || 0.00</span>
//                 </div>
//                 <Separator className="my-2 bg-amber-200" />
//                 <div className="flex justify-between font-medium">
//                   <span className="text-[#7a2828]">Grand Total</span>
//                   <span className="text-[#7a2828]">₹ {invoice.final_total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>

//           <CardFooter className="flex flex-col items-center p-6 bg-amber-50 border-t border-amber-100">
//             <p className="text-center text-[#7a2828] font-medium">Thank you for shopping with Vaishali Gold!</p>
//             <p className="text-center text-sm text-gray-600 mt-1">
//               If you have any questions about your order, please contact our customer service.
//             </p>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, Image } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import api from '../../api'

export default function InvoicePage() {
  const [invoice, setInvoice] = useState({});
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchinvoice = async () => {
      try {
        const response = await api.get(`cartapp/orders/${id}/`);
        const apiData = response.data;
        console.log("my invoice",response.data)

        // Transform API response to match expected invoice structure
        const transformedInvoice = {
          order_number: apiData.order_number,
          created_at: new Date(apiData.created_at).toLocaleDateString(), // Format date as needed
          payment_method: apiData.payment_method,
          payment_status: apiData.payment_status,
          final_total: parseFloat(apiData.final_total) || 0,
          total_amount: parseFloat(apiData.total_amount) || 0,
          total_discount: parseFloat(apiData.total_discount) || 0,
          total_tax: parseFloat(apiData.total_tax) || 0,
          coupon_discount: parseFloat(apiData.coupon_discount) || 0,
          shipping: parseFloat(apiData.shipping) || 0,
          order_address: {
            name: apiData.order_address.name,
            house_no: apiData.order_address.house_no,
            city: apiData.order_address.city,
            state: apiData.order_address.state,
            pin_code: apiData.order_address.pin_code,
            mobile_number: apiData.order_address.mobile_number,
          },
          items: apiData.items.map((item) => ({
            product: {
              name: item.product.name, // Use product name directly
              images: item.product.images, // Array of image URLs
            },
            quantity: item.quantity,
            subtotal: parseFloat(item.subtotal) || 0,
            status: item.status,
            variant: {
              gross_weight: item.variant.gross_weight,
            },
          })),
        };

        setInvoice(transformedInvoice);
        console.log("Transformed Invoice:", transformedInvoice);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load order details. Please try again later.");
        setIsLoading(false);
        console.error("Error fetching order:", err);
      }
    };
    fetchinvoice();
  }, [id]);

  const invoiceRef = useRef();

  const handleDownloadPDF = async () => {
    const buttonContainer = document.querySelector(".download-buttons");
    if (buttonContainer) {
      buttonContainer.style.display = "none";
    }
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeight = 297;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position + 10, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`invoice_${invoice.order_number || "order"}.pdf`);
    if (buttonContainer) {
      buttonContainer.style.display = "flex";
    }
  };

  const handleDownloadImage = async () => {
    const buttonContainer = document.querySelector(".download-buttons");
    if (buttonContainer) {
      buttonContainer.style.display = "none";
    }
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgData;
    link.download = `invoice_${invoice.order_number || "order"}.png`;
    link.click();
    if (buttonContainer) {
      buttonContainer.style.display = "flex";
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4 md:p-8">
      <div ref={invoiceRef}>
        <Card className="max-w-4xl mx-auto border-amber-200 shadow-lg">
          <CardHeader className="border-b border-amber-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <img
                    src="/logo 1.png" // Replace with the actual path to your logo
                    alt="Vaishali Golds Logo"
                    className="h-10 w-auto"
                  />
                </div>
              </div>
              <div className="flex flex-col items-end">
                <h1 className="text-2xl font-bold text-[#7a2828]">INVOICE</h1>
                <div className="flex gap-2 mt-2 download-buttons">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-200 hover:bg-amber-50"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-200 hover:bg-amber-50"
                    onClick={handleDownloadImage}
                  >
                    <Image className="h-4 w-4 mr-1" />
                    Image
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Order Details</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Order ID</span>
                      <span className="text-sm font-medium">{invoice.order_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Order Date</span>
                      <span className="text-sm font-medium">{invoice.created_at}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Payment Method</span>
                      <span className="text-sm font-medium">{invoice.payment_method}</span>
                    </div>
                    
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Shipping Address</h3>
                  <div className="mt-2 p-3 bg-amber-50 rounded-md border border-amber-100">
                    <p className="font-medium text-[#7a2828]">{invoice.order_address?.name}</p>
                    <p className="text-sm text-gray-600">{invoice.order_address?.house_no}</p>
                    <p className="text-sm text-gray-600">{invoice.order_address?.city}</p>
                    <p className="text-sm text-gray-600">
                      {invoice.order_address?.state} - {invoice.order_address?.pin_code}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Phone: {invoice.order_address?.mobile_number}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-medium text-amber-800 mb-3">Order Items</h3>
              <div className="rounded-md border border-amber-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#7a2828]/5">
                    <TableRow>
                      <TableHead className="text-[#7a2828]">Item</TableHead>
                      <TableHead className="text-[#7a2828] text-center">Qty</TableHead>
                      <TableHead className="text-[#7a2828] text-right">Gross Weight</TableHead>
                      <TableHead className="text-[#7a2828] text-right">Item Subtotal</TableHead>
                      <TableHead className="text-[#7a2828]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items?.map((item, index) => (
                      <TableRow key={index} className="hover:bg-amber-50">
                        <TableCell className="font-medium">{item.product.name}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.variant.gross_weight} g</TableCell>
                        <TableCell className="text-right font-medium">₹ {item.subtotal.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border-${item.status === "cancelled" ? "red" : "green"}-500 text-${item.status === "cancelled" ? "red" : "green"}-700 bg-${item.status === "cancelled" ? "red" : "green"}-50`}
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <div className="w-full md:w-72 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Item Prices</span>
                  <span>₹ {invoice.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Product Discount</span>
                  <span className="text-red-600">- ₹ {invoice.total_discount.toFixed(2)}</span>
                </div>
                 
                 <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                 <span>
                ₹ {invoice?.total_tax ? invoice.total_tax.toFixed(2) : '0.00'}
              </span>
                </div>
                 <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Coupon Discount</span>
                  <span className="text-red-600"> ₹ {invoice.coupon_discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping Charge</span>
                 <span>₹ {invoice?.shipping ? invoice.shipping.toFixed(2) : "0.00"}</span>
                </div>
                <Separator className="my-2 bg-amber-200" />
                <div className="flex justify-between font-medium">
                  <span className="text-[#7a2828]">Grand Total</span>
                  <span className="text-[#7a2828]">₹ {invoice.final_total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-center p-6 bg-amber-50 border-t border-amber-100">
            <p className="text-center text-[#7a2828] font-medium">Thank you for shopping with Vaishali Gold!</p>
            <p className="text-center text-sm text-gray-600 mt-1">
              If you have any questions about your order, please contact our customer service.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}