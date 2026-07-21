"use client"

import { Link } from "react-router-dom"
import { FileText, ShieldCheck, ShoppingBag, Truck, AlertCircle, Mail, MessageCircle, Video } from "lucide-react"

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCF8F1' }}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center mb-4 group"
            style={{ color: '#4B4B4B' }}
          >
            <span className="hover:underline">← Back to Home</span>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-white rounded-full p-3" style={{ backgroundColor: '#0B3D2E' }}>
              <FileText className="h-6 w-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: '#1E2C24' }}>
              Terms & Conditions
            </h1>
          </div>
          <p style={{ color: '#4B4B4B' }}>
            Last updated: July 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8" style={{ border: '1px solid #E8DFC6' }}>
          
          {/* Introduction */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E2C24' }}>
              Introduction
            </h2>
            <p className="mb-4" style={{ color: '#4B4B4B' }}>
              Welcome to KeralaLooms. By accessing or using our website and services, you agree to be bound by these Terms & Conditions. 
              Please read them carefully before using our platform.
            </p>
            <p style={{ color: '#4B4B4B' }}>
              These terms govern your use of our e-commerce platform, including the purchase of products, payment processing, 
              and delivery services. By placing an order, you acknowledge that you have read, understood, and agreed to these terms.
            </p>
          </div>

          {/* Ordering Information */}
          <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: '#F7F3EB', border: '1px solid #D4AF37' }}>
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="h-6 w-6" style={{ color: '#0B3D2E' }} />
              <h2 className="text-2xl font-bold" style={{ color: '#1E2C24' }}>
                Ordering Information
              </h2>
            </div>
            <div className="space-y-4" style={{ color: '#4B4B4B' }}>
              <div className="flex items-start gap-2">
                <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>•</span>
                <span className="font-semibold" style={{ color: '#1E2C24' }}>DM or WhatsApp to Order</span>
              </div>
              <p className="ml-6">
                All orders must be placed through WhatsApp messaging. Our team will confirm your order details, 
                payment method, and delivery arrangements through WhatsApp.
              </p>
              <div className="flex items-start gap-2">
                <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>•</span>
                <span className="font-semibold" style={{ color: '#1E2C24' }}>No Cash on Delivery (COD)</span>
              </div>
              <p className="ml-6">
                We do not accept Cash on Delivery. All payments must be completed through our specified payment 
                methods before order processing and shipping.
              </p>
            </div>
          </div>

          {/* Unboxing Video Requirement */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Video className="h-6 w-6" style={{ color: '#0B3D2E' }} />
              <h2 className="text-2xl font-bold" style={{ color: '#1E2C24' }}>
                Unboxing Video Requirement
              </h2>
            </div>
            <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: '#FFF5F5', border: '1px solid #FED7D7' }}>
              <p className="font-semibold mb-3" style={{ color: '#C53030' }}>
                Important: An unboxing video is mandatory for any return, exchange, or damage claim.
              </p>
            </div>
            <ul className="space-y-3" style={{ color: '#4B4B4B' }}>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>Claims made without a clear, uninterrupted unboxing video will not be accepted.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>Please record the video from the moment the sealed package is opened until the product is fully unpacked.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>The video must clearly show the package condition, seal integrity, and product condition upon opening.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>Ensure good lighting and stable camera recording for clear documentation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>This requirement helps us verify product condition and process claims efficiently.</span>
              </li>
            </ul>
          </div>

          {/* Products & Services */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="h-6 w-6" style={{ color: '#0B3D2E' }} />
              <h2 className="text-2xl font-bold" style={{ color: '#1E2C24' }}>
                Products & Services
              </h2>
            </div>
            <ul className="space-y-3" style={{ color: '#4B4B4B' }}>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>All products displayed on our platform are subject to availability. We reserve the right to discontinue 
                any product without prior notice.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>We strive to provide accurate product descriptions, images, and prices. However, we do not warrant 
                that product descriptions or other content are error-free.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>Colors displayed on your screen may vary from the actual product colors due to monitor settings 
                and lighting conditions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>Prices are subject to change without prior notice. The price applicable at the time of order 
                placement will be the final price.</span>
              </li>
            </ul>
          </div>

          {/* Orders & Payment */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="h-6 w-6" style={{ color: '#0B3D2E' }} />
              <h2 className="text-2xl font-bold" style={{ color: '#1E2C24' }}>
                Orders & Payment
              </h2>
            </div>
            <ul className="space-y-3" style={{ color: '#4B4B4B' }}>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel 
                any order for any reason, including product unavailability or pricing errors.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>All orders must be placed through WhatsApp messaging. Our team will confirm your order details 
                and payment method through WhatsApp.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span className="font-semibold" style={{ color: '#C53030' }}>No Cash on Delivery (COD) is available.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>Payment must be completed through our specified payment methods before order processing and shipping.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>We take reasonable measures to protect your payment information, but we cannot guarantee 
                absolute security of data transmission.</span>
              </li>
            </ul>
          </div>

          {/* Shipping & Delivery */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="h-6 w-6" style={{ color: '#0B3D2E' }} />
              <h2 className="text-2xl font-bold" style={{ color: '#1E2C24' }}>
                Shipping & Delivery
              </h2>
            </div>
            <ul className="space-y-3" style={{ color: '#4B4B4B' }}>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>Shipping times are estimates and not guaranteed. Delivery times may vary based on location 
                and external factors beyond our control.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>We are not responsible for delays caused by customs, weather, or other unforeseen circumstances.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>International shipping may be subject to customs duties and taxes, which are the responsibility 
                of the customer.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>Adding a shipping address is optional. If no address is provided, we will contact you via 
                WhatsApp to arrange delivery details.</span>
              </li>
            </ul>
          </div>

          {/* Returns & Refunds */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6" style={{ color: '#0B3D2E' }} />
              <h2 className="text-2xl font-bold" style={{ color: '#1E2C24' }}>
                Returns & Refunds
              </h2>
            </div>
            <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: '#FFF5F5', border: '1px solid #FED7D7' }}>
              <p className="font-semibold" style={{ color: '#C53030' }}>
                Required: Unboxing video for all return, exchange, or damage claims.
              </p>
            </div>
            <ul className="space-y-3" style={{ color: '#4B4B4B' }}>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>Returns are accepted within [X] days of delivery, subject to our return policy conditions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>Products must be unused, in original packaging, and accompanied by proof of purchase.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span className="font-semibold">An unboxing video is mandatory for any return, exchange, or damage claim.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>Claims made without a clear, uninterrupted unboxing video will not be accepted.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>Refunds will be processed within [X] business days after we receive and inspect the returned item.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>Shipping costs for returns are the responsibility of the customer unless the return is due 
                to our error or defective product.</span>
              </li>
            </ul>
          </div>

          {/* User Accounts */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="h-6 w-6" style={{ color: '#0B3D2E' }} />
              <h2 className="text-2xl font-bold" style={{ color: '#1E2C24' }}>
                User Accounts
              </h2>
            </div>
            <ul className="space-y-3" style={{ color: '#4B4B4B' }}>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>You are responsible for maintaining the confidentiality of your account credentials.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>You agree to notify us immediately of any unauthorized use of your account.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#D4AF37' }}>•</span>
                <span>We reserve the right to terminate accounts that violate these terms or engage in fraudulent activity.</span>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6" style={{ color: '#0B3D2E' }} />
              <h2 className="text-2xl font-bold" style={{ color: '#1E2C24' }}>
                Contact Us
              </h2>
            </div>
            <p className="mb-4" style={{ color: '#4B4B4B' }}>
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <ul className="space-y-2" style={{ color: '#4B4B4B' }}>
              <li>• WhatsApp: +44 7553 387651</li>
              <li>• Email: info.keralaloom@gmail.com</li>
              <li>• Website: www.bykeralalooms.com</li>
            </ul>
          </div>

          {/* Changes to Terms */}
          <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: '#F7F3EB' }}>
            <h2 className="text-xl font-bold mb-3" style={{ color: '#1E2C24' }}>
              Changes to Terms
            </h2>
            <p style={{ color: '#4B4B4B' }}>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting 
              on our website. Your continued use of our services after changes constitutes acceptance of the updated terms.
            </p>
          </div>

          {/* Agreement */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F3EB', border: '1px solid #D4AF37' }}>
            <p className="font-semibold mb-2" style={{ color: '#1E2C24' }}>
              By using KeralaLooms, you acknowledge that you have read, understood, and agree to be bound by these 
              Terms & Conditions.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center" style={{ color: '#4B4B4B' }}>
          <p className="text-sm">
            © 2026 KeralaLooms. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
