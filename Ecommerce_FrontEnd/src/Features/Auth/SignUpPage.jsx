

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from '/logo 1.png'
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import api from '../../api'
import { setAuthData } from "@/Redux/authslice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GoogleLogin } from '@react-oauth/google';
import { Alert, AlertDescription } from "@/components/ui/alert"

function SignUpPage() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    referralCode: "",
  })
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(60) // 1 minute in seconds
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    const referralToken = searchParams.get('referral_token');
    if (referralToken) {
      setFormData((prev) => ({
        ...prev,
        referralCode: referralToken,
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    let interval;
    if (showOtpDialog && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpDialog, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName.trim()) {
      tempErrors.firstName = "First name is required";
    } else if (formData.firstName.includes('.')) {
      tempErrors.firstName = "First name cannot contain a dot (.)";
    }

    if (!formData.lastName.trim()) {
      tempErrors.lastName = "Last name is required";
    } else if (formData.lastName.includes('.')) {
      tempErrors.lastName = "Last name cannot contain a dot (.)";
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }

    if (!formData.username.trim()) {
      tempErrors.username = "Username is required";
    } else if (!/^[a-zA-Z]+$/.test(formData.username)) {  
      tempErrors.username = "Username can only contain letters (no numbers or special characters)";
    }

    if (!formData.phoneNumber.trim()) {
      tempErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = "Phone number is invalid";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 5) {
      tempErrors.password = "Password must be at least 5 characters";
    } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}/.test(formData.password)) {
      tempErrors.password = "Password must contain at least one uppercase letter, one special character, one digit, and one lowercase letter";
    }

    if (formData.referralCode && !/^[A-Z0-9]{8}$/.test(formData.referralCode)) {
      tempErrors.referralCode = "Referral code must be 8 characters (uppercase letters and digits only)";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post('google/', {
        id_token: credentialResponse.credential
      });
      dispatch(
        setAuthData({
          user: response.data.user,
        })
      );
      navigate("/user/home");
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await api.post('signup/', {
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          phone_number: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
          referral_code: formData.referralCode || undefined,
        });
        
        dispatch(setAuthData(response.data));
        if (response.status === 200 || response.status === 201) {
          setShowOtpDialog(true)
          setTimer(60) // Reset timer to 1 minute
          setCanResend(false) // Disable resend button
          setOtp(["", "", "", "", "", ""]) // Reset OTP input
        }
      } catch (error) {
        if (error.response) {
          console.error('Signup failed:', error.response.data);
          setErrors(error.response.data);
        } else {
          console.error('Signup failed:', error.message);
        }
      }
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
    setOtp(newOtp)
  }

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    try {
      const response = await api.post('verify-otp/', {
        otp: enteredOtp,
        email: formData.email,
      });
      
      if (response.status === 200 || response.status === 201) {
        setShowOtpDialog(false);
        dispatch(setAuthData({ ...response.data }));
        setSuccessMessage(
          formData.referralCode 
            ? "Signup successful! You've received a $5 welcome coupon for using a referral code."
            : "Signup successful! Welcome to Vaishali Gold."
        );
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.message || "OTP verification failed");
      } else {
        alert("Failed to verify OTP. Please try again.");
      }
    }
  }

  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      const response = await api.post('resend-otp/', {
        email: formData.email,
      });
      if (response.status === 200) {
        setTimer(60); // Reset timer to 1 minute
        setCanResend(false); // Disable resend button
        setOtp(["", "", "", "", "", ""]); // Reset OTP input
        alert("New OTP sent successfully!");
      }
    } catch (error) {
      console.error("Resend OTP failed:", error);
      alert("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left column with logo */}
      <div className="hidden md:flex md:w-1/2 bg-white items-center justify-center p-8">
        <div className="max-w-md">
          <img
            src={Logo}
            alt="Vaishali Gold Logo"
            className="w-full max-w-sm mx-auto"
          />
        </div>
      </div>

      {/* Right column with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-12">Sign Up</h1>

          {successMessage && (
            <Alert className="mb-6 bg-green-100 text-green-800">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
                />
                {errors.firstName && <span className="error text-red-500">{errors.firstName}</span>}
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
                />
                {errors.lastName && <span className="error text-red-500">{errors.lastName}</span>}
              </div>
            </div>

            <div className="space-y-2">
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
              />
              {errors.email && <span className="error text-red-500">{errors.email}</span>}
            </div>

            <div className="space-y-2">
              <Input
                type="tel"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
              />
              {errors.phoneNumber && <span className="error text-red-500">{errors.phoneNumber}</span>}
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
              />
              {errors.username && <span className="error text-red-500">{errors.username}</span>}
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
                autocomplete="current-password"
              />
              {errors.password && <span className="error text-red-500">{errors.password}</span>}
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                name="referralCode"
                placeholder="Enter referral code (optional)"
                value={formData.referralCode}
                onChange={handleChange}
                className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
              />
              {errors.referralCode && <span className="error text-red-500">{errors.referralCode}</span>}
            </div>

            <Button type="submit" className="w-full h-14 rounded-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white mt-6">
              Sign Up
            </Button>
          </form>

          <div className="text-center mt-6">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-[#8c2a2a] font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log('Login Failed')}
          />
        </div>
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-md rounded-lg p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Verify Your Email</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-center mb-6">
              We've sent a 6-digit OTP to your email: {formData.email}
            </p>
            
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="h-14 w-14 text-center text-xl bg-[#f0f0ec] border-none rounded-lg"
                />
              ))}
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-gray-500">
                Time remaining: {formatTime(timer)}
              </p>
            </div>
            
            <Button 
              onClick={handleVerifyOtp} 
              className="w-full h-14 rounded-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white"
            >
              Verify & Continue
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Didn't receive the OTP? 
                <button 
                  type="button" 
                  className={`ml-1 font-medium ${canResend ? 'text-[#8c2a2a]' : 'text-gray-400 cursor-not-allowed'}`}
                  onClick={handleResendOtp}
                  disabled={!canResend}
                >
                  Resend
                </button>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SignUpPage