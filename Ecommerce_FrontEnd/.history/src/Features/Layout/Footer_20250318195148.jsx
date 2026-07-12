"use client"
import { Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <footer className="bg-[#f8ece9] text-[#7a2828] py-12 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Useful Links */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Useful Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:underline">
                  Delivery Information
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  International Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Payment Options
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Information</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Offers & Contest Details
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Help & FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  About Vaishali Gold
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:underline">
                  Write to Us
                </a>
              </li>
              <li>
                <a href="tel:18002660123" className="hover:underline">
                  1800-266-0123
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Chat with Us
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Facebook className="h-6 w-6 text-[#7a2828]" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Instagram className="h-6 w-6 text-[#7a2828]" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Linkedin className="h-6 w-6 text-[#7a2828]" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors">
                <MessageCircle className="h-6 w-6 text-[#7a2828]" />
                <span className="sr-only">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-300" />

        <div className="text-center text-sm">
          <p className="mb-2">2025 Vaishali Gold Company Limited. All Rights Reserved.</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:underline">
              Terms & Conditions
            </a>
            <span>|</span>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <span>|</span>
            <a href="#" className="hover:underline">
              Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

