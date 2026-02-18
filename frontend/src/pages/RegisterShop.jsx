import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterShop = () => {
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
      alert("Please login first");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      await axios.post(
        'http://localhost:5000/api/shops',
        { shopName, address, phoneNumber },
        config
      );

      alert('Shop Registered Successfully! Waiting for Admin Approval.');
      navigate('/'); 

    } catch (error) {
      alert('Error registering shop');
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>🏪 Register Your Shop</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <label>Shop Name:</label>
        <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} style={{ padding: '10px' }} required placeholder="e.g. Colombo Supermart"/>

        <label>Address:</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={{ padding: '10px' }} required placeholder="City, Street"/>

        <label>Phone Number:</label>
        <input type="text" value={phoneNumber} onChange={(e) => setPhone(e.target.value)} style={{ padding: '10px' }} required placeholder="077..."/>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Submit for Approval
        </button>
      </form>
    </div>
  );
};

export default RegisterShop;