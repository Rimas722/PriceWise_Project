import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar' 
import Home from './pages/Home'
import PriceComparison from './pages/PriceComparison';
import Login from './pages/Login';
import Register from './pages/Register';
import AddPrice from './pages/AddPrice';
import MyListings from './pages/MyListings';
import AddProduct from './pages/AddProduct';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div>
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prices" element={<PriceComparison />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-price" element={<AddPrice />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  )
}

export default App