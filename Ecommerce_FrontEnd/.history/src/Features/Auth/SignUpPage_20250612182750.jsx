

// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import Logo from '/logo 1.png'
// import { useNavigate, Link, useSearchParams } from "react-router-dom"
// import { useDispatch } from "react-redux"
// import api from '../../api'
// import { setAuthData } from "@/Redux/authslice"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { GoogleLogin } from '@react-oauth/google';
// import { Alert, AlertDescription } from "@/components/ui/alert"

// function SignUpPage() {
//   const [searchParams] = useSearchParams();
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     username: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//     referralCode: "",
//   })
//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [showOtpDialog, setShowOtpDialog] = useState(false)
//   const [otp, setOtp] = useState(["", "", "", "", "", ""])
//   const [timer, setTimer] = useState(60) // 1 minute in seconds
//   const [canResend, setCanResend] = useState(false)

//   useEffect(() => {
//     const referralToken = searchParams.get('referral_token');
//     if (referralToken) {
//       setFormData((prev) => ({
//         ...prev,
//         referralCode: referralToken,
//       }));
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     let interval;
//     if (showOtpDialog && timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => {
//           if (prev <= 1) {
//             setCanResend(true);
//             clearInterval(interval);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [showOtpDialog, timer]);

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const validate = () => {
//     let tempErrors = {};
//     if (!formData.firstName.trim()) {
//       tempErrors.firstName = "First name is required";
//     } else if (formData.firstName.includes('.')) {
//       tempErrors.firstName = "First name cannot contain a dot (.)";
//     }

//     if (!formData.lastName.trim()) {
//       tempErrors.lastName = "Last name is required";
//     } else if (formData.lastName.includes('.')) {
//       tempErrors.lastName = "Last name cannot contain a dot (.)";
//     }

//     if (!formData.email.trim()) {
//       tempErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       tempErrors.email = "Email is invalid";
//     }

//     if (!formData.username.trim()) {
//       tempErrors.username = "Username is required";
//     } else if (!/^[a-zA-Z]+$/.test(formData.username)) {  
//       tempErrors.username = "Username can only contain letters (no numbers or special characters)";
//     }

//     if (!formData.phoneNumber.trim()) {
//       tempErrors.phoneNumber = "Phone number is required";
//     } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
//       tempErrors.phoneNumber = "Phone number is invalid";
//     }

//     if (!formData.password) {
//       tempErrors.password = "Password is required";
//     } else if (formData.password.length < 5) {
//       tempErrors.password = "Password must be at least 5 characters";
//     } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}/.test(formData.password)) {
//       tempErrors.password = "Password must contain at least one uppercase letter, one special character, one digit, and one lowercase letter";
//     }

//     if (formData.referralCode && !/^[A-Z0-9]{8}$/.test(formData.referralCode)) {
//       tempErrors.referralCode = "Referral code must be 8 characters (uppercase letters and digits only)";
//     }

//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleSuccess = async (credentialResponse) => {
//     try {
//       const response = await api.post('google/', {
//         id_token: credentialResponse.credential
//       });
//       dispatch(
//         setAuthData({
//           user: response.data.user,
//         })
//       );
//       navigate("/user/home");
//     } catch (error) {
//       console.error('Google login failed:', error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validate()) {
//       try {
//         const response = await api.post('signup/', {
//           first_name: formData.firstName,
//           last_name: formData.lastName,
//           username: formData.username,
//           phone_number: formData.phoneNumber,
//           email: formData.email,
//           password: formData.password,
//           referral_code: formData.referralCode || undefined,
//         });
        
//         dispatch(setAuthData(response.data));
//         if (response.status === 200 || response.status === 201) {
//           setShowOtpDialog(true)
//           setTimer(60) 
//           setCanResend(false) 
//           setOtp(["", "", "", "", "", ""]) // Reset OTP input
//         }
//       } catch (error) {
//         if (error.response) {
//           console.error('Signup failed:', error.response.data);
//           setErrors(error.response.data);
//         } else {
//           console.error('Signup failed:', error.message);
//         }
//       }
//     }
//   };

//   const handleOtpChange = (index, value) => {
//     if (value && !/^\d*$/.test(value)) return
//     const newOtp = [...otp]
//     newOtp[index] = value
//     if (value && index < 5) {
//       const nextInput = document.getElementById(`otp-${index + 1}`)
//       if (nextInput) nextInput.focus()
//     }
//     setOtp(newOtp)
//   }

//   const handleVerifyOtp = async () => {
//     const enteredOtp = otp.join("");
//     try {
//       const response = await api.post('verify-otp/', {
//         otp: enteredOtp,
//         email: formData.email,
//       });
      
//       if (response.status === 200 || response.status === 201) {
//         setShowOtpDialog(false);
//         dispatch(setAuthData({ ...response.data }));
//         setSuccessMessage(
//           formData.referralCode 
//             ? "Signup successful! You've received a $5 welcome coupon for using a referral code."
//             : "Signup successful! Welcome to Vaishali Gold."
//         );
//         setTimeout(() => {
//           navigate('/login');
//         }, 3000);
//       } else {
//         alert("Invalid OTP. Please try again.");
//       }
//     } catch (error) {
//       console.error("OTP verification failed:", error);
//       if (error.response && error.response.data) {
//         alert(error.response.data.message || "OTP verification failed");
//       } else {
//         alert("Failed to verify OTP. Please try again.");
//       }
//     }
//   }

//   const handleResendOtp = async () => {
//     if (!canResend) return;
//     try {
//       const response = await api.post('resend-otp/', {
//         email: formData.email,
//       });
//       if (response.status === 200) {
//         setTimer(60); // Reset timer to 1 minute
//         setCanResend(false); // Disable resend button
//         setOtp(["", "", "", "", "", ""]); // Reset OTP input
//         alert("New OTP sent successfully!");
//       }
//     } catch (error) {
//       console.error("Resend OTP failed:", error);
//       alert("Failed to resend OTP. Please try again.");
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Left column with logo */}
//       <div className="hidden md:flex md:w-1/2 bg-white items-center justify-center p-8">
//         <div className="max-w-md">
//           <img
//             src={Logo}
//             alt="Vaishali Gold Logo"
//             className="w-full max-w-sm mx-auto"
//           />
//         </div>
//       </div>

//       {/* Right column with form */}
//       <div className="w-full md:w-1/2 flex items-center justify-center p-8">
//         <div className="w-full max-w-md">
//           <h1 className="text-4xl font-bold mb-12">Sign Up</h1>

//           {successMessage && (
//             <Alert className="mb-6 bg-green-100 text-green-800">
//               <AlertDescription>{successMessage}</AlertDescription>
//             </Alert>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Input
//                   type="text"
//                   name="firstName"
//                   placeholder="First name"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
//                 />
//                 {errors.firstName && <span className="error text-red-500">{errors.firstName}</span>}
//               </div>

//               <div className="space-y-2">
//                 <Input
//                   type="text"
//                   name="lastName"
//                   placeholder="Last name"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
//                 />
//                 {errors.lastName && <span className="error text-red-500">{errors.lastName}</span>}
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
//               />
//               {errors.email && <span className="error text-red-500">{errors.email}</span>}
//             </div>

//             <div className="space-y-2">
//               <Input
//                 type="tel"
//                 name="phoneNumber"
//                 placeholder="Enter your phone number"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
//               />
//               {errors.phoneNumber && <span className="error text-red-500">{errors.phoneNumber}</span>}
//             </div>

//             <div className="space-y-2">
//               <Input
//                 type="text"
//                 name="username"
//                 placeholder="Enter your username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
//               />
//               {errors.username && <span className="error text-red-500">{errors.username}</span>}
//             </div>

//             <div className="space-y-2">
//               <Input
//                 type="password"
//                 name="password"
//                 placeholder="Enter password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
//                 autocomplete="current-password"
//               />
//               {errors.password && <span className="error text-red-500">{errors.password}</span>}
//             </div>

//             <div className="space-y-2">
//               <Input
//                 type="text"
//                 name="referralCode"
//                 placeholder="Enter referral code (optional)"
//                 value={formData.referralCode}
//                 onChange={handleChange}
//                 className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
//               />
//               {errors.referralCode && <span className="error text-red-500">{errors.referralCode}</span>}
//             </div>

//             <Button type="submit" className="w-full h-14 rounded-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white mt-6">
//               Sign Up
//             </Button>
//           </form>

//           <div className="text-center mt-6">
//             <p>
//               Already have an account?{" "}
//               <Link to="/login" className="text-[#8c2a2a] font-medium">
//                 Sign in
//               </Link>
//             </p>
//           </div>

//           <div className="relative my-8">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">Or continue with</span>
//             </div>
//           </div>

//           <GoogleLogin
//             onSuccess={handleSuccess}
//             onError={() => console.log('Login Failed')}
//           />
//         </div>
//       </div>

//       {/* OTP Verification Dialog */}
//       <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
//         <DialogContent className="sm:max-w-md rounded-lg p-6 bg-white">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold text-center">Verify Your Email</DialogTitle>
//           </DialogHeader>
//           <div className="py-6">
//             <p className="text-center mb-6">
//               We've sent a 6-digit OTP to your email: {formData.email}
//             </p>
            
//             <div className="flex justify-center gap-2 mb-6">
//               {otp.map((digit, index) => (
//                 <Input
//                   key={index}
//                   id={`otp-${index}`}
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={1}
//                   value={digit}
//                   onChange={(e) => handleOtpChange(index, e.target.value)}
//                   className="h-14 w-14 text-center text-xl bg-[#f0f0ec] border-none rounded-lg"
//                 />
//               ))}
//             </div>

//             <div className="text-center mb-4">
//               <p className="text-sm text-gray-500">
//                 Time remaining: {formatTime(timer)}
//               </p>
//             </div>
            
//             <Button 
//               onClick={handleVerifyOtp} 
//               className="w-full h-14 rounded-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white"
//             >
//               Verify & Continue
//             </Button>
            
//             <div className="text-center mt-4">
//               <p className="text-sm text-gray-500">
//                 Didn't receive the OTP? 
//                 <button 
//                   type="button" 
//                   className={`ml-1 font-medium ${canResend ? 'text-[#8c2a2a]' : 'text-gray-400 cursor-not-allowed'}`}
//                   onClick={handleResendOtp}
//                   disabled={!canResend}
//                 >
//                   Resend
//                 </button>
//               </p>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// export default SignUpPage
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "/logo 1.png"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import api from "../../api"
import { setAuthData } from "@/Redux/authslice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GoogleLogin } from "@react-oauth/google"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Crown, Gem, Sparkles, Diamond, GemIcon } from "lucide-react"

function SignUpPage() {
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    referralCode: "",
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(60) // 1 minute in seconds
  const [canResend, setCanResend] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const referralToken = searchParams.get("referral_token")
    if (referralToken) {
      setFormData((prev) => ({
        ...prev,
        referralCode: referralToken,
      }))
    }
  }, [searchParams])

  useEffect(() => {
    let interval
    if (showOtpDialog && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [showOtpDialog, timer])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validate = () => {
    const tempErrors = {}
    if (!formData.firstName.trim()) {
      tempErrors.firstName = "First name is required"
    } else if (formData.firstName.includes(".")) {
      tempErrors.firstName = "First name cannot contain a dot (.)"
    }

    if (!formData.lastName.trim()) {
      tempErrors.lastName = "Last name is required"
    } else if (formData.lastName.includes(".")) {
      tempErrors.lastName = "Last name cannot contain a dot (.)"
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid"
    }

    if (!formData.username.trim()) {
      tempErrors.username = "Username is required"
    } else if (!/^[a-zA-Z]+$/.test(formData.username)) {
      tempErrors.username = "Username can only contain letters (no numbers or special characters)"
    }

    if (!formData.phoneNumber.trim()) {
      tempErrors.phoneNumber = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = "Phone number is invalid"
    }

    if (!formData.password) {
      tempErrors.password = "Password is required"
    } else if (formData.password.length < 5) {
      tempErrors.password = "Password must be at least 5 characters"
    } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}/.test(formData.password)) {
      tempErrors.password =
        "Password must contain at least one uppercase letter, one special character, one digit, and one lowercase letter"
    }

    if (formData.referralCode && !/^[A-Z0-9]{8}$/.test(formData.referralCode)) {
      tempErrors.referralCode = "Referral code must be 8 characters (uppercase letters and digits only)"
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post("google/", {
        id_token: credentialResponse.credential,
      })
      dispatch(
        setAuthData({
          user: response.data.user,
        }),
      )
      navigate("/user/home")
    } catch (error) {
      console.error("Google login failed:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validate()) {
      setIsSubmitting(true)
      try {
        const response = await api.post("signup/", {
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          phone_number: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
          referral_code: formData.referralCode || undefined,
        })

        dispatch(setAuthData(response.data))
        if (response.status === 200 || response.status === 201) {
          setShowOtpDialog(true)
          setTimer(60)
          setCanResend(false)
          setOtp(["", "", "", "", "", ""]) // Reset OTP input
        }
      } catch (error) {
        if (error.response) {
          console.error("Signup failed:", error.response.data)
          setErrors(error.response.data)
        } else {
          console.error("Signup failed:", error.message)
        }
      } finally {
        setIsSubmitting(false)
      }
    }
  }

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
    const enteredOtp = otp.join("")
    try {
      const response = await api.post("verify-otp/", {
        otp: enteredOtp,
        email: formData.email,
      })

      if (response.status === 200 || response.status === 201) {
        setShowOtpDialog(false)
        dispatch(setAuthData({ ...response.data }))
        setSuccessMessage(
          formData.referralCode
            ? "Signup successful! You've received a $5 welcome coupon for using a referral code."
            : "Signup successful! Welcome to Vaishali Gold.",
        )
        setTimeout(() => {
          navigate("/login")
        }, 3000)
      } else {
        alert("Invalid OTP. Please try again.")
      }
    } catch (error) {
      console.error("OTP verification failed:", error)
      if (error.response && error.response.data) {
        alert(error.response.data.message || "OTP verification failed")
      } else {
        alert("Failed to verify OTP. Please try again.")
      }
    }
  }

  const handleResendOtp = async () => {
    if (!canResend) return
    try {
      const response = await api.post("resend-otp/", {
        email: formData.email,
      })
      if (response.status === 200) {
        setTimer(60) // Reset timer to 1 minute
        setCanResend(false) // Disable resend button
        setOtp(["", "", "", "", "", ""]) // Reset OTP input
        alert("New OTP sent successfully!")
      }
    } catch (error) {
      console.error("Resend OTP failed:", error)
      alert("Failed to resend OTP. Please try again.")
    }
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-[#023d12]  border-t-transparent rounded-full animate-spin mx-auto"></div>
            <Crown className="w-8 h-8 text-[#023d12]  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="flex items-center justify-center gap-2 text-[#023d12]  font-semibold text-lg">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>Creating Your Luxury Experience</span>
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
        <Gem className="w-16 h-16 text-[#023d12]  animate-pulse" />
      </div>
      <div className="absolute top-20 right-20 opacity-20">
        <Crown className="w-12 h-12 text-[#023d12]  animate-pulse" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-20">
        <Sparkles className="w-14 h-14 text-[#023d12]  animate-pulse" />
      </div>
      <div className="absolute bottom-40 right-40 opacity-20">
        <Diamond className="w-10 h-10 text-[#023d12]  animate-pulse" />
      </div>

      <div className="flex min-h-screen">
        {/* Left column with logo */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#023d12] /5 to-amber-100/30 backdrop-blur-sm"></div>
          <div className="relative z-10 text-center">
            <div className="mb-8 p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-200">
              <img src={Logo || "/placeholder.svg"} alt="Vaishali Gold Logo" className="max-w-md mx-auto" />
            </div>
            <div className="flex items-center justify-center gap-3 text-[#023d12]  font-semibold text-xl">
              <Crown className="w-6 h-6" />
              <span>Premium Gold Jewelry</span>
              <Crown className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Right column with form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
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
                  <Gem className="w-8 h-8 text-[#023d12] " />
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#023d12] ">Create Account</h1>
                  <Gem className="w-8 h-8 text-[#023d12] " />
                </div>
                <p className="text-gray-600 font-medium">Join our exclusive jewelry collection</p>
              </div>

              {successMessage && (
                <Alert className="mb-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <AlertDescription className="text-green-800 font-medium">{successMessage}</AlertDescription>
                  </div>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="h-12 rounded-xl bg-gradient-to-r from-amber-50 to-white px-4 border-2 border-amber-200 focus:border-[#023d12]  transition-all duration-300"
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="h-12 rounded-xl bg-gradient-to-r from-amber-50 to-white px-4 border-2 border-amber-200 focus:border-[#023d12]  transition-all duration-300"
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-gradient-to-r from-amber-50 to-white px-4 border-2 border-amber-200 focus:border-[#023d12]  transition-all duration-300"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Sparkles className="w-5 h-5 text-[#023d12]  opacity-50" />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Enter your phone number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-gradient-to-r from-amber-50 to-white px-4 border-2 border-amber-200 focus:border-[#023d12]  transition-all duration-300"
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phoneNumber}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-gradient-to-r from-amber-50 to-white px-4 border-2 border-amber-200 focus:border-[#023d12]  transition-all duration-300"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Crown className="w-5 h-5 text-[#023d12]  opacity-50" />
                    </div>
                    {errors.username && <p className="text-red-500 text-xs mt-1 ml-1">{errors.username}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-gradient-to-r from-amber-50 to-white px-4 border-2 border-amber-200 focus:border-[#023d12]  transition-all duration-300"
                      autoComplete="current-password"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <GemIcon className="w-5 h-5 text-[#023d12]  opacity-50" />
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type="text"
                      name="referralCode"
                      placeholder="Enter referral code (optional)"
                      value={formData.referralCode}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-gradient-to-r from-amber-50 to-white px-4 border-2 border-amber-200 focus:border-[#023d12]  transition-all duration-300"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Diamond className="w-5 h-5 text-[#023d12]  opacity-50" />
                    </div>
                    {errors.referralCode && <p className="text-red-500 text-xs mt-1 ml-1">{errors.referralCode}</p>}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#023d12]  to-[#8b3333] text-white hover:from-[#6a2323] hover:to-[#023d12]  transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg mt-6 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5" />
                      <span>Sign Up</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#023d12]  hover:text-[#6a2323] font-semibold hover:underline transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-amber-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-600 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-full">
                  <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => console.log("Login Failed")}
                    shape="pill"
                    theme="filled_black"
                    size="large"
                    width="100%"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 bg-white overflow-hidden border border-amber-200 shadow-2xl">
          <div className="bg-gradient-to-r from-[#023d12]  to-[#8b3333] p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 justify-center">
                <Sparkles className="w-6 h-6" />
                <span>Verify Your Email</span>
              </DialogTitle>
            </DialogHeader>
            <p className="text-center mt-2 opacity-90">We've sent a 6-digit OTP to your email</p>
            <p className="text-center text-amber-200 font-medium text-sm mt-1">{formData.email}</p>
          </div>

          <div className="p-6">
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
                  className="h-14 w-12 text-center text-xl font-bold bg-gradient-to-r from-amber-50 to-white border-2 border-amber-200 focus:border-[#023d12]  rounded-lg"
                />
              ))}
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                <div
                  className={`w-2 h-2 rounded-full ${timer > 10 ? "bg-green-500" : "bg-red-500"} animate-pulse`}
                ></div>
                <p className="text-sm font-medium text-gray-700">Time remaining: {formatTime(timer)}</p>
              </div>
            </div>

            <Button
              onClick={handleVerifyOtp}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#023d12]  to-[#8b3333] text-white hover:from-[#6a2323] hover:to-[#023d12]  transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Verify & Continue</span>
              </div>
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Didn't receive the OTP?
                <button
                  type="button"
                  className={`ml-1 font-medium ${canResend ? "text-[#023d12]  hover:text-[#6a2323] hover:underline" : "text-gray-400 cursor-not-allowed"}`}
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
