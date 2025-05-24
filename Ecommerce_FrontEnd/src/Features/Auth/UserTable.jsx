// "use client";

// import { useEffect, useState } from "react";
// import { Search, Lock, Unlock } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import api from '../../api';

// export default function UserTable() {
//   // State for user table
//   const [users, setUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
  
//   // State for pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
  
//   // State for signup form dialog
//   const [showSignupDialog, setShowSignupDialog] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     username: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({});

//   // Fetch users data
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setIsLoading(true);
//         const response = await api.get('/user');
//         setUsers(response.data);
//         setIsLoading(false);
//       } catch (err) {
//         setError(err.message || "Failed to fetch users");
//         setIsLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // Handle search input change
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1); // Reset to first page on search
//   };

//   // Filter users based on search term
//   const filteredUsers = users.filter((user) =>
//     user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.phone_number?.includes(searchTerm)
//   );

//   // Calculate pagination
//   const totalItems = filteredUsers.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

//   // Handle page change
//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   // Handle items per page change
//   const handleItemsPerPageChange = (value) => {
//     setItemsPerPage(Number(value));
//     setCurrentPage(1); // Reset to first page when items per page changes
//   };

//   // Toggle user active status
//   const toggleActiveStatus = async (userId, currentIsActive) => {
//     try {
//       const response = await api.patch(`/user/${userId}/`, { is_active: !currentIsActive });
//       setUsers((prevUsers) =>
//         prevUsers.map((user) =>
//           user.id === userId ? { ...user, is_active: !currentIsActive } : user
//         )
//       );
//     } catch (err) {
//       const errorMessage = err.response?.data
//         ? JSON.stringify(err.response.data)
//         : err.message;
//       setError(`Failed to update status for user ${userId}: ${errorMessage}`);
//     }
//   };

//   // Handle form input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Validate form data
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

//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   // Handle form submission
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
//         });

//         if (response.status === 200 || response.status === 201) {
//           // Refresh user list
//           const updatedUsers = await api.get('/user');
//           setUsers(updatedUsers.data);
//           // Close dialog and reset form
//           setShowSignupDialog(false);
//           setFormData({
//             firstName: "",
//             lastName: "",
//             username: "",
//             email: "",
//             phoneNumber: "",
//             password: "",
//           });
//           setErrors({});
//         }
//       } catch (error) {
//         const errorMessage = error.response?.data
//           ? JSON.stringify(error.response.data)
//           : error.message;
//         setError(`Failed to create user: ${errorMessage}`);
//       }
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Users</h1>
//         <div className="flex gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
//             <Input
//               type="search"
//               placeholder="Search"
//               className="pl-10 w-[300px]"
//               value={searchTerm}
//               onChange={handleSearchChange}
//             />
//           </div>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="text-center py-8">Loading users...</div>
//       ) : error ? (
//         <div className="text-center py-8 text-red-600">
//           <p>Error: {error}</p>
//         </div>
//       ) : (
//         <>
//           <div className="border rounded-sm">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="font-semibold">User ID</TableHead>
//                   <TableHead className="font-semibold">User Name</TableHead>
//                   <TableHead className="font-semibold">Email</TableHead>
//                   <TableHead className="font-semibold">Phone No</TableHead>
//                   <TableHead className="font-semibold">Status</TableHead>
//                   <TableHead className="font-semibold">Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {paginatedUsers.length > 0 ? (
//                   paginatedUsers.map((user) => (
//                     <TableRow key={user.id}>
//                       <TableCell>{user.id}</TableCell>
//                       <TableCell>{user.first_name}</TableCell>
//                       <TableCell>{user.email}</TableCell>
//                       <TableCell>{user.phone_number}</TableCell>
//                       <TableCell>
//                         <Badge
//                           className={`rounded-full px-3 py-1 ${
//                             user.is_active
//                               ? "bg-green-100 text-green-800 border-green-200"
//                               : "bg-red-100 text-red-800 border-red-200"
//                           }`}
//                         >
//                           {user.is_active ? "Active" : "Blocked"}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => toggleActiveStatus(user.id, user.is_active)}
//                           title={user.is_active ? "Block user" : "Unblock user"}
//                         >
//                           {user.is_active ? (
//                             <Lock className="h-4 w-4 text-red-600" />
//                           ) : (
//                             <Unlock className="h-4 w-4 text-green-600" />
//                           )}
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={6} className="text-center py-4">
//                       No users found matching your search
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           {/* Pagination Controls */}
//           <div className="flex justify-between items-center mt-4">
//             <div className="flex items-center gap-2">
//               <span>Show</span>
//               <Select
//                 value={itemsPerPage.toString()}
//                 onValueChange={handleItemsPerPageChange}
//               >
//                 <SelectTrigger className="w-[100px]">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="5">5</SelectItem>
//                   <SelectItem value="10">10</SelectItem>
//                   <SelectItem value="20">20</SelectItem>
//                   <SelectItem value="50">50</SelectItem>
//                 </SelectContent>
//               </Select>
//               <span>per page</span>
//             </div>
//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </Button>
//               <span className="flex items-center">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <Button
//                 variant="outline"
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </Button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Signup Dialog */}
//       <Dialog open={showSignupDialog} onOpenChange={setShowSignupDialog}>
//         <DialogContent className="sm:max-w-md rounded-lg p-6 bg-white">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold text-center">Add New User</DialogTitle>
//           </DialogHeader>
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
//                 {errors.firstName && <span className="text-red-600 text-sm">{errors.firstName}</span>}
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
//                 {errors.lastName && <span className="text-red-600 text-sm">{errors.lastName}</span>}
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Input
//                 type="text"
//                 name="username"
//                 placeholder="Username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
//               />
//               {errors.username && <span className="text-red-600 text-sm">{errors.username}</span>}
//             </div>
//             <div className="space-y-2">
//               <Input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
//               />
//               {errors.email && <span className="text-red-600 text-sm">{errors.email}</span>}
//             </div>
//             <div className="space-y-2">
//               <Input
//                 type="tel"
//                 name="phoneNumber"
//                 placeholder="Phone number"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
//               />
//               {errors.phoneNumber && <span className="text-red-600 text-sm">{errors.phoneNumber}</span>}
//             </div>
//             <div className="space-y-2">
//               <Input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
//                 autoComplete="new-password"
//               />
//               {errors.password && <span className="text-red-600 text-sm">{errors.password}</span>}
//             </div>
//             <DialogFooter>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setShowSignupDialog(false)}
//                 className="h-14 rounded-full"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 className="h-14 rounded-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white"
//               >
//                 Add User
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { Search, Lock, Unlock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '../../api';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // Fetch users data with search and pagination
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/user', {
          params: {
            search: searchTerm,
            page: currentPage,
            per_page: itemsPerPage
          }
        });
        setUsers(response.data.results);
        setTotalPages(response.data.pagination.total_pages);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch users");
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [searchTerm, currentPage, itemsPerPage]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Toggle user active status
  const toggleActiveStatus = async (userId, currentIsActive) => {
    try {
      const response = await api.patch(`/user/${userId}/`, { is_active: !currentIsActive });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, is_active: !currentIsActive } : user
        )
      );
    } catch (err) {
      const errorMessage = err.response?.data
        ? JSON.stringify(err.response.data)
        : err.message;
      setError(`Failed to update status for user ${userId}: ${errorMessage}`);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form data
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

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
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
        });

        if (response.status === 200 || response.status === 201) {
          // Refresh user list
          const updatedUsers = await api.get('/user', {
            params: { search: searchTerm, page: currentPage, per_page: itemsPerPage }
          });
          setUsers(updatedUsers.data.results);
          setTotalPages(updatedUsers.data.pagination.total_pages);
          // Close dialog and reset form
          setShowSignupDialog(false);
          setFormData({
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            phoneNumber: "",
            password: "",
          });
          setErrors({});
        }
      } catch (error) {
        const errorMessage = error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message;
        setError(`Failed to create user: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex gap-4">
          <div className="relative flex items-center gap-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-10 w-[300px]"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearSearch}
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            onClick={() => setShowSignupDialog(true)}
            className="bg-[#8c2a2a] hover:bg-[#7a2424] text-white"
          >
            Add User
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          <p>Error: {error}</p>
        </div>
      ) : (
        <>
          <div className="border rounded-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">User ID</TableHead>
                  <TableHead className="font-semibold">User Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Phone No</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.first_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone_number}</TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-full px-3 py-1 ${
                            user.is_active
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          {user.is_active ? "Active" : "Blocked"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActiveStatus(user.id, user.is_active)}
                          title={user.is_active ? "Block user" : "Unblock user"}
                        >
                          {user.is_active ? (
                            <Lock className="h-4 w-4 text-red-600" />
                          ) : (
                            <Unlock className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No users found matching your search
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span>per page</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Signup Dialog */}
      <Dialog open={showSignupDialog} onOpenChange={setShowSignupDialog}>
        <DialogContent className="sm:max-w-md rounded-lg p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Add New User</DialogTitle>
          </DialogHeader>
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
                {errors.firstName && <span className="text-red-600 text-sm">{errors.firstName}</span>}
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
                {errors.lastName && <span className="text-red-600 text-sm">{errors.lastName}</span>}
              </div>
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
              />
              {errors.username && <span className="text-red-600 text-sm">{errors.username}</span>}
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
              />
              {errors.email && <span className="text-red-600 text-sm">{errors.email}</span>}
            </div>
            <div className="space-y-2">
              <Input
                type="tel"
                name="phoneNumber"
                placeholder="Phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
              />
              {errors.phoneNumber && <span className="text-red-600 text-sm">{errors.phoneNumber}</span>}
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="bg-[#f0f0ec] border-none h-14 rounded-full px-6"
                autoComplete="new-password"
              />
              {errors.password && <span className="text-red-600 text-sm">{errors.password}</span>}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSignupDialog(false)}
                className="h-14 rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-14 rounded-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white"
              >
                Add User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}