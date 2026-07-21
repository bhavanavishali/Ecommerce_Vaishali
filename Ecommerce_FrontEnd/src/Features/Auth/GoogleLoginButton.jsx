import { GoogleLogin } from '@react-oauth/google';
import api from '../../api'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthData } from "@/Redux/authslice";
import Swal from "sweetalert2";
 
function GoogleLoginButton() {
  const dispatch = useDispatch();
    const navigate = useNavigate();
  const handleSuccess = async (credentialResponse) => {
    try {
      // Send ID token to your backend
      const response = await api.post('google/', {
        id_token: credentialResponse.credential
      });
      // const user = response.data;
     
      dispatch(
        setAuthData({
          user: response.data.user,
        })
      );
      console.log("dispatched to redux",response.data.user)
      
      // Show welcome popup
      await Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: `Welcome back, ${response.data.user.username || response.data.user.email}!`,
        confirmButtonColor: "#0B3D2E",
        timer: 3000,
        timerProgressBar: true,
      });
      
      navigate("/user/home");
      
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log('Login Failed')}
    />
  );
}
export default GoogleLoginButton
