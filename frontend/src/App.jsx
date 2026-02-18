import { Routes, Route, Maps } from 'react-router-dom'
import Navbar from './components/Navbar' 
import Home from './pages/Home'
import PriceComparison from './pages/PriceComparison';
import Login from './pages/Login';
import Register from './pages/Register';
import AddPrice from './pages/AddPrice';
import MyListings from './pages/MyListings';
import AddProduct from './pages/AddProduct';
import AdminDashboard from './pages/AdminDashboard';
import ShopProfile from './pages/ShopProfile';
import RegisterShop from './pages/RegisterShop';
import UserDashboard from './pages/UserDashboard';
import Analytics from './pages/Analytics';
import Support from './pages/Support';
import ShopOwnerDashboard from './pages/ShopOwnerDashboard';

const HomeRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (userInfo) {
    if (userInfo.role === 'admin') return <Navigate to="/admin" />;
    if (userInfo.role === 'shop_owner') return <Navigate to="/shop-dashboard" />;
    if (userInfo.role === 'consumer') return <Navigate to="/prices" />;
  }
  
  return children; 
};

function App() {
  return (
    <div>
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<HomeRoute><Home /></HomeRoute>} />
        <Route path="/prices" element={<PriceComparison />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-price" element={<AddPrice />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/shop/:id" element={<ShopProfile />} />
        <Route path="/register-shop" element={<RegisterShop />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/support" element={<Support />} />
        <Route path="/shop-dashboard" element={<ShopOwnerDashboard />} />
      </Routes>
    </div>
  )
}

export default App