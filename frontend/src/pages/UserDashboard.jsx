import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/users/favorites', config);
        
        const validFavorites = data.filter(item => item && item.product);
        setFavorites(validFavorites);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching favorites', error);
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate, userInfo]);

  const removeFavorite = async (priceId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('http://localhost:5000/api/users/favorites', { priceId }, config);
   
      setFavorites(favorites.filter(item => item._id !== priceId));
    } catch (error) {
      alert("Error removing item.");
    }
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>⏳ Loading your Watchlist...</div>;

  return (
    <div style={{ backgroundColor: '#f4f6f7', minHeight: '100vh', padding: '40px 20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ backgroundColor: '#2c3e50', color: 'white', padding: '30px', borderRadius: '10px', marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 10px 0' }}>👋 Hello, {userInfo.name}</h1>
          <p style={{ margin: 0, color: '#bdc3c7' }}>Welcome to your Consumer Dashboard.</p>
        </div>

        <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px', display: 'inline-block' }}>
          ❤️ My Watchlist
        </h2>

        {favorites.length === 0 ? (
          <div style={{ backgroundColor: 'white', padding: '40px', textAlign: 'center', borderRadius: '10px', marginTop: '20px' }}>
            <h3 style={{ color: '#7f8c8d' }}>Your Watchlist is empty.</h3>
            <Link to="/prices" style={{ display: 'inline-block', marginTop: '15px', backgroundColor: '#3498db', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none' }}>
              Browse Prices
            </Link>
          </div>
        ) : (
          <div style={gridStyle}>
            {favorites.map((item) => (
              <div key={item._id} style={cardStyle}>
                
                <img 
                  src={item.product?.image || 'https://placehold.co/300x200?text=No+Image'} 
                  alt={item.product?.name} 
                  style={imageStyle} 
                />
                
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{item.product?.name}</h3>
                  <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '15px' }}>
                    🏪 <strong>{item.shop?.shopName}</strong>
                  </div>
                  
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
                      Rs. {item.price}
                    </div>
                  </div>
                </div>

                <button onClick={() => removeFavorite(item._id)} style={removeBtnStyle}>
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};


const gridStyle = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px'
};
const cardStyle = {
  backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column'
};
const imageStyle = {
  width: '100%', height: '180px', objectFit: 'cover', borderBottom: '1px solid #f1f2f6'
};
const removeBtnStyle = {
  width: '100%', padding: '12px', border: 'none', backgroundColor: '#ffeaa7', color: '#d35400', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s'
};

export default UserDashboard;