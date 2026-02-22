import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddPrice from './pages/AddPrice';
import PriceComparison from './pages/PriceComparison';
import Navbar from './components/Navbar';
import ShopProfile from './pages/ShopProfile';
import UserDashboard from './pages/UserDashboard'; 
import ShopOwnerDashboard from './pages/ShopOwnerDashboard'; 
import RegisterShop from './pages/RegisterShop'; 
import AdminDashboard from './pages/AdminDashboard';
import Analytics from './pages/Analytics';
import Support from './pages/Support';
import AddProduct from './pages/AddProduct'; 
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './components/Footer';

const HomeRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (userInfo) {
    if (userInfo.role === 'admin') return <Navigate to="/admin" />;
    if (userInfo.role === 'shop_owner') return <Navigate to="/shop-dashboard" />;
    if (userInfo.role === 'consumer') return <Navigate to="/prices" />;
  }
  
  return children; 
};

const App = () => {
  return (
    <> 
      <Navbar />
      <Routes>
        <Route path="/" element={
          <HomeRoute>
            <Home />
          </HomeRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/prices" element={<PriceComparison />} />
        <Route path="/shop/:id" element={<ShopProfile />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/support" element={<Support />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/add-price" element={<AddPrice />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/shop-dashboard" element={<ShopOwnerDashboard />} />
        <Route path="/register-shop" element={<RegisterShop />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;