import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hours ago`;
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} mins ago`;
  
  return "Just now";
};

const PriceComparison = () => {
  const [prices, setPrices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [sortOption, setSortOption] = useState('cheapest');     

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/prices');
        setPrices(data);
      } catch (error) {
        console.error('Error fetching prices', error);
      }
    };
    fetchPrices();
  }, []);

  const handleToggleFavorite = async (priceId) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) return alert("Please login to save favorites!");

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`http://localhost:5000/api/users/favorites/${priceId}`, {}, config);
      alert("Favorites Updated!");
    } catch (error) {
      alert("Error updating favorites");
    }
  };

  const handleReport = async (priceId) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) return alert("Please login to report items!");

    const reason = prompt("Why are you reporting this price? (e.g. Fake Price, Out of Stock)");
    if (!reason) return;

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('http://localhost:5000/api/reports', { priceId, reason }, config);
      alert("Report Submitted! Admin will review it.");
    } catch (error) {
      alert("Error submitting report");
    }
  };

  const filteredPrices = prices
    .filter((price) => {
      if (!price.product) return false; 

      const term = searchTerm.toLowerCase();
      const productName = price.product.name.toLowerCase() || '';
      const shopName = price.shop?.shopName.toLowerCase() || '';
      const matchesSearch = productName.includes(term) || shopName.includes(term);

      const category = price.product.category || '';
      const matchesCategory = selectedCategory === '' || category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === 'cheapest') return a.price - b.price;
      if (sortOption === 'expensive') return b.price - a.price;
      if (sortOption === 'newest') return new Date(b.updatedAt) - new Date(a.updatedAt);
      return 0;
    });

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>💰 Price Comparison</h1>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px', 
        flexWrap: 'wrap',
        backgroundColor: '#f1f1f1',
        padding: '15px',
        borderRadius: '10px'
      }}>

        <input 
          type="text" 
          placeholder="🔍 Search products..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="">All Categories</option>
          <option value="Rice">Rice</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Meat">Meat</option>
          <option value="Dairy">Dairy</option>
          <option value="Spices">Spices</option>
          <option value="Other">Other</option>
        </select>

        <select 
          value={sortOption} 
          onChange={(e) => setSortOption(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="cheapest">📉 Price: Low to High</option>
          <option value="expensive">📈 Price: High to Low</option>
          <option value="newest">🆕 Newest First</option>
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Shop</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Price (LKR)</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Save</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrices.length > 0 ? (
            filteredPrices.map((price) => (
              <tr key={price._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img 
                    src={price.product?.image || 'https://placehold.co/50'} 
                    alt={price.product?.name} 
                    style={{ width: '40px', height: '40px', borderRadius: '5px', objectFit: 'cover' }}
                  />
                  <div>
                    <b>{price.product?.name}</b>
                    <div style={{ fontSize: '0.8rem', color: '#777' }}>{price.product?.unit}</div>
                  </div>
                </td>
                <td style={{ padding: '12px', color: '#666' }}>
                  <span style={{ backgroundColor: '#eee', padding: '4px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>
                    {price.product?.category}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 'bold', color: 'green', fontSize: '1.1rem' }}>
                    Rs. {price.price}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>
                    🕒 {timeAgo(price.updatedAt)}
                  </div>
                </td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: 'green' }}>Rs. {price.price}</td>
                <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button 
                    onClick={() => handleToggleFavorite(price._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
                    title="Add to Watchlist"
                  >
                    ❤️
                  </button>

                  <button 
                    onClick={() => handleReport(price._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
                    title="Report Fake Price"
                  >
                    🚩
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PriceComparison;