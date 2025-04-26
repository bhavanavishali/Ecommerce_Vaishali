

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Logo from "/logo 1.png";
// import { useDispatch } from "react-redux";
// import { useNavigate ,Link} from "react-router-dom";
// import api from '../../api'
// import { setAuthData } from "@/Redux/authslice";

// function Login() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState("");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleLogin = async (e) => {

//     e.preventDefault();
//     try {
      
//       const response = await api.post("login/", formData);
//       const { user } = response.data;
//       console.log('this is the data coming from the backend after login: ',response.data)
      
//       // Dispatch user details to Redux (without token)
//       dispatch(
//         setAuthData({
//           user: user,
//         })
//       );

//       setError("");
//       navigate("/user/home");
      
//     } catch (error) {
//       if (error.response) {
//         const errorMessage = error.response.data.error || "Invalid credentials";
//         setError(errorMessage);
//         console.error("Login error:", error.response.data);
//       } else if (error.request) {
//         setError("Network error. Please check your connection.");
//         console.error("Network error:", error.request);
//       } else {
//         setError("An unexpected error occurred.");
//         console.error("Error:", error.message);
//       }
//     }
//   };

//   return (
//     <div className="flex min-h-screen w-full">
//       {/* Left side with logo */}
//       <div className="hidden w-1/2 items-center justify-center bg-white p-8 lg:flex">
//         <img src={Logo} alt="Vaishali Gold Logo" className="max-w-md" />
//       </div>

//       {/* Right side with sign-in form */}
//       <div className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2">
//         <div className="w-full max-w-md">
//           <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">
//             Sign In
//           </h1>

//           <form onSubmit={handleLogin} className="space-y-6">
//             <div className="space-y-2">
//               <Input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="h-14 rounded-xl bg-[#f0efea] px-4"
//               />
//             </div>
//             <div className="space-y-2">
//               <Input
//                 type="password"
//                 name="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="h-14 rounded-xl bg-[#f0efea] px-4"
//               />
//             </div>

//             {error && <p className="text-red-500">{error}</p>}

//             <Button
//               type="submit"
//               className="h-14 w-full rounded-xl bg-[#8c2a2a] text-white hover:bg-[#7a2424]"
//             >
//               Sign in
//             </Button>
//           </form>

//           <div className="mt-6 text-center">
//            <Link to='/forgot-password'>Forgot Password?</Link>
              
           
//             <div className="mt-2">
//               <span className="text-gray-700">Don't have an account? </span>
//               <Link to='/signup' className="text-[#8c2a2a] hover:underline">
//                 Sign up
//               </Link>
//             </div>
//             <div className="mt-2">
//               <span className="text-gray-700">Admin Login </span>
//               <Link to='/adminLogin' className="text-[#8c2a2a] hover:underline">
//                 Admin In
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;


// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Logo from "/logo 1.png";
// import { useDispatch } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
// import api from '../../api';
// import { setAuthData } from "@/Redux/authslice";
// import { useParams } from "react-router-dom";

// function Login() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   const [email, setEmail] = useState('');
//   onst [message, setMessage] = useState('');
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.post('password/reset/', { email });
//       setMessage(response.data.message);
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.email || 'Something went wrong');
//       setMessage('');
//     }
//   };
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.post("login/", formData);
//       const { user } = response.data;
//       console.log('this is the data coming from the backend after login: ', response.data);
      
//       dispatch(
//         setAuthData({
//           user: user,
//         })
//       );

//       setError("");
//       navigate("/user/home");
//     } catch (error) {
//       if (error.response) {
//         const errorMessage = error.response.data.error || "Invalid credentials";
//         setError(errorMessage);
//         console.error("Login error:", error.response.data);
//       } else if (error.request) {
//         setError("Network error. Please check your connection.");
//         console.error("Network error:", error.request);
//       } else {
//         setError("An unexpected error occurred.");
//         console.error("Error:", error.message);
//       }
//     }
//   };


//   return (
//     <div className="flex min-h-screen w-full">
//       {/* Left side with logo */}
//       <div className="hidden w-1/2 items-center justify-center bg-white p-8 lg:flex">
//         <img src={Logo} alt="Vaishali Gold Logo" className="max-w-md" />
//       </div>

//       {/* Right side with sign-in form */}
//       <div className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2">
//         <div className="w-full max-w-md">
//           <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">
//             Sign In
//           </h1>

//           <form onSubmit={handleLogin} className="space-y-6">
//             <div className="space-y-2">
//               <Input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="h-14 rounded-xl bg-[#f0efea] px-4"
//               />
//             </div>
//             <div className="space-y-2">
//               <Input
//                 type="password"
//                 name="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="h-14 rounded-xl bg-[#f0efea] px-4"
//               />
//             </div>

//             {error && <p className="text-red-500">{error}</p>}

//             <Button
//               type="submit"
//               className="h-14 w-full rounded-xl bg-[#8c2a2a] text-white hover:bg-[#7a2424]"
//             >
//               Sign in
//             </Button>
//           </form>

//           <div className="mt-6 text-center">
//             <button 
//               onClick={() => setIsModalOpen(true)}
//               className="text-[#8c2a2a] hover:underline"
//             >
//               Forgot Password?
//             </button>

//             <div className="mt-2">
//               <span className="text-gray-700">Don't have an account? </span>
//               <Link to='/signup' className="text-[#8c2a2a] hover:underline">
//                 Sign up
//               </Link>
//             </div>
//             <div className="mt-2">
//               <span className="text-gray-700">Admin Login </span>
//               <Link to='/adminLogin' className="text-[#8c2a2a] hover:underline">
//                 Admin In
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal for Forgot Password */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl max-w-md w-full">
//             <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <Input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="h-12 rounded-xl bg-[#f0efea] px-4"
//               />
//               <div className="flex gap-2">
//                 <Button
//                   type="submit"
//                   className="h-12 w-full rounded-xl bg-[#8c2a2a] text-white hover:bg-[#7a2424]"
//                 >
//                   Submit
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="h-12 w-full rounded-xl bg-gray-500 text-white hover:bg-gray-600"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Login;





// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Logo from "/logo 1.png";
// import { useDispatch } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
// import api from '../../api';
// import { setAuthData } from "@/Redux/authslice";

// function Login() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [resetEmail, setResetEmail] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [isResetPasswordModal, setIsResetPasswordModal] = useState(false);
  
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.post("login/", formData);
//       const { user } = response.data;
//       console.log('this is the data coming from the backend after login: ', response.data);
      
//       dispatch(
//         setAuthData({
//           user: user,
//         })
//       );
//       setError("");
//       navigate("/user/home");
//     } catch (error) {
//       if (error.response) {
//         setError(error.response.data.error || "Invalid credentials");
//         console.error("Login error:", error.response.data);
//       } else if (error.request) {
//         setError("Network error. Please check your connection.");
//         console.error("Network error:", error.request);
//       } else {
//         setError("An unexpected error occurred.");
//         console.error("Error:", error.message);
//       }
//     }
//   };

//   const handleForgotPassword = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.post('password/reset/', { email: resetEmail });
//       setMessage(response.data.message);
//       setError('');
//       setIsModalOpen(false);
//       setIsResetPasswordModal(true); // Show new password modal
//     } catch (err) {
//       setError(err.response?.data?.email || 'Something went wrong');
//       setMessage('');
//     }
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     if (newPassword !== confirmPassword) {
//       setError("Passwords don't match");
//       return;
//     }
//     try {
//       const response = await api.post('password/reset/confirm/', {
//         new_password: newPassword,
//         token,
//         uidb64
//       });
//       navigate('/login')
//       console.log("new password",response.data)
//       setMessage(response.data.message); 
//       setError('');
//       // setTimeout(() => navigate('/login'), 2000);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Something went wrong');
//       setMessage('');
//     }
//   };

//   return (
//     <div className="flex min-h-screen w-full">
//       {/* Left side with logo */}
//       <div className="hidden w-1/2 items-center justify-center bg-white p-8 lg:flex">
//         <img src={Logo} alt="Vaishali Gold Logo" className="max-w-md" />
//       </div>

//       {/* Right side with sign-in form */}
//       <div className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2">
//         <div className="w-full max-w-md">
//           <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">
//             Sign In
//           </h1>

//           <form onSubmit={handleLogin} className="space-y-6">
//             <div className="space-y-2">
//               <Input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="h-14 rounded-xl bg-[#f0efea] px-4"
//               />
//             </div>
//             <div className="space-y-2">
//               <Input
//                 type="password"
//                 name="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="h-14 rounded-xl bg-[#f0efea] px-4"
//               />
//             </div>

//             {error && <p className="text-red-500">{error}</p>}

//             <Button
//               type="submit"
//               className="h-14 w-full rounded-xl bg-[#8c2a2a] text-white hover:bg-[#7a2424]"
//             >
//               Sign in
//             </Button>
//           </form>

//           <div className="mt-6 text-center">
//             <button 
//               onClick={() => setIsModalOpen(true)}
//               className="text-[#8c2a2a] hover:underline"
//             >
//               Forgot Password?
//             </button>

//             <div className="mt-2">
//               <span className="text-gray-700">Don't have an account? </span>
//               <Link to='/signup' className="text-[#8c2a2a] hover:underline">
//                 Sign up
//               </Link>
//             </div>
//             <div className="mt-2">
//               <span className="text-gray-700">Admin Login </span>
//               <Link to='/adminLogin' className="text-[#8c2a2a] hover:underline">
//                 Admin In
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal for Email Entry */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl max-w-md w-full">
//             <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
//             <form onSubmit={handleForgotPassword} className="space-y-4">
//               <Input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={resetEmail}
//                 onChange={(e) => setResetEmail(e.target.value)}
//                 className="h-12 rounded-xl bg-[#f0efea] px-4"
//               />
//               <div className="flex gap-2">
//                 <Button
//                   type="submit"
//                   className="h-12 w-full rounded-xl bg-[#8c2a2a] text-white hover:bg-[#7a2424]"
//                 >
//                   Submit
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="h-12 w-full rounded-xl bg-gray-500 text-white hover:bg-gray-600"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Modal for New Password Entry */}
//       {isResetPasswordModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl max-w-md w-full">
//             <h2 className="text-2xl font-bold mb-4">Set New Password</h2>
//             <form onSubmit={handleResetPassword} className="space-y-4">
//               <Input
//                 type="password"
//                 placeholder="Enter new password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="h-12 rounded-xl bg-[#f0efea] px-4"
//               />
//               <Input
//                 type="password"
//                 placeholder="Confirm new password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="h-12 rounded-xl bg-[#f0efea] px-4"
//               />
//               {error && <p className="text-red-500">{error}</p>}
//               {message && <p className="text-green-500">{message}</p>}
//               <div className="flex gap-2">
//                 <Button
//                   type="submit"
//                   className="h-12 w-full rounded-xl bg-[#8c2a2a] text-white hover:bg-[#7a2424]"
//                 >
//                   Reset Password
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={() => setIsResetPasswordModal(false)}
//                   className="h-12 w-full rounded-xl bg-gray-500 text-white hover:bg-gray-600"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Login;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "/logo 1.png";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import api from '../../api';
import { setAuthData } from "@/Redux/authslice";
import Swal from 'sweetalert2'; // Import SweetAlert2

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isResetPasswordModal, setIsResetPasswordModal] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }; 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("login/", formData);
      const { user } = response.data;
      console.log('this is the data coming from the backend after login: ', response.data);
      
      dispatch(
        setAuthData({
          user: user,
        })
      );
      setError("");
      navigate("/user/home");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "Invalid credentials");
        console.error("Login error:", error.response.data);
      } else if (error.request) {
        setError("Network error. Please check your connection.");
        console.error("Network error:", error.request);
      } else {
        setError("An unexpected error occurred.");
        console.error("Error:", error.message);
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('password/reset/', { email: resetEmail });
      setMessage(response.data.message);
      setError('');
      // Show SweetAlert2 popup
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Password reset link has been sent to your email',
        confirmButtonColor: '#8c2a2a',
      });
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.email || 'Something went wrong');
      setMessage('');
    
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.email || 'Something went wrong',
        confirmButtonColor: '#8c2a2a',
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      const response = await api.post('password/reset/confirm/', {
        new_password: newPassword,
        token,
        uidb64
      });
      navigate('/login')
      console.log("new password",response.data)
      setMessage(response.data.message); 
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setMessage('');
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side with logo */}
      <div className="hidden w-1/2 items-center justify-center bg-white p-8 lg:flex">
        <img src={Logo} alt="Vaishali Gold Logo" className="max-w-md" />
      </div>

      {/* Right side with sign-in form */}
      <div className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">
            Sign In
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="h-14 rounded-xl bg-[#f0efea] px-4"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="h-14 rounded-xl bg-[#f0efea] px-4"
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <Button
              type="submit"
              className="h-14 w-full rounded-xl bg-[#8c2a2a] text-white hover:bg-[#7a2424]"
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-[#8c2a2a] hover:underline"
            >
              Forgot Password?
            </button>

            <div className="mt-2">
              <span className="text-gray-700">Don't have an account? </span>
              <Link to='/signup' className="text-[#8c2a2a] hover:underline">
                Sign up
              </Link>
            </div>
           
          </div>
        </div>
      </div>

      {/* Modal for Email Entry */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="h-12 rounded-xl bg-[#f0efea] px-4"
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-[#8c2a2a] text-white hover:bg-[#7a2424]"
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-12 w-full rounded-xl bg-gray-500 text-white hover:bg-gray-600"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
