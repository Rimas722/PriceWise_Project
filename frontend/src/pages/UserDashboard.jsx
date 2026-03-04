import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [points, setPoints] = useState(userInfo?.points || 0);
  const [favorites, setFavorites] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedShop, setSelectedShop] = useState('');
  const [price, setPrice] = useState('');
  const [proofImage, setProofImage] = useState('');

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getLevelInfo = (pts) => {
    if (pts < 100) return { level: 1, title: '🥉 Price Scout', nextTier: 100 };
    if (pts < 300) return { level: 2, title: '🥈 Market Tracker', nextTier: 300 };
    if (pts < 600) return { level: 3, title: '🥇 Deal Hunter', nextTier: 600 };
    if (pts < 1000) return { level: 4, title: '💎 Local Guide', nextTier: 1000 };
    return { level: 5, title: '👑 PriceWise Guru', nextTier: pts };
  };

  const levelInfo = getLevelInfo(points);
  const progressPercentage = levelInfo.level === 5 ? 100 : (points / levelInfo.nextTier) * 100;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        const favRes = await axios.get('https://pricewise-project.onrender.com/api/users/favorites', config);
        setFavorites(favRes.data);

        const priceRes = await axios.get('https://pricewise-project.onrender.com/api/prices');
        const userHistory = priceRes.data.filter(p => 
          p.submittedBy === userInfo._id || p.submittedBy?._id === userInfo._id
        );
        setMySubmissions(userHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

        const prodRes = await axios.get('https://pricewise-project.onrender.com/api/products');
        const shopRes = await axios.get('https://pricewise-project.onrender.com/api/shops');
        setProducts(prodRes.data);
        setShops(shopRes.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [userInfo._id, userInfo.token]);

  const handleSubmitPrice = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const newPriceData = { product: selectedProduct, shop: selectedShop, price: Number(price), proofImage };
      
      const { data } = await axios.post('https://pricewise-project.onrender.com/api/prices', newPriceData, config);
      
      alert('✅ Price submitted successfully! Admin will verify soon.');
      
      const newPoints = points + 10;
      setPoints(newPoints);
      
      const updatedUser = { ...userInfo, points: newPoints };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));

      setMySubmissions([data, ...mySubmissions]);

      setShowModal(false);
      setSelectedProduct('');
      setSelectedShop('');
      setPrice('');
      setProofImage('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting price.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await axios.post('https://pricewise-project.onrender.com/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProofImage(data);
    } catch (error) {
      alert('Image upload failed');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading your dashboard...</div>;

  return (
    <div style={{ padding: isMobile ? '20px 10px' : '40px 20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '15px' : '0', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0, fontSize: isMobile ? '1.8rem' : '2rem' }}>👋 Hello, {userInfo?.name}</h1>
        <button onClick={() => setShowModal(true)} style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 6px rgba(52, 152, 219, 0.3)', width: isMobile ? '100%' : 'auto', boxSizing: 'border-box' }}>
          + Submit a New Price
        </button>
      </div>

      <div style={{ backgroundColor: 'white', padding: isMobile ? '15px' : '25px', borderRadius: '15px', boxShadow: '0 8px 20px rgba(0,0,0,0.05)', marginBottom: '40px', border: '1px solid #f1f2f6', display: 'flex', flexDirection: 'column', gap: '15px' }}>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '15px' : '0' }}>
          <div>
            <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Current Rank</p>
            <h3 style={{ margin: '5px 0 0 0', color: '#2c3e50', fontSize: isMobile ? '1.3rem' : '1.5rem' }}>
              Level {levelInfo.level}: {levelInfo.title}
            </h3>
          </div>
          <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
            <h2 style={{ margin: 0, color: '#f39c12', fontSize: '2.5rem' }}>{points}</h2>
            <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem', fontWeight: 'bold' }}>Total Points</p>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: '#7f8c8d', fontWeight: 'bold' }}>
            <span>Progress to Next Level</span>
            {levelInfo.level < 5 ? <span>{levelInfo.nextTier - points} pts to go!</span> : <span>Max Level Reached!</span>}
          </div>
          <div style={{ width: '100%', backgroundColor: '#ecf0f1', borderRadius: '10px', height: '14px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPercentage}%`, backgroundColor: '#f39c12', borderRadius: '10px', transition: 'width 0.5s ease-in-out' }}></div>
          </div>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#95a5a6', margin: 0, fontStyle: 'italic' }}>
          💡 Earn +10 points for submitting a price, and a massive +50 points when an Admin approves it!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '20px' : '30px' }}>
        
        <div style={{ backgroundColor: 'white', padding: isMobile ? '15px' : '25px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #ecf0f1', paddingBottom: '10px', marginTop: 0 }}>❤️ My Watchlist</h3>
          {favorites.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>Your Watchlist is empty.<br/><br/><Link to="/prices" style={{ color: '#3498db' }}>Browse Prices</Link></div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {favorites.map(item => (
                <li key={item._id} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f2f6', gap: isMobile ? '5px' : '0' }}>
                  <span><strong>{item.product?.name}</strong> at {item.shop?.shopName}</span>
                  <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Rs. {item.price}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ backgroundColor: 'white', padding: isMobile ? '15px' : '25px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #ecf0f1', paddingBottom: '10px', marginTop: 0 }}>📜 My Submissions</h3>
          {mySubmissions.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>You haven't submitted any prices yet!</div>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ color: '#7f8c8d', textAlign: 'left', borderBottom: '1px solid #ecf0f1' }}>
                    <th style={{ padding: '10px 0', whiteSpace: 'nowrap' }}>Date</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Price</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mySubmissions.map(sub => (
                    <tr key={sub._id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '10px 0', whiteSpace: 'nowrap' }}>{new Date(sub.createdAt).toLocaleDateString()}</td>
                      <td style={{ whiteSpace: 'nowrap' }}><strong>Rs. {sub.price}</strong></td>
                      <td style={{ whiteSpace: 'nowrap', paddingRight: '10px' }}>
                        {sub.status === 'approved' && <span style={{ backgroundColor: '#e8f8f5', color: '#27ae60', padding: '3px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>Approved (+50)</span>}
                        {sub.status === 'pending' && <span style={{ backgroundColor: '#fef5e7', color: '#f39c12', padding: '3px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>Pending</span>}
                        {sub.status === 'rejected' && <span style={{ backgroundColor: '#fadbd8', color: '#e74c3c', padding: '3px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>Rejected</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px', boxSizing: 'border-box' }}>
          <div style={{ backgroundColor: 'white', padding: isMobile ? '20px' : '30px', borderRadius: '15px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box' }}>
            <h2 style={{ marginTop: 0, color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>📸 Add a New Price</h2>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '20px' }}>Help the community and earn +10 points!</p>
            
            <form onSubmit={handleSubmitPrice} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Product:</label>
                <select required value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
                  <option value="">-- Choose Product --</option>
                  {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Shop:</label>
                <select required value={selectedShop} onChange={(e) => setSelectedShop(e.target.value)} style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
                  <option value="">-- Choose Shop --</option>
                  {shops.map(s => <option key={s._id} value={s._id}>{s.shopName}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Price (Rs):</label>
                <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 150" style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Photo Proof (Optional):</label>
                <input type="file" onChange={handleImageUpload} style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>Submit</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;