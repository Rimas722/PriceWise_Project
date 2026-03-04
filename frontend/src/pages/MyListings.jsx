import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyListings = () => {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const fetchMyPrices = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      try {
        const { data } = await axios.get('https://pricewise-project.onrender.com/api/prices/my-prices', config);
        setPrices(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMyPrices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this price?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        await axios.delete(`https://pricewise-project.onrender.com/api/prices/${id}`, config);

        setPrices(prices.filter((price) => price._id !== id));
        alert('Price Deleted!');
        
      } catch (error) {
        alert('Error deleting price');
        console.error(error);
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>📋 My Submitted Prices</h2>
      
      {prices.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>You haven't added any prices yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#333', color: 'white' }}>
              <th style={{ padding: '10px' }}>Product</th>
              <th style={{ padding: '10px' }}>Shop</th>
              <th style={{ padding: '10px' }}>Price</th>
              <th style={{ padding: '10px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((item) => (
              <tr key={item._id} style={{ borderBottom: '1px solid #ccc' }}>
                <td style={{ padding: '10px' }}>{item.product?.name}</td>
                <td style={{ padding: '10px' }}>{item.shop?.shopName}</td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>Rs. {item.price}</td>
                <td style={{ padding: '10px' }}>
                    <button 
                    onClick={() => handleDelete(item._id)} 
                    style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                    >
                    Delete
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyListings;