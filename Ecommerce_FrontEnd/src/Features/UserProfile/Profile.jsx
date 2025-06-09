

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import { User, Mail, MapPin, Wallet, CreditCard } from "lucide-react";
// import api from "../../api";

// export default function UserProfile() {
//   const [user, setUser] = useState(null);
//   const [defaultAddress, setDefaultAddress] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [userResponse, addressesResponse] = await Promise.all([
//           api.get("profile/"),
//           api.get("address/")
//         ]);
//         console.log("profile photo",userResponse.data)
//         const userData = userResponse.data.user;
//         setUser({
//           username: userData.username,
//           firstName: userData.first_name,
//           lastName: userData.last_name,
//           email: userData.email,
//           phone_number:userData.phone_number,
          
//           walletBalance: userData.wallet_balance,
//           profilePhoto: userData.profile_photo,
//         });
//         const addresses = addressesResponse.data;
//         const defaultAddr = addresses.find(addr => addr.isDefault);
//         if (defaultAddr) {
//           setDefaultAddress(`${defaultAddr.house_no}, ${defaultAddr.city}, ${defaultAddr.state} - ${defaultAddr.pin_code}`);
//         } else {
//           setDefaultAddress(null);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (!user) {
//     return <div className="flex justify-center items-center h-screen">No user data found</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <Card className="border-2" style={{ borderColor: "#7a2828" }}>
//         <CardHeader className="text-center pb-4" style={{ backgroundColor: "#7a2828" }}>
//           <div className="flex flex-col items-center space-y-4">
//             <Avatar className="w-24 h-24 border-4 border-yellow-400">
//               <AvatarImage src={user.profilePhoto || "/placeholder.svg"} alt="Profile" />
//               <AvatarFallback className="text-2xl font-bold" style={{ backgroundColor: "#7a2828", color: "white" }}>
//                 {user.firstName[0]}{user.lastName[0]}
//               </AvatarFallback>
//             </Avatar>
//             <div>
//               <CardTitle className="text-2xl font-bold text-white">{`${user.firstName} ${user.lastName[0]}.`}</CardTitle>
//               <p className="text-yellow-300 font-medium">@{user.username}</p>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="p-6 space-y-6">
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#7a2828" }}>
//               <User className="w-5 h-5" />
//               Personal Information
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-600">First Name</label>
//                 <div className="p-3 bg-gray-50 rounded-lg border">
//                   <span className="font-medium">{user.firstName}</span>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-600">Last Name</label>
//                 <div className="p-3 bg-gray-50 rounded-lg border">
//                   <span className="font-medium">{user.lastName}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
//                 <Mail className="w-4 h-4" />
//                 Email Address
//               </label>
//               <div className="p-3 bg-gray-50 rounded-lg border">
//                 <span className="font-medium">{user.email}</span>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
//                 <Mail className="w-4 h-4" />
                
//                   Phone Number
//               </label>
//               <div className="p-3 bg-gray-50 rounded-lg border">
//                 <span className="font-medium">{user.phone_number}</span>
//               </div>
//             </div>
//           </div>

//           <Separator />

//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#7a2828" }}>
//               <MapPin className="w-5 h-5" />
//               Address
//             </h3>

//             {defaultAddress ? (
//               <div className="space-y-2">
//                 <div className="p-3 bg-gray-50 rounded-lg border">
//                   <span className="font-medium">{defaultAddress}</span>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-gray-500">No default address set</p>
//             )}
//           </div>

//           <Separator />

          
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, MapPin, Wallet, CreditCard } from "lucide-react";
import api from "../../api";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_BASE_URL
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userResponse, addressesResponse] = await Promise.all([
          api.get("profile/"),
          api.get("address/")
        ]);
        const userData = userResponse.data.user;
        setUser({
          username: userData.username,
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
          phone_number: userData.phone_number,
          profilePicture: userData.profile_picture, // Updated to match API response
        });
        const addresses = addressesResponse.data;
        const defaultAddr = addresses.find(addr => addr.isDefault);
        if (defaultAddr) {
          setDefaultAddress(`${defaultAddr.house_no}, ${defaultAddr.city}, ${defaultAddr.state} - ${defaultAddr.pin_code}`);
        } else {
          setDefaultAddress(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">No user data found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border-2" style={{ borderColor: "#7a2828" }}>
        <CardHeader className="text-center pb-4" style={{ backgroundColor: "#7a2828" }}>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24 border-4 border-yellow-400">
              <AvatarImage src={`${BASE_URL}${user.profilePicture}`} alt="Profile" />
              <AvatarFallback className="text-2xl font-bold" style={{ backgroundColor: "#7a2828", color: "white" }}>
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold text-white">{`${user.firstName} ${user.lastName[0]}.`}</CardTitle>
              <p className="text-yellow-300 font-medium">@{user.username}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#7a2828" }}>
              <User className="w-5 h-5" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">First Name</label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <span className="font-medium">{user.firstName}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Last Name</label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <span className="font-medium">{user.lastName}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="font-medium">{user.email}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4" /> {/* Updated icon for consistency */}
                Phone Number
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="font-medium">{user.phone_number}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#7a2828" }}>
              <MapPin className="w-5 h-5" />
              Address
            </h3>

            {defaultAddress ? (
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <span className="font-medium">{defaultAddress}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No default address set</p>
            )}
          </div>

          <Separator />
        </CardContent>
      </Card>
    </div>
  );
}
