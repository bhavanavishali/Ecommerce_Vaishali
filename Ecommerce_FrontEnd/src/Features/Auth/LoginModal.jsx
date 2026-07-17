"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import api from "../../api"
import { setAuthData } from "@/Redux/authslice"
import { Loader2, Crown, Gem, Sparkles, Eye, EyeOff, X } from "lucide-react"
import GoogleLoginButton from "./GoogleLoginButton"

function LoginModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

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

      dispatch(
        setAuthData({
          user: user,
        }),
      )
      setError("")
      onClose()
      navigate("/user/home")
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "Invalid credentials")
      } else if (error.request) {
        setError("Network error. Please check your connection.")
      } else {
        setError("An unexpected error occurred.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-2xl">
        <div className="bg-gradient-to-br from-amber-50 via-white to-amber-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#023d12]  to-[#8b3333] p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6" />
              <DialogTitle className="text-2xl font-bold">Welcome Back</DialogTitle>
            </div>
            <p className="mt-2 opacity-90 text-sm">Sign in to your luxury account</p>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 rounded-xl bg-gradient-to-r from-amber-50 to-white px-4 border-2 border-amber-200 focus:border-[#023d12]  transition-all duration-300 text-gray-800 placeholder:text-gray-500"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="w-5 h-5 text-[#023d12]  opacity-50" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-12 rounded-xl bg-gradient-to-r from-amber-50 to-white px-4 pr-12 border-2 border-amber-200 focus:border-[#023d12]  transition-all duration-300 text-gray-800 placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#023d12]  transition-colors"
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
                className="h-12 w-full rounded-xl bg-gradient-to-r from-[#023d12]  to-[#8b3333] text-white hover:from-[#6a2323] hover:to-[#023d12]  transition-all duration-300 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="w-5 h-5" />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Google Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <GoogleLoginButton />
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-3">
              <Link
                to="/forgot-password"
                onClick={onClose}
                className="block text-[#023d12]  hover:text-[#6a2323] font-medium hover:underline transition-colors duration-200 text-sm"
              >
                Forgot Password?
              </Link>

              <div className="border-t border-amber-200 pt-3">
                <span className="text-gray-600 text-sm">Don't have an account? </span>
                <Link
                  to="/signup"
                  onClick={onClose}
                  className="text-[#023d12]  hover:text-[#6a2323] font-semibold hover:underline transition-colors duration-200 text-sm"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
