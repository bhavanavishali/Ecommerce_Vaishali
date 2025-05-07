import './App.css'
import { CartProvider } from './Context/CartContext';
import { WishlistProvider } from './Context/WishlistContext';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import SignUpForm from './Features/Auth/SignUpPage';
import Login from './Features/Auth/Login';
import { fromJSON } from 'postcss';
import AddProductForm from './Features/Auth/AddProductForm';
import Dashboard from './Features/Auth/AdminSidebar';
import ProductTable from './Features/Auth/ProductTable';
import CategoryTable from './Features/Auth/CategoryTable';
import UserHome from './Features/Auth/UserHome';
import ProductDetails from './Features/Auth/ProductDetails';
import GoogleLoginButton from './Features/Auth/GoogleLoginButton';
import Layout from './Features/Layout/Layout';
import Landingpage from './Features/Auth/LandingPage';
import ProductEdit from './Features/Auth/ProductEdit';
import AdminLogin from './Features/Auth/AdminLogin';
import UserTable from './Features/Auth/UserTable';
import UserProfile from './Features/UserProfile/UserProfile';
import AddAddress from './Features/Auth/AddAddress';
import Cart from './Features/Auth/CartPage'
import CheckoutPage from './Features/Auth/CheckoutPage';
import Myorders from './Features/UserProfile/Myorders';
import ForgotPassword from './Features/Auth/ForgotPassword';
import ResetPassword from './Features/Auth/ResetPassword';
import UserOrderDetailsPage from './Features/Auth/UserOrderDetailsPage';

import OrderTable from './Features/Auth/OrderTable';
import OrderHandlePage from './Features/Auth/OrderHandlePage';
import ViewOrderDetails from './Features/Auth/ViewOrderDetails';
import Wishlist from './Features/Auth/Wishlist';
import Invoice from './Features/Auth/Invoice';



function App() {

  return (
   <>
  <WishlistProvider>
   <CartProvider>
   <Router>
    <Routes>
      {/* User section */}
      
      <Route path='/'element={<Layout/>}>
      <Route index element={<Landingpage/>}/>
      
      <Route path='/user/home' element={<UserHome/>} />
      <Route path='/productdetails/:id' element={<ProductDetails/>} />
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/userprofile' element={<UserProfile/>}/>
      <Route path='/addaddress' element={<AddAddress/>} />
      <Route path='/checkoutpage' element={<CheckoutPage/>}/>
      <Route path='/order-details/:orderId' element={<UserOrderDetailsPage/>}/> 
      <Route path='/myorders' element={<Myorders/>}/>
      <Route path='/user/view-order-details/:id' element={<ViewOrderDetails/>}/>
      <Route path='/wishlist' element={<Wishlist/>}/>
      <Route path='/invoice/:id' element={<Invoice/>}/>
      </Route>
      {/* authentication section */}

      <Route path='/signup' element={<SignUpForm/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/google' element={<GoogleLoginButton/>} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />

      {/* Admin section */}
      <Route path='/adminLogin' element={<AdminLogin/>}/>
      
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/admin/producttable' element={<ProductTable/>} />
      <Route path='/addproduct' element={<AddProductForm/>}/>
      <Route path='/admin/categorytable' element={<CategoryTable/>} />
      <Route path='/admin/usertable' element={<UserTable/>} />
      <Route path='/admin/editproduct/:id' element={<ProductEdit/>} />
      <Route path='/admin/ordertable/' element={<OrderTable/>}/>
      
      <Route path='/admin/orderhandlepage/:id' element={<OrderHandlePage/>}/>
      
      

    </Routes>
   </Router>
   </CartProvider>
   </WishlistProvider>
   </>
  );
}

export default App
