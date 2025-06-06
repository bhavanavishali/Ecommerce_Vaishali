"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin, Send, Diamond } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Replace with your actual form submission logic
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate successful submission
      setSubmitSuccess(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setSubmitError("There was an error sending your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#7a2828] mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Have a question about our exquisite jewelry collection or need assistance with your purchase? We're here to
            help! Reach out to us using any of the methods below or fill out the contact form.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="p-6 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-[#7a2828] p-3 rounded-full text-white mr-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600 mt-1">123 Jewelry Lane, Golden City, GC 54321</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#7a2828] p-3 rounded-full text-white mr-4">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600 mt-1">+1 (555) 789-0123</p>
                    <p className="text-gray-600">+1 (555) 456-7890 (Customer Support)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#7a2828] p-3 rounded-full text-white mr-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600 mt-1">info@goldenjewels.com</p>
                    <p className="text-gray-600">support@goldenjewels.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#7a2828] p-3 rounded-full text-white mr-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
                    <div className="text-gray-600 mt-1 space-y-1">
                      <p>Monday - Friday: 10am - 7pm</p>
                      <p>Saturday: 10am - 5pm</p>
                      <p>Sunday: 12pm - 4pm</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-[#7a2828] mb-4 flex items-center">
                <Diamond className="h-5 w-5 mr-2" />
                Our Jewelry Services
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#7a2828] mr-2"></div>
                  Custom Jewelry Design
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#7a2828] mr-2"></div>
                  Jewelry Repair & Restoration
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#7a2828] mr-2"></div>
                  Gemstone Replacement
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#7a2828] mr-2"></div>
                  Gold & Diamond Appraisals
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#7a2828] mr-2"></div>
                  Jewelry Cleaning & Polishing
                </li>
              </ul>
            </Card>

            <div>
              <h3 className="text-xl font-semibold text-[#7a2828] mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-[#7a2828] hover:bg-[#5e1e1e] text-white p-3 rounded-full transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-[#7a2828] hover:bg-[#5e1e1e] text-white p-3 rounded-full transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-[#7a2828] hover:bg-[#5e1e1e] text-white p-3 rounded-full transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-[#7a2828] hover:bg-[#5e1e1e] text-white p-3 rounded-full transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="p-6 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-[#7a2828] mb-6">Send Us a Message</h2>

              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-medium">
                    Thank you for your message! Our jewelry experts will get back to you shortly.
                  </p>
                </div>
              ) : null}

              {submitError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">{submitError}</p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-gray-700">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is your inquiry about?"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-700">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your jewelry needs or questions..."
                    required
                    className="mt-1 min-h-[150px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#7a2828] hover:bg-[#5e1e1e] text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>

            <div className="mt-8 p-6 bg-[#7a2828]/10 rounded-lg border border-[#7a2828]/20">
              <h3 className="text-lg font-semibold text-[#7a2828] mb-2">Jewelry Consultation</h3>
              <p className="text-gray-600 mb-4">
                Looking for a personalized jewelry consultation? Schedule an appointment with our expert jewelers for
                custom designs, engagement rings, or special occasion pieces.
              </p>
              <Button variant="outline" className="border-[#7a2828] text-[#7a2828] hover:bg-[#7a2828] hover:text-white">
                Book Appointment
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#7a2828] mb-6 text-center">Visit Our Showroom</h2>
          <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
            {/* Replace with your actual map embed */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Map Embed Goes Here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
