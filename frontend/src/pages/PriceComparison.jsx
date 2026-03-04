import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PriceComparison = () => {
  const [prices, setPrices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [sortOption, setSortOption] = useState('cheapest');
  const [loading, setLoading] = useState(true);

  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [maxDistance, setMaxDistance] = useState(5); 
  const [findingLocation, setFindingLocation] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportPriceId, setReportPriceId] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportImage, setReportImage] = useState('');
  const [uploadingReport, setUploadingReport] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        const priceRes = await axios.get('https://pricewise-project.onrender.com/api/prices');
        const catRes = await axios.get('https://pricewise-project.onrender.com/api/categories');
        
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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity; 

    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; 
    return distance;
  };

  const handleFindMyArea = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    
    setFindingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setFindingLocation(false);
        alert(`📍 Found you! Showing results within ${maxDistance}km.`);
      },
      (error) => {
        console.error("Error getting location", error);
        setLocationError("Couldn't find your location. Please check browser permissions.");
        setFindingLocation(false);
      }
    );
  };
  
  const clearLocationFilter = () => {
      setUserLocation(null);
  };

  const handleSave = async (priceId) => {
    if (!userInfo) {
      alert("🔐 Please login to save items to your Watchlist!");
      navigate('/login');
      return;
    }
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('https://pricewise-project.onrender.com/api/users/favorites', { priceId }, config);
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
      await axios.put(`https://pricewise-project.onrender.com/api/prices/${priceId}/upvote`, {}, config);
      
      alert('👍 You marked this as helpful! The submitter earned +2 points.');
      
      window.location.reload(); 
    } catch (error) {
      alert(error.response?.data?.message || 'Error voting.');
    }
  };

  const handleToggleStock = async (priceId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`https://pricewise-project.onrender.com/api/prices/${priceId}/stock`, {}, config);
      
      window.location.reload(); 
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating stock status.');
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
      const { data } = await axios.post('https://pricewise-project.onrender.com/api/upload', formData, {
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
      await axios.post('https://pricewise-project.onrender.com/api/reports', { 
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

        await axios.delete(`https://pricewise-project.onrender.com/api/prices/${priceId}`, config);

        setPrices(prices.filter(p => p._id !== priceId));
        alert("Price deleted successfully.");
      } catch (error) {
        alert("Error deleting price.");
      }
    }
  };

  const availableSubCategories = [...new Set(
    prices
      .filter(item => selectedCategory === '' || item.product?.category === selectedCategory)
      .map(item => item.product?.subCategory)
      .filter(Boolean) 
  )];

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

      const subCategory = price.product.subCategory || '';
      const matchesSubCategory = selectedSubCategory === '' || subCategory === selectedSubCategory;

      let matchesDistance = true;
      if (userLocation && price.shop?.latitude && price.shop?.longitude) {
         const distanceToShop = calculateDistance(
             userLocation.lat, 
             userLocation.lon, 
             price.shop.latitude, 
             price.shop.longitude
         );
         matchesDistance = distanceToShop <= maxDistance;
         price.calculatedDistance = distanceToShop;
      }

      return matchesSearch && matchesCategory && matchesSubCategory && matchesDistance;
    })
    .sort((a, b) => {
      if (sortOption === 'cheapest') return a.price - b.price;
      if (sortOption === 'expensive') return b.price - a.price;
      if (sortOption === 'newest') return new Date(b.updatedAt) - new Date(a.updatedAt);
      return 0;
    });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    return imagePath.startsWith('http') ? imagePath : `https://pricewise-project.onrender.com${imagePath}`;
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px', fontSize: '1.2rem'}}>⏳ Loading latest prices...</div>;

  return (
    <div style={{ backgroundColor: '#f4f6f7', minHeight: '100vh', padding: isMobile ? '20px 10px' : '40px 20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: isMobile ? '20px' : '40px' }}>
          <h1 style={{ color: '#2c3e50', fontSize: isMobile ? '2rem' : '2.5rem', marginBottom: '10px' }}>💰 Live Market Prices</h1>
          <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>Find the best deals in your city today.</p>
        </div>

        <div style={{ backgroundColor: 'white', padding: isMobile ? '15px' : '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: '15px', width: '100%', justifyContent: 'center' }}>
                <span style={{ fontWeight: 'bold', color: '#34495e', textAlign: 'center' }}>🌍 Find deals near me:</span>
                
                <select 
                    value={maxDistance} 
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: isMobile ? '100%' : 'auto' }}
                >
                    <option value={2}>Within 2 km</option>
                    <option value={5}>Within 5 km</option>
                    <option value={10}>Within 10 km</option>
                    <option value={25}>Within 25 km</option>
                </select>

                {!userLocation ? (
                   <button 
                       onClick={handleFindMyArea}
                       disabled={findingLocation}
                       style={{ padding: '12px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: isMobile ? '100%' : 'auto' }}
                   >
                       {findingLocation ? '⏳ Locating...' : '📍 Use My Location'}
                   </button>
                ) : (
                    <button 
                       onClick={clearLocationFilter}
                       style={{ padding: '12px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: isMobile ? '100%' : 'auto' }}
                   >
                       ❌ Clear Location Filter
                   </button>
                )}
            </div>
            {locationError && <span style={{ color: '#e74c3c', fontSize: '0.9rem', textAlign: 'center' }}>{locationError}</span>}
            {userLocation && <span style={{ color: '#27ae60', fontSize: '0.9rem', fontWeight: 'bold', textAlign: 'center' }}>✅ Showing results within {maxDistance}km of your location.</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '15px', backgroundColor: 'white', padding: isMobile ? '15px' : '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', justifyContent: 'center' }}>
          <input 
            type="text" 
            placeholder="🔍 Search for Rice, Sugar, Milk..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: isMobile ? 'none' : '1', minWidth: isMobile ? '100%' : '250px', padding: '12px 20px', borderRadius: '8px', border: '1px solid #dfe6e9', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
          />

          <select 
            value={selectedCategory} 
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubCategory(''); 
            }}
            style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #dfe6e9', fontSize: '1rem', backgroundColor: 'white', cursor: 'pointer', outline: 'none', width: isMobile ? '100%' : 'auto', boxSizing: 'border-box' }}
          >
            <option value="">🛒 All Categories</option>
            {categories.map(c => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {selectedCategory && availableSubCategories.length > 0 && (
            <select 
              value={selectedSubCategory} 
              onChange={(e) => setSelectedSubCategory(e.target.value)} 
              style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #3498db', fontSize: '1rem', backgroundColor: '#ebf5fb', color: '#2980b9', fontWeight: 'bold', cursor: 'pointer', outline: 'none', width: isMobile ? '100%' : 'auto', boxSizing: 'border-box' }}
            >
              <option value="">📂 All in {selectedCategory}</option>
              {availableSubCategories.map(subCat => (
                <option key={subCat} value={subCat}>{subCat}</option>
              ))}
            </select>
          )}

          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #dfe6e9', fontSize: '1rem', backgroundColor: 'white', cursor: 'pointer', outline: 'none', width: isMobile ? '100%' : 'auto', boxSizing: 'border-box' }}
          >
            <option value="cheapest">📉 Cheapest First</option>
            <option value="expensive">📈 Most Expensive</option>
            <option value="newest">🕒 Newest Updates</option>
          </select>
        </div>

        {filteredPrices.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#7f8c8d', fontSize: '1.2rem', padding: '0 20px' }}>
            No products found matching your search. Try expanding your search area or clearing filters.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: isMobile ? '20px' : '25px', marginTop: '30px' }}>
            {filteredPrices.map((item) => (
              <div key={item._id} style={cardStyle}>
                
                <div style={{ position: 'relative' }}>
                  <img 
                    src={getImageUrl(item.product?.image) || 'https://placehold.co/300x200?text=No+Image'} 
                    alt={item.product?.name} 
                    style={imageStyle} 
                  />
                  <span style={categoryBadgeStyle}>{item.product?.category}</span>

                  {item.inStock === false && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                      <span style={{ backgroundColor: '#e74c3c', color: 'white', padding: '10px 20px', borderRadius: '5px', fontSize: '1.2rem', fontWeight: 'bold', transform: 'rotate(-15deg)', border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                        OUT OF STOCK
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '1.3rem' }}>
                    {item.product?.name}
                  </h3>
                  
                  <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span>🏪 <strong>{item.shop?.shopName}</strong></span>
                    {userLocation && item.calculatedDistance !== undefined && (
                         <span style={{ color: '#e67e22', fontWeight: 'bold', fontSize: '0.85rem' }}>
                             📍 Approx. {item.calculatedDistance.toFixed(1)} km away
                         </span>
                    )}
                  </div>

                  {item.submittedBy && (
                    <div style={{ fontSize: '0.8rem', color: '#95a5a6', marginBottom: '10px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
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

                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px', borderTop: '1px solid #f1f2f6', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                  <button onClick={() => handleSave(item._id)} style={{ ...actionBtnStyle, padding: isMobile ? '8px' : '12px' }}>
                    ❤️ Save
                  </button>
                  <button onClick={() => handleUpvote(item._id)} style={{...actionBtnStyle, color: '#27ae60', padding: isMobile ? '8px' : '12px'}}>
                    👍 ({item.helpfulVotes?.length || 0})
                  </button>
                  <button onClick={() => openReportModal(item._id)} style={{...actionBtnStyle, color: '#e74c3c', borderRight: 'none', padding: isMobile ? '8px' : '12px'}}>
                    🚩 Report
                  </button>
                </div>

                {userInfo?.role === 'admin' && (
                  <div style={{ display: 'flex', width: '100%', borderTop: '1px solid #f1f2f6' }}>
                    <button 
                      onClick={() => handleToggleStock(item._id)} 
                      style={{ flex: 1, padding: '12px', color: 'white', backgroundColor: item.inStock === false ? '#27ae60' : '#f39c12', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderBottomLeftRadius: '10px', fontSize: isMobile ? '0.8rem' : '1rem' }}
                    >
                      {item.inStock === false ? '📦 In Stock' : '🚫 Out of Stock'}
                    </button>
                    <button 
                      onClick={() => handleDeletePrice(item._id)} 
                      style={{ flex: 1, padding: '12px', color: 'white', backgroundColor: '#c0392b', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderLeft: '1px solid white', borderBottomRightRadius: '10px', fontSize: isMobile ? '0.8rem' : '1rem' }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>

      {showReportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px', boxSizing: 'border-box' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '100%', maxWidth: '400px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box' }}>
            <h2 style={{ marginTop: 0, color: '#d63031', fontSize: isMobile ? '1.5rem' : '2rem' }}>🚩 Report Price</h2>
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
                  style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '1rem' }}
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

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexDirection: isMobile ? 'column' : 'row' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#d63031', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                  Submit Report
                </button>
                <button type="button" onClick={() => setShowReportModal(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
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

const cardStyle = { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 6px 15px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', border: '1px solid #f1f2f6' };
const imageStyle = { width: '100%', height: '200px', objectFit: 'cover', borderBottom: '1px solid #f1f2f6' };
const categoryBadgeStyle = { position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(44, 62, 80, 0.9)', color: 'white', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' };
const actionBtnStyle = { flex: 1, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold', color: '#34495e', fontSize: '0.9rem', transition: '0.2s', borderRight: '1px solid #f1f2f6' };

export default PriceComparison;