"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../api"

// Import ShadCN components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Mail, Calendar, Save, Loader2 } from "lucide-react"

const ProfileInfo = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    mobile: "",
    email: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hoverField, setHoverField] = useState(null)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await api.get("profile/")
      const userData = response.data
      console.log("profile details", userData)
      setUser({
        firstName: userData.user.first_name || "",
        lastName: userData.user.last_name || "",
        dob: userData.user.dob || "",
        mobile: userData.user.phone_number || "",
        email: userData.user.email || "",
      })
    } catch (error) {
      console.error("Error fetching user profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    try {
      setSaving(true)
      await api.put("profile/", user)
      setTimeout(() => {
        setSaving(false)
        // Show success message
        document.getElementById("success-message").classList.remove("opacity-0")
        document.getElementById("success-message").classList.add("opacity-100")

        // Hide success message after 3 seconds
        setTimeout(() => {
          document.getElementById("success-message").classList.remove("opacity-100")
          document.getElementById("success-message").classList.add("opacity-0")
        }, 3000)
      }, 600)
    } catch (error) {
      console.error("Error updating profile:", error)
      setSaving(false)
      alert("Failed to update profile")
    }
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setUser((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <Card className="max-w-3xl mx-auto overflow-hidden border border-amber-200 shadow-lg">
        <div className="h-16 bg-gradient-to-r from-[#7a2828] to-[#9a3a3a]"></div>

        <CardHeader className="relative pb-2">
          <div className="absolute -top-12 left-6 w-20 h-20 rounded-full bg-gradient-to-r from-amber-200 to-amber-300 border-4 border-white flex items-center justify-center shadow-md">
            <span className="text-[#7a2828] text-3xl font-semibold">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </span>
          </div>

          <div className="ml-28">
            <CardTitle className="text-2xl font-bold text-[#7a2828]">Your Profile</CardTitle>
            <CardDescription className="text-amber-800">Manage your personal information</CardDescription>
          </div>

          <div
            id="success-message"
            className="absolute right-6 top-4 bg-green-100 text-green-800 px-4 py-2 rounded-md transition-opacity duration-500 opacity-0"
          >
            Profile updated successfully!
          </div>
        </CardHeader>

        <Separator className="bg-amber-200" />

        <CardContent className="pt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-[#7a2828] animate-spin mb-2" />
              <p className="text-amber-800">Loading your profile...</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={`space-y-2 transition-all duration-300 ${hoverField === "firstName" ? "scale-[1.02]" : ""}`}
                  onMouseEnter={() => setHoverField("firstName")}
                  onMouseLeave={() => setHoverField(null)}
                >
                  <Label htmlFor="firstName" className="text-amber-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-[#7a2828]" />
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                    className="w-full border-amber-300 focus:border-[#7a2828] focus:ring-[#7a2828]/20 bg-amber-50 transition-all duration-300 hover:border-[#7a2828]/70"
                  />
                </div>

                <div
                  className={`space-y-2 transition-all duration-300 ${hoverField === "lastName" ? "scale-[1.02]" : ""}`}
                  onMouseEnter={() => setHoverField("lastName")}
                  onMouseLeave={() => setHoverField(null)}
                >
                  <Label htmlFor="lastName" className="text-amber-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-[#7a2828]" />
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={user.lastName}
                    onChange={handleChange}
                    className="w-full border-amber-300 focus:border-[#7a2828] focus:ring-[#7a2828]/20 bg-amber-50 transition-all duration-300 hover:border-[#7a2828]/70"
                  />
                </div>

                <div
                  className={`space-y-2 transition-all duration-300 ${hoverField === "mobile" ? "scale-[1.02]" : ""}`}
                  onMouseEnter={() => setHoverField("mobile")}
                  onMouseLeave={() => setHoverField(null)}
                >
                  <Label htmlFor="mobile" className="text-amber-900 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#7a2828]" />
                    Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    value={user.mobile}
                    onChange={handleChange}
                    className="w-full border-amber-300 focus:border-[#7a2828] focus:ring-[#7a2828]/20 bg-amber-50 transition-all duration-300 hover:border-[#7a2828]/70"
                  />
                </div>

                <div
                  className={`space-y-2 transition-all duration-300 ${hoverField === "dob" ? "scale-[1.02]" : ""}`}
                  onMouseEnter={() => setHoverField("dob")}
                  onMouseLeave={() => setHoverField(null)}
                >
                  <Label htmlFor="dob" className="text-amber-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#7a2828]" />
                    Date of Birth
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={user.dob}
                    onChange={handleChange}
                    className="w-full border-amber-300 focus:border-[#7a2828] focus:ring-[#7a2828]/20 bg-amber-50 transition-all duration-300 hover:border-[#7a2828]/70"
                  />
                </div>

                <div
                  className={`space-y-2 md:col-span-2 transition-all duration-300 ${hoverField === "email" ? "scale-[1.02]" : ""}`}
                  onMouseEnter={() => setHoverField("email")}
                  onMouseLeave={() => setHoverField(null)}
                >
                  <Label htmlFor="email" className="text-amber-900 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#7a2828]" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    className="w-full border-amber-300 focus:border-[#7a2828] focus:ring-[#7a2828]/20 bg-amber-50 transition-all duration-300 hover:border-[#7a2828]/70"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-amber-200">
                <Link
                  to="/forgot-password"
                  className="text-[#7a2828] hover:text-[#9a3a3a] transition-all duration-300 hover:underline decoration-amber-400 decoration-2 underline-offset-4 mb-4 sm:mb-0"
                >
                  Forgot Password?
                </Link>

                <Button
                  type="button"
                  className="bg-[#7a2828] hover:bg-[#9a3a3a] text-amber-100 shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-2 px-6"
                  onClick={handleUpdate}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Update Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileInfo



