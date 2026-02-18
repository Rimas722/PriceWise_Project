import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('watchlist');
  const [favorites, setFavorites] = useState([]);
  const [myContributions, setMyContributions] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const favRes = await axios.get('http://localhost:5000/api/users/favorites', config);
        setFavorites(favRes.data);

        const contribRes = await axios.get('http://localhost:5000/api/prices/my-prices', config);
        setMyContributions(contribRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteContribution = async (id) => {
    if (window.confirm('Delete this price submission?')) {
      try {
        await axios.delete(`http://localhost:5000/api/prices/${id}`, config);
        alert('Price deleted');
        setMyContributions(myContributions.filter(p => p._id !== id));
      } catch (error) {
        alert('Error deleting price');
      }
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>

      <div style={{ width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>👤 Consumer</h2>
        <div style={{ marginBottom: '20px', textAlign:'center', fontSize:'0.9rem', color:'#bdc3c7' }}>
           Hello, {userInfo.name}
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setActiveTab('watchlist')} style={itemStyle(activeTab === 'watchlist')}>❤️ My Watchlist</button>
          <button onClick={() => setActiveTab('contributions')} style={itemStyle(activeTab === 'contributions')}>🏆 My Contributions</button>
        </nav>
      </div>

      <div style={{ flex: 1, padding: '40px', backgroundColor: '#f4f6f7' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>My Dashboard</h1>
          <Link to="/add-price" style={{ backgroundColor: '#2ecc71', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            + Report New Price
          </Link>
        </div>

        {activeTab === 'watchlist' && (
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3>❤️ Saved Items</h3>
            {favorites.length === 0 ? <p>No favorites yet. Go to Prices and click ❤️.</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#ecf0f1', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>Product</th>
                    <th style={{ padding: '10px' }}>Shop</th>
                    <th style={{ padding: '10px' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {favorites.map((item) => (
                    <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{item.product?.name}</td>
                      <td style={{ padding: '10px' }}>{item.shop?.shopName}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: 'green' }}>Rs. {item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'contributions' && (
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3>🏆 Prices You Found</h3>
            <p style={{fontSize:'0.9rem', color:'#777', marginBottom:'15px'}}>Thanks for helping the community! These are prices you reported.</p>
            
            {myContributions.length === 0 ? <p>You haven't reported any prices yet.</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#ecf0f1', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>Product</th>
                    <th style={{ padding: '10px' }}>Shop</th>
                    <th style={{ padding: '10px' }}>Price</th>
                    <th style={{ padding: '10px' }}>Status</th>
                    <th style={{ padding: '10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myContributions.map((price) => (
                    <tr key={price._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{price.product?.name}</td>
                      <td style={{ padding: '10px' }}>{price.shop?.shopName}</td>
                      <td style={{ padding: '10px' }}>Rs. {price.price}</td>
                      <td style={{ padding: '10px' }}>
                         {price.status === 'approved' ? '✅ Live' : '⏳ Pending'}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <button onClick={() => handleDeleteContribution(price._id)} style={{color:'red', background:'none', border:'none', cursor:'pointer', fontWeight:'bold'}}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

const itemStyle = (active) => ({
  padding: '15px', 
  cursor: 'pointer', 
  background: active ? '#34495e' : 'transparent', 
  border: 'none', 
  color: 'white', 
  textAlign: 'left', 
  fontSize: '1rem',
  borderLeft: active ? '5px solid #2ecc71' : '5px solid transparent',
  width: '100%'
});

export default UserDashboard;