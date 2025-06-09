import './App.css'
import { CartProvider } from './Context/CartContext';
import { WishlistProvider } from './Context/WishlistContext';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import SignUpForm from './Features/Auth/SignUpPage';
import Login from './Features/Auth/Login';
import { fromJSON } from 'postcss';
import NotFound from './Features/Auth/NotFound';
import AddProductForm from './Features/Auth/AddProductForm';
import AddVariantForm from './Features/Auth/AddProductVariant';
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
import AddressDialog from './Features/Auth/AddressDialog';
import Cart from './Features/Auth/CartPage'
import CheckoutPage from './Features/Auth/CheckoutPage';
import Myorders from './Features/UserProfile/Myorders';
import ForgotPassword from './Features/Auth/ForgotPassword';
import ResetPassword from './Features/Auth/ResetPassword';
import UserOrderDetailsPage from './Features/Auth/UserOrderDetailsPage';
import ContactPage from './Features/Layout/Contact';
import OrderTable from './Features/Auth/OrderTable';
import OrderHandlePage from './Features/Auth/OrderHandlePage';
import ViewOrderDetails from './Features/Auth/ViewOrderDetails';
import Wishlist from './Features/Auth/Wishlist';
import Invoice from './Features/Auth/Invoice';
import ProtectedRoute from './protected_route/protected_user';
import AdminProtectedRoute from './protected_route/protected_admin';
import BannerManagement from './Features/Banner/Banner';
import Report from './Features/SalesReport/Report';

function App() {

  return (
   <>
  <WishlistProvider>
   <CartProvider>
   <Router>
    <Routes>
      {/* User section */}
      
      <Route path='/'element={<Layout/>}>
      <Route path="*" element={<NotFound />} />

      <Route index element={<Landingpage/>}/>
      
        {/* user protected sessions */}

      <Route path='/user/home' element={<ProtectedRoute><UserHome/></ProtectedRoute>} />
      <Route path='/productdetails/:id' element={<ProtectedRoute><ProductDetails/></ProtectedRoute>} />
      <Route path='/cart' element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
      <Route path='/userprofile' element={<ProtectedRoute><UserProfile/></ProtectedRoute>}/>
      <Route path='/addaddress' element={<ProtectedRoute><AddAddress/></ProtectedRoute>} />
      <Route path='/checkoutpage' element={<ProtectedRoute><CheckoutPage/></ProtectedRoute>}/>
      <Route path='/order-details/:orderId' element={<ProtectedRoute><UserOrderDetailsPage/></ProtectedRoute>}/> 
      <Route path='/myorders' element={<ProtectedRoute><Myorders/></ProtectedRoute>}/>
      <Route path='/user/view-order-details/:id' element={<ProtectedRoute><ViewOrderDetails/></ProtectedRoute>}/>
      <Route path='/wishlist' element={<ProtectedRoute><Wishlist/></ProtectedRoute>}/>
      <Route path='/invoice/:id' element={<ProtectedRoute><Invoice/></ProtectedRoute>}/>
      <Route path="/contact" element ={<ContactPage/>}/>
      </Route>


      {/* authentication section */}

      <Route path='/signup' element={<SignUpForm/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/google' element={<GoogleLoginButton/>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
      

      {/* Admin section */}
      <Route path='/adminLogin' element={<AdminLogin/>}/>
      
      <Route path='/dashboard' element={<AdminProtectedRoute><Dashboard/></AdminProtectedRoute>}/>
      <Route path='/admin/producttable' element={<AdminProtectedRoute><ProductTable/></AdminProtectedRoute>} />
      <Route path='/addproduct' element={<AdminProtectedRoute><AddProductForm/></AdminProtectedRoute>}/>
      <Route path='/admin/addvariant/:product_id' element={<AdminProtectedRoute><AddVariantForm/></AdminProtectedRoute>}/>
      <Route path='/admin/categorytable' element={<AdminProtectedRoute><CategoryTable/></AdminProtectedRoute>} />
      <Route path='/admin/usertable' element={<AdminProtectedRoute><UserTable/></AdminProtectedRoute>} />
      <Route path='/admin/editproduct/:id' element={<AdminProtectedRoute><ProductEdit/></AdminProtectedRoute>} />
      <Route path='/admin/ordertable/' element={<AdminProtectedRoute><OrderTable/></AdminProtectedRoute>}/>
      <Route path='/admin/orderhandlepage/:id' element={<AdminProtectedRoute><OrderHandlePage/></AdminProtectedRoute>}/>
      <Route path='/admin/report/' element={<AdminProtectedRoute><Report/></AdminProtectedRoute>}/>
      
      

    </Routes>
   </Router>
   </CartProvider>
   </WishlistProvider>
   </>
  );
}

export default App
