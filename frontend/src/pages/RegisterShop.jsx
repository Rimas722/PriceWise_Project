import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterShop = () => {
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhone] = useState('');
  
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) return alert("Please login first");

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.post('http://localhost:5000/api/shops', {
        shopName, address, phoneNumber
      }, config);

      alert("Shop Registered! Please wait for Admin Approval.");
      navigate('/shop-dashboard');

    } catch (error) {
      alert("Error registering shop. You might already have one!");
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius:'8px' }}>
      <h2 style={{ textAlign: 'center' }}>🏪 Register Your Shop</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom:'20px' }}>Join our platform to reach more customers.</p>
      
      <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" placeholder="Shop Name" value={shopName} onChange={(e) => setShopName(e.target.value)} 
          required style={{ padding: '10px' }} 
        />
        <input 
          type="text" placeholder="Address (City, Street)" value={address} onChange={(e) => setAddress(e.target.value)} 
          required style={{ padding: '10px' }} 
        />
        <input 
          type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhone(e.target.value)} 
          required style={{ padding: '10px' }} 
        />

        <button type="submit" style={{ padding: '12px', backgroundColor: '#2c3e50', color: 'white', border: 'none', cursor: 'pointer', fontWeight:'bold' }}>
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default RegisterShop;