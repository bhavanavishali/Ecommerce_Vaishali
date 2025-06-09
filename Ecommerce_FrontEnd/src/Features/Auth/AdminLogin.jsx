import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "/logo 1.png";
import { useDispatch } from "react-redux";
import { useNavigate ,Link} from "react-router-dom";
import api from '../../api'
import { setAuthData } from "@/Redux/authslice";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

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
      console.log(formData)
      const response = await api.post("adminlogin/", formData);
      const { user } = response.data;
      console.log('this is the data coming from the backend after login: ',response.data)
      
      
      dispatch(
        setAuthData({
          user: user,
        })
      );

      setError("");
      navigate("/dashboard");
      
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || "Invalid credentials";
        setError(errorMessage);
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
            Admin SignIn
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
            <a href="#" className="text-[#8c2a2a] hover:underline">
              Forgot Password?
            </a>
            <div className="mt-2">
              <span className="text-gray-700">Don't have an account? </span>
              <Link to='/' className="text-[#8c2a2a] hover:underline">
                Sign up
              </Link>
            </div>
            <div className="mt-2">
              <span className="text-gray-700">Admin Login </span>
              <Link to='/login' className="text-[#8c2a2a] hover:underline">
                User In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
