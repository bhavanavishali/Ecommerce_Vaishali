"use client"
import { Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <footer className="bg-[#f8ece9] text-[#023d12]  py-6 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-bold mb-3 md:mb-6">Useful Links</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a href="#" className="hover:underline text-sm md:text-base">
                  Delivery Information
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline text-sm md:text-base">
                  International Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline text-sm md:text-base">
                  Payment Options
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline text-sm md:text-base">
                  Returns
                </a>
              </li>
            </ul>
          </div>

         
          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-bold mb-3 md:mb-6">Contact Us</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a href="#" className="hover:underline text-sm md:text-base">
                  Write to Us
                </a>
              </li>
              <li>
                <a href="tel:18002660123" className="hover:underline text-sm md:text-base">
                  1800-266-0123
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline text-sm md:text-base">
                  Chat with Us
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <h3 className="text-lg font-bold mb-3 md:mb-6">Follow Us</h3>
            <div className="flex space-x-3 md:space-x-4">
              <a href="#" className="bg-white p-1.5 md:p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Facebook className="h-5 w-5 md:h-6 md:w-6 text-[#023d12] " />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="bg-white p-1.5 md:p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Instagram className="h-5 w-5 md:h-6 md:w-6 text-[#023d12] " />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="bg-white p-1.5 md:p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Linkedin className="h-5 w-5 md:h-6 md:w-6 text-[#023d12] " />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="bg-white p-1.5 md:p-2 rounded-full hover:bg-gray-100 transition-colors">
                <MessageCircle className="h-5 w-5 md:h-6 md:w-6 text-[#023d12] " />
                <span className="sr-only">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-4 md:my-8 bg-gray-300" />

        <div className="text-center text-xs md:text-sm">
          <p className="mb-1 md:mb-2">2026 Vaishali Company Limited. All Rights Reserved.</p>
          <div className="flex justify-center space-x-2 md:space-x-4 flex-wrap">
            <a href="#" className="hover:underline">
              Terms & Conditions
            </a>
            <span className="hidden md:inline">|</span>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <span className="hidden md:inline">|</span>
            <a href="#" className="hover:underline">
              Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

