
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "/logo 1.png"
import { useDispatch } from "react-redux"
import { useNavigate, Link, useParams } from "react-router-dom"
import api from "../../api"
import { setAuthData } from "@/Redux/authslice"
import Swal from "sweetalert2"
import { Loader2, Crown, Gem, Sparkles } from "lucide-react"

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isResetPasswordModal, setIsResetPasswordModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token, uidb64 } = useParams()

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await api.post("login/", formData)
      const { user } = response.data
      console.log("this is the data coming from the backend after login: ", response.data)

      dispatch(
        setAuthData({
          user: user,
        }),
      )
      setError("")
      navigate("/user/home")
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "Invalid credentials")
        console.error("Login error:", error.response.data)
      } else if (error.request) {
        setError("Network error. Please check your connection.")
        console.error("Network error:", error.request)
      } else {
        setError("An unexpected error occurred.")
        console.error("Error:", error.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post("password/reset/", { email: resetEmail })
      setMessage(response.data.message)
      setError("")
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Password reset link has been sent to your email",
        confirmButtonColor: "#7a2828",
      })
      setIsModalOpen(false)
    } catch (err) {
      setError(err.response?.data?.email || "Something went wrong")
      setMessage("")

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.email || "Something went wrong",
        confirmButtonColor: "#7a2828",
      })
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match")
      return
    }
    try {
      const response = await api.post("password/reset/confirm/", {
        new_password: newPassword,
        token,
        uidb64,
      })
      navigate("/login")
      console.log("new password", response.data)
      setMessage(response.data.message)
      setError("")
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong")
      setMessage("")
    }
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-[#7a2828] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <Crown className="w-8 h-8 text-[#7a2828] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="flex items-center justify-center gap-2 text-[#7a2828] font-semibold text-lg">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>Loading Luxury Experience</span>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <Gem className="w-16 h-16 text-[#7a2828] animate-pulse" />
      </div>
      <div className="absolute top-20 right-20 opacity-20">
        <Crown className="w-12 h-12 text-[#7a2828] animate-pulse" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-20">
        <Sparkles className="w-14 h-14 text-[#7a2828] animate-pulse" />
      </div>

      <div className="flex min-h-screen w-full relative z-10">
        {/* Left side with logo */}
        <div className="hidden lg:flex w-1/2 items-center justify-center p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7a2828]/5 to-amber-100/30 backdrop-blur-sm"></div>
          <div className="relative z-10 text-center">
            <div className="mb-8 p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-200">
              <img src={Logo || "/placeholder.svg"} alt="Vaishali Gold Logo" className="max-w-md mx-auto" />
            </div>
            <div className="flex items-center justify-center gap-3 text-[#7a2828] font-semibold text-xl">
              <Crown className="w-6 h-6" />
              <span>Premium Gold Jewelry</span>
              <Crown className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Right side with sign-in form */}
        <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-block p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200">
                <img src={Logo || "/placeholder.svg"} alt="Vaishali Gold Logo" className="max-w-32 mx-auto" />
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-200 p-6 sm:p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Gem className="w-8 h-8 text-[#7a2828]" />
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#7a2828]">Welcome Back</h1>
                  <Gem className="w-8 h-8 text-[#7a2828]" />
                </div>
                <p className="text-gray-600 font-medium">Sign in to your luxury account</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-14 rounded-xl bg-gradient-to-r from-amber-50 to-white px-4 border-2 border-amber-200 focus:border-[#7a2828] transition-all duration-300 text-gray-800 placeholder:text-gray-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Sparkles className="w-5 h-5 text-[#7a2828] opacity-50" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-14 rounded-xl bg-gradient-to-r from-amber-50 to-white px-4 border-2 border-amber-200 focus:border-[#7a2828] transition-all duration-300 text-gray-800 placeholder:text-gray-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Crown className="w-5 h-5 text-[#7a2828] opacity-50" />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-14 w-full rounded-xl bg-gradient-to-r from-[#7a2828] to-[#8b3333] text-white hover:from-[#6a2323] hover:to-[#7a2828] transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5" />
                      <span>Sign In</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center space-y-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-[#7a2828] hover:text-[#6a2323] font-medium hover:underline transition-colors duration-200"
                >
                  Forgot Password?
                </button>

                <div className="border-t border-amber-200 pt-4">
                  <span className="text-gray-600">Don't have an account? </span>
                  <Link
                    to="/signup"
                    className="text-[#7a2828] hover:text-[#6a2323] font-semibold hover:underline transition-colors duration-200"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal for Email Entry */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-amber-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#7a2828] to-[#8b3333] p-6 text-white">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Reset Password</h2>
              </div>
              <p className="mt-2 opacity-90">Enter your email to receive reset instructions</p>
            </div>

            <div className="p-6">
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="h-12 rounded-xl bg-gradient-to-r from-amber-50 to-white px-4 border-2 border-amber-200 focus:border-[#7a2828] transition-all duration-300"
                  />
                  <Sparkles className="w-5 h-5 text-[#7a2828] opacity-50 absolute right-3 top-1/2 transform -translate-y-1/2" />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="h-12 flex-1 rounded-xl bg-gradient-to-r from-[#7a2828] to-[#8b3333] text-white hover:from-[#6a2323] hover:to-[#7a2828] transition-all duration-300 font-semibold"
                  >
                    Send Reset Link
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="h-12 flex-1 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
