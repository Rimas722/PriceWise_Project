import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/prices');
      setPrices(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('ADMIN ACTION: Delete this price permanently?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        await axios.delete(`http://localhost:5000/api/prices/${id}`, config);

        setPrices(prices.filter((p) => p._id !== id));
        alert('Price removed by Admin');

      } catch (error) {
        alert('Error deleting price');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: 'purple' }}>🛡️ Admin Dashboard</h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: 'purple', color: 'white' }}>
            <th style={{ padding: '10px' }}>Product</th>
            <th style={{ padding: '10px' }}>Shop</th>
            <th style={{ padding: '10px' }}>Price</th>
            <th style={{ padding: '10px' }}>Submitted By</th>
            <th style={{ padding: '10px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((item) => (
            <tr key={item._id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '10px' }}>{item.product?.name}</td>
              <td style={{ padding: '10px' }}>{item.shop?.shopName}</td>
              <td style={{ padding: '10px' }}>Rs. {item.price}</td>
                <td style={{ padding: '10px', fontSize: '12px', color: '#666' }}>
                    {item.submittedBy?.name || 'Unknown User'} 
                </td>
              <td style={{ padding: '10px' }}>
                <button 
                  onClick={() => handleDelete(item._id)} 
                  style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor:'pointer' }}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;