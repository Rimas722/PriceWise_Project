import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterShop = () => {
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhone] = useState('');
  
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) return alert("Please login first");

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.post('https://pricewise-project.onrender.com/api/shops', {
        shopName, address, phoneNumber
      }, config);

      alert("Shop Registered! Please wait for Admin Approval.");
      navigate('/shop-dashboard');

    } catch (error) {
      alert("Error registering shop. You might already have one!");
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f6f7', minHeight: '100vh', boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: isMobile ? '20px 10px' : '50px 20px', fontFamily: 'Arial, sans-serif' }}>
      
      <div style={{ maxWidth: '500px', width: '100%', margin: isMobile ? '0' : '0 auto', padding: isMobile ? '20px' : '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '10px', backgroundColor: 'white', boxSizing: 'border-box' }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '10px', marginTop: 0 }}>🏪 Register Your Shop</h2>
        <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '20px', fontSize: isMobile ? '0.9rem' : '1rem' }}>Join our platform to reach more customers.</p>
        
        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" placeholder="Shop Name" value={shopName} onChange={(e) => setShopName(e.target.value)} 
            required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }} 
          />
          <input 
            type="text" placeholder="Address (City, Street)" value={address} onChange={(e) => setAddress(e.target.value)} 
            required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }} 
          />
          <input 
            type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhone(e.target.value)} 
            required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }} 
          />

          <button type="submit" style={{ padding: isMobile ? '12px' : '15px', backgroundColor: '#3498db', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '5px', fontSize: isMobile ? '1rem' : '1.1rem', marginTop: '10px', width: '100%', boxSizing: 'border-box', transition: '0.3s' }}>
            Submit Application
          </button>
        </form>
      </div>

    </div>
  );
};

export default RegisterShop;