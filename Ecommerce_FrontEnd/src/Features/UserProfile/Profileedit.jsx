
"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../../api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Mail, Calendar, Save, Loader2, Copy, Share2, Ticket, Image as ImageIcon } from "lucide-react"

const ProfileEdit = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    profilePicture: null, 
  })

  const BASE_URL = import.meta.env.VITE_BASE_URL
  const [referralData, setReferralData] = useState({
    referralCode: "",
    referralLink: "",
  })
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [copiedCoupon, setCopiedCoupon] = useState(null)
  const [hoverField, setHoverField] = useState(null)
  const [previewImage, setPreviewImage] = useState(null) // For image preview
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await Promise.all([
          fetchUser(),
          fetchReferralData(),
          fetchCoupons()
        ])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await api.get("profile/")
      console.log("****************",response.data)
      const userData = response.data.user
      setUser({
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        mobile: userData.phone_number || "",
        email: userData.email || "",
        profilePicture: userData.profile_picture || null, // Set profile picture
      })
      if (userData.profile_picture) {
        setPreviewImage(`${BASE_URL}${userData.profile_picture}`) // Set preview image
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReferralData = async () => {
    try {
      const response = await api.get("referral-link/")
      setReferralData({
        referralCode: response.data.referral_code || "",
        referralLink: response.data.referral_link || "",
      })
      console.log("To check the response in the profile edit",response)
    } catch (error) {
      console.error("Error fetching referral data:", error)
    }
  }

  const fetchCoupons = async () => {
    try {
      const response = await api.get("offer/user/coupons/")
      setCoupons(response.data)
    } catch (error) {
      console.error("Error fetching coupons:", error)
      setCoupons([])
    }
  }

  const handleUpdate = async () => {
    try {
      setSaving(true)
      const formData = new FormData()
      formData.append("first_name", user.firstName)
      formData.append("last_name", user.lastName)
      formData.append("phone_number", user.mobile)
      formData.append("email", user.email)
      if (user.profilePicture && typeof user.profilePicture !== "string") {
        formData.append("profile_picture", user.profilePicture) // Append profile picture if changed
      }

      const response = await api.patch("profile/", formData,{ headers: {
    "Content-Type": "multipart/form-data", 
  },})
      if (response.status === 200) {
        setUser({
          firstName: response.data.user.first_name || "",
          lastName: response.data.user.last_name || "",
          mobile: response.data.user.phone_number || "",
          email: response.data.user.email || "",
          profilePicture: response.data.user.profile_picture || null,
        })
        setPreviewImage(response.data.user.profile_picture ? `${BASE_URL}${response.data.user.profile_picture}` : null) // Update preview
        setTimeout(() => {
          setSaving(false)
          document.getElementById("success-message").classList.remove("opacity-0")
          document.getElementById("success-message").classList.add("opacity-100")
          setTimeout(() => {
            document.getElementById("success-message").classList.remove("opacity-100")
            document.getElementById("success-message").classList.add("opacity-0")
          }, 3000)
        }, 600)
      } else {
        throw new Error("Unexpected response status")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setSaving(false)
      alert(`Failed to update profile: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleChange = (e) => {
    const { id, value, files } = e.target
    if (id === "profilePicture" && files[0]) {
      setUser((prev) => ({
        ...prev,
        profilePicture: files[0],
      }))
      setPreviewImage(URL.createObjectURL(files[0])) 
    } else {
      setUser((prev) => ({
        ...prev,
        [id]: value,
      }))
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralData.referralLink)
      .then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
      .catch((error) => console.error("Failed to copy:", error))
  }

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopiedCoupon(code)
        setTimeout(() => setCopiedCoupon(null), 2000)
      })
      .catch((error) => console.error("Failed to copy coupon:", error))
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <Card className="max-w-3xl mx-auto overflow-hidden border border-amber-200 shadow-lg">
        <div className="h-16 bg-gradient-to-r from-[#7a2828] to-[#9a3a3a]"></div>

        <CardHeader className="relative pb-2">
          <div className="absolute -top-12 left-6 w-20 h-20 rounded-full bg-gradient-to-r from-amber-200 to-amber-300 border-4 border-white flex items-center justify-center shadow-md">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-[#7a2828] text-3xl font-semibold">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </span>
            )}
          </div>

          <div className="ml-28">
            <CardTitle className="text-2xl font-bold text-[#7a2828]">Your Profile</CardTitle>
            <CardDescription className="text-amber-800">Manage your personal information, referrals, and coupons</CardDescription>
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
            <>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    className={`space-y-2 transition-all duration-300 ${hoverField === "profilePicture" ? "scale-[1.02]" : ""}`}
                    onMouseEnter={() => setHoverField("profilePicture")}
                    onMouseLeave={() => setHoverField(null)}
                  >
                    <Label htmlFor="profilePicture" className="text-amber-900 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-[#7a2828]" />
                      Profile Picture
                    </Label>
                    <Input
                      id="profilePicture"
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleChange}
                      className="w-full border-amber-300 focus:border-[#7a2828] focus:ring-[#7a2828]/20 bg-amber-50 transition-all duration-300 hover:border-[#7a2828]/70"
                    />
                  </div>

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

                  
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-amber-200">
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

              <Separator className="bg-amber-200 my-6" />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#7a2828]">Refer a Friend</h3>
                <p className="text-amber-800">Invite friends and earn a ₹10 coupon when they sign up and verify their account!</p>
                
                <div className="space-y-2">
                  <Label className="text-amber-900 flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-[#7a2828]" />
                    Your Referral Code
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={referralData.referralCode}
                      readOnly
                      className="w-full border-amber-300 bg-amber-50"
                    />
                    <Button
                      onClick={handleCopyLink}
                      className="bg-[#7a2828] hover:bg-[#9a3a3a] text-amber-100"
                      disabled={!referralData.referralLink}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {copySuccess ? "Copied!" : "Copy Link"}
                    </Button>
                  </div>
                  {referralData.referralLink && (
                    <p className="text-sm text-amber-700">Share this link: {referralData.referralLink}</p>
                  )}
                </div>
              </div>

              <Separator className="bg-amber-200 my-6" />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#7a2828]">Your Coupons</h3>
                {coupons.length === 0 ? (
                  <p className="text-amber-800">No coupons available.</p>
                ) : (
                  <div className="space-y-4">
                    {coupons.map((coupon) => (
                      <Card key={coupon.code} className="border-amber-300">
                        <CardContent className="p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Ticket className="h-6 w-6 text-[#7a2828]" />
                              <div>
                                <p className="font-semibold text-amber-900">
                                 ₹  {coupon.discount} Off
                                </p>
                                <p className="text-sm text-amber-700">
                                  Valid until {new Date(coupon.valid_to).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button
                              className="bg-[#7a2828] hover:bg-[#9a3a3a] text-amber-100"
                              onClick={() => navigate("/shop")}
                            >
                              Use Now
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              value={coupon.coupon_code}
                              readOnly
                              className="w-full border-amber-300 bg-amber-50"
                            />
                            <Button
                              onClick={() => handleCopyCoupon(coupon.coupon_code)}
                              className="bg-[#7a2828] hover:bg-[#9a3a3a] text-amber-100"
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              {copiedCoupon === coupon.coupon_code ? "Copied!" : "Copy Code"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileEdit