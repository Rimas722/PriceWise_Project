import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PriceComparison = () => {
  const [prices, setPrices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('cheapest');
  const [loading, setLoading] = useState(true);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportPriceId, setReportPriceId] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportImage, setReportImage] = useState('');
  const [uploadingReport, setUploadingReport] = useState(false);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const getBadge = (pts) => {
    if (!pts && pts !== 0) return '';
    if (pts < 100) return '🥉 Lvl 1';
    if (pts < 300) return '🥈 Lvl 2';
    if (pts < 600) return '🥇 Lvl 3';
    if (pts < 1000) return '💎 Lvl 4';
    return '👑 Lvl 5';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const priceRes = await axios.get('http://localhost:5000/api/prices');
        const catRes = await axios.get('http://localhost:5000/api/categories');
        
        setPrices(priceRes.data);
        setCategories(catRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (priceId) => {
    if (!userInfo) {
      alert("🔐 Please login to save items to your Watchlist!");
      navigate('/login');
      return;
    }
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('http://localhost:5000/api/users/favorites', { priceId }, config);
      alert('❤️ Saved to your Watchlist!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving item.');
    }
  };

  const handleUpvote = async (priceId) => {
    if (!userInfo) {
      alert("🔐 Please login to vote!");
      return;
    }
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`http://localhost:5000/api/prices/${priceId}/upvote`, {}, config);
      
      alert('👍 You marked this as helpful! The submitter earned +2 points.');
      
      window.location.reload(); 
    } catch (error) {
      alert(error.response?.data?.message || 'Error voting.');
    }
  };

  const openReportModal = (priceId) => {
    if (!userInfo) {
      alert("🔐 Please login to report prices!");
      navigate('/login');
      return;
    }
    setReportPriceId(priceId);
    setShowReportModal(true);
  };

  const uploadReportImageHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploadingReport(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setReportImage(data);
      setUploadingReport(false);
    } catch (error) {
      alert('Upload failed');
      setUploadingReport(false);
    }
  };

  const submitReport = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('http://localhost:5000/api/reports', { 
        priceId: reportPriceId, 
        reason: reportReason,
        proofImage: reportImage 
      }, config);
      
      alert('🚩 Report sent to the Admin successfully. Thank you!');
      
      setShowReportModal(false);
      setReportReason('');
      setReportImage('');
      setReportPriceId(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Error reporting item.');
    }
  };

  const handleDeletePrice = async (priceId) => {
    if (window.confirm("Admin: Are you sure you want to delete this live price?")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        await axios.delete(`http://localhost:5000/api/prices/${priceId}`, config);

        setPrices(prices.filter(p => p._id !== priceId));
        alert("Price deleted successfully.");
      } catch (error) {
        alert("Error deleting price.");
      }
    }
  };

  const filteredPrices = prices
    .filter((price) => {
      if (!price.product) return false; 
      if (price.status !== 'approved') return false;

      const term = searchTerm.toLowerCase();
      const productName = price.product.name.toLowerCase() || '';
      const shopName = price.shop?.shopName?.toLowerCase() || '';
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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    return imagePath.startsWith('http') ? imagePath : `http://localhost:5000${imagePath}`;
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px', fontSize: '1.2rem'}}>⏳ Loading latest prices...</div>;

  return (
    <div style={{ backgroundColor: '#f4f6f7', minHeight: '100vh', padding: '40px 20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#2c3e50', fontSize: '2.5rem', marginBottom: '10px' }}>💰 Live Market Prices</h1>
          <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>Find the best deals in your city today.</p>
        </div>

        <div style={filterContainerStyle}>
          <input 
            type="text" 
            placeholder="🔍 Search for Rice, Sugar, Milk..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />

          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={dropdownStyle}
          >
            <option value="">🛒 All Categories</option>
            {categories.map(c => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            style={dropdownStyle}
          >
            <option value="cheapest">📉 Cheapest First</option>
            <option value="expensive">📈 Most Expensive</option>
            <option value="newest">🕒 Newest Updates</option>
          </select>
        </div>

        {filteredPrices.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#7f8c8d', fontSize: '1.2rem' }}>
            No products found matching your search.
          </div>
        ) : (
          <div style={gridStyle}>
            {filteredPrices.map((item) => (
              <div key={item._id} style={cardStyle}>
                
                <div style={{ position: 'relative' }}>
                  <img 
                    src={getImageUrl(item.product?.image) || 'https://placehold.co/300x200?text=No+Image'} 
                    alt={item.product?.name} 
                    style={imageStyle} 
                  />
                  <span style={categoryBadgeStyle}>{item.product?.category}</span>
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '1.3rem' }}>
                    {item.product?.name}
                  </h3>
                  
                  <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    🏪 <strong>{item.shop?.shopName}</strong>
                  </div>

                  {item.submittedBy && (
                    <div style={{ fontSize: '0.8rem', color: '#95a5a6', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      👤 Spotted by: 
                      <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        {item.submittedBy.name}
                      </span>
                      <span style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '2px 6px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #ffeeba' }}>
                        {getBadge(item.submittedBy.points)}
                      </span>
                    </div>
                  )}

                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#27ae60' }}>
                      Rs. {item.price}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#bdc3c7', marginTop: '5px' }}>
                      Updated: {new Date(item.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={cardFooterStyle}>
                  <button onClick={() => handleSave(item._id)} style={actionBtnStyle}>
                    ❤️ Save
                  </button>

                  <button onClick={() => handleUpvote(item._id)} style={{...actionBtnStyle, color: '#27ae60'}}>
                    👍 Helpful ({item.helpfulVotes?.length || 0})
                  </button>

                  <button onClick={() => openReportModal(item._id)} style={{...actionBtnStyle, color: '#e74c3c'}}>
                    🚩 Report
                  </button>

                  {userInfo?.role === 'admin' && (
                    <button onClick={() => handleDeletePrice(item._id)} style={{...actionBtnStyle, color: 'white', backgroundColor: '#e74c3c'}}>
                      🗑️ Delete
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {showReportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '400px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
            <h2 style={{ marginTop: 0, color: '#d63031' }}>🚩 Report Price</h2>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '20px' }}>
              Help keep our community accurate. Tell us what is wrong with this listing.
            </p>

            <form onSubmit={submitReport} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Reason for Reporting:</label>
                <select 
                  required 
                  value={reportReason} 
                  onChange={(e) => setReportReason(e.target.value)} 
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                >
                  <option value="">-- Select a reason --</option>
                  <option value="Fake / Incorrect Price">Fake / Incorrect Price</option>
                  <option value="Shop is Closed">Shop is Closed / Does not exist</option>
                  <option value="Item is Out of Stock">Item is Out of Stock</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                </select>
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Upload Proof (Optional):</label>
                <input type="file" onChange={uploadReportImageHandler} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} />
                {uploadingReport && <span style={{ color: '#3498db', fontSize: '0.9rem', display: 'block', marginTop: '5px' }}>Uploading to server...</span>}
                {reportImage && <span style={{ color: '#27ae60', fontSize: '0.9rem', display: 'block', marginTop: '5px', fontWeight: 'bold' }}>✅ Image attached successfully</span>}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#d63031', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Submit Report
                </button>
                <button type="button" onClick={() => setShowReportModal(false)} style={{ padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};


const filterContainerStyle = { display: 'flex', gap: '15px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', flexWrap: 'wrap', justifyContent: 'center' };
const searchInputStyle = { flex: '1', minWidth: '250px', padding: '12px 20px', borderRadius: '8px', border: '1px solid #dfe6e9', fontSize: '1rem', outline: 'none' };
const dropdownStyle = { padding: '12px 20px', borderRadius: '8px', border: '1px solid #dfe6e9', fontSize: '1rem', backgroundColor: 'white', cursor: 'pointer', outline: 'none' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', marginTop: '40px' };
const cardStyle = { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 6px 15px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', border: '1px solid #f1f2f6' };
const imageStyle = { width: '100%', height: '200px', objectFit: 'cover', borderBottom: '1px solid #f1f2f6' };
const categoryBadgeStyle = { position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(44, 62, 80, 0.9)', color: 'white', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' };
const cardFooterStyle = { display: 'flex', borderTop: '1px solid #f1f2f6', backgroundColor: '#f8f9fa' };
const actionBtnStyle = { flex: 1, padding: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold', color: '#34495e', fontSize: '0.9rem', transition: '0.2s', borderRight: '1px solid #f1f2f6' };

export default PriceComparison;