
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
import { Loader2, Sparkles, Eye, EyeOff ,ShieldCheck, Lock, Truck } from "lucide-react"
import GoogleLoginButton from "./GoogleLoginButton"

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
  const [showPassword, setShowPassword] = useState(false)

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
      <div className="fixed inset-0 bg-gradient-to-br from-[#FFFDF7] via-[#FFF7E6] to-[#FFFFFF] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-[#0B3D2E] border-t-transparent rounded-full animate-spin mx-auto"></div>
            
          </div>
          <div className="flex items-center justify-center gap-2 text-[#0B3D2E] font-semibold text-lg">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>Loading Luxury Experience</span>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF7] via-[#FFF7E6] to-[#FFFFFF] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 opacity-20">
       
      </div>
      <div className="absolute top-20 right-20 opacity-20">
       
      </div>
      <div className="absolute bottom-20 left-20 opacity-20">
        <Sparkles className="w-14 h-14 text-[#0B3D2E] animate-pulse" />
      </div>

      <div className="flex min-h-screen w-full relative z-10">
        {/* Left side with logo */}
        <div className="hidden lg:flex w-1/2 items-center justify-center p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#023d12] /5 to-amber-100/30 backdrop-blur-sm"></div>
          <div className="relative z-15 text-center">
            {/* <div className="mb-8 p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-200"> */}
              <img src={Logo || "/placeholder.svg"} alt="Vaishali Gold Logo" className="max-w-md mx-auto" />
            {/* </div> */}
            
          </div>
        </div>

        {/* Right side with sign-in form */}
        <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              {/* <div className="inline-block p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200"> */}
                <img src={Logo || "/placeholder.svg"} alt="Vaishali Gold Logo" className="max-w-32 mx-auto" />
              {/* </div> */}
            </div>

            <div className="bg-[rgba(255,255,255,0.95)] backdrop-blur-[16px] rounded-2xl sm:rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-5 sm:p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                 
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B3D2E]">Welcome Back</h1>
                
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
                      className="h-12 sm:h-14 rounded-2xl border border-[#E5C96A] bg-white focus:ring-2 focus:ring-[#0B3D2E] px-14 text-base sm:text-lg"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Sparkles className="w-5 h-5 text-[#0B3D2E] opacity-50" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12 sm:h-14 rounded-2xl border border-[#E5C96A] bg-white focus:ring-2 focus:ring-[#0B3D2E] px-14 text-base sm:text-lg pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0B3D2E] opacity-50 hover:opacity-70 transition-opacity"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
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
  className="group relative h-12 sm:h-14 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B3D2E] via-[#14532D] to-[#8B6B1F] text-base sm:text-lg font-semibold tracking-wide text-white shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
>
  {/* Shine Effect */}
  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span>

  {/* Content */}
  <span className="relative flex items-center justify-center gap-3">
    {isSubmitting ? (
      <>
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Signing In...</span>
      </>
    ) : (
      <>
        
        <span>Sign In</span>
      </>
    )}
  </span>
</Button>
              </form>

              <div className="mt-8 text-center space-y-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-[#023d12]  hover:text-[#6a2323] font-medium hover:underline transition-colors duration-200"
                >
                  Forgot Password?
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-amber-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-600 font-medium">Or continue with</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-full">
                    <GoogleLoginButton />
                  </div>
                </div>

                <div className="border-t border-amber-200 pt-4">
                  <span className="text-gray-600">Don't have an account? </span>
                  <Link
                    to="/signup"
                    className="text-[#023d12]  hover:text-[#6a2323] font-semibold hover:underline transition-colors duration-200"
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
            <div className="bg-gradient-to-r from-[#023d12]  to-[#8b3333] p-6 text-white">
              <div className="flex items-center gap-3">
                
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
                    className="h-12 rounded-xl bg-gradient-to-r from-amber-50 to-white px-4 border-2 border-amber-200 focus:border-[#023d12]  transition-all duration-300"
                  />
                  <Sparkles className="w-5 h-5 text-[#023d12]  opacity-50 absolute right-3 top-1/2 transform -translate-y-1/2" />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="h-12 flex-1 rounded-xl bg-gradient-to-r from-[#023d12]  to-[#8b3333] text-white hover:from-[#6a2323] hover:to-[#023d12]  transition-all duration-300 font-semibold"
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
